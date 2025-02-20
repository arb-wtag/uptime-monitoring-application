const { parseJSON } = require('../helpers/utilities');
const data=require('./data');
const url=require('url');
const http=require('http');
const https=require('https');
const { sendTwilioSms } = require('../helpers/notifications');

const worker={};

worker.alertUserToStatusChange=(checkData)=>{
    let message=`Alert: Your check for ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} is currently ${checkData.state}`;
    sendTwilioSms(checkData.userPhone,message,(err)=>{
        if(!err)
        {
            console.log(`User was alerted to a status change via sms: ${message}`);
        }
        else
        {
            console.log('There was a problem sending sms to one of the user');
        }
    })
}

worker.processCheckOutcome=(checkData,checkOutcome)=>{
    let state=!checkOutcome.error && checkOutcome.responseCode && checkData.successCodes.indexOf(checkOutcome.responseCode)>-1 ? 'up' : 'down';
    let alertWanted=checkData.lastChecked && checkData.state!==state ? true : false;
    let newCheckData=checkData;
    newCheckData.state=state;
    newCheckData.lastChecked=Date.now();
    data.update('checks',newCheckData.id,newCheckData,(err)=>{
        if(!err)
        {
            if(alertWanted)
            {
                worker.alertUserToStatusChange(newCheckData);
            }
            else
            {
                console.log('Alert is not needed as there is no state change!');
            }
        }
        else
        {
            console.log('Error: trying to save check data of one of the checks!');
        }
    });
}

worker.performCheck=(checkData)=>{
    let checkOutcome={
        'error': false,
        'value': false
    };
    let outcomeSent=false;
    let parsedUrl=url.parse(checkData.protocol+'://'+checkData.url,true);
    let hostname=parsedUrl.hostname;
    let path=parsedUrl.path;
    const requestDetails={
        'protocol': checkData.protocol+':',
        'hostname': hostname,
        'method': checkData.method.toUpperCase(),
        'path': path,
        'timeout': checkData.timeoutSeconds*1000,
    };
    const protocolToUse=checkData.protocol==='http' ? http : https;
    let req=protocolToUse.request(requestDetails,(res)=>{
        const status=res.statusCode;
        checkOutcome.responseCode=status;
        if(!outcomeSent)
        {
            worker.processCheckOutcome(checkData,checkOutcome);
            outcomeSent=true;
        }
    });
    req.on('error',(err)=>{
        checkOutcome={
            'error': true,
            'value': err
        }
        if(!outcomeSent)
        {
            worker.processCheckOutcome(checkData,checkOutcome);
            outcomeSent=true;
        }
    });
    req.on('timeout',()=>{
        checkOutcome={
            'error':true,
            'value': 'timeout'
        }
        if(!outcomeSent)
        {
            worker.processCheckOutcome(checkData,checkOutcome);
            outcomeSent=true;
        }
    });
    req.end();
};

worker.validateCheckData=(checkData)=>{
    if(checkData && checkData.id)
    {
        checkData.state=typeof(checkData.state)==='string' && ['up','down'].indexOf(checkData.state)>-1 ? checkData.state : 'down';
        checkData.lastChecked=typeof(checkData.lastChecked)==='number' && checkData.lastChecked>0 ? checkData.lastChecked : false;
        worker.performCheck(checkData);
    }
    else
    {
        console.log('Error: check was invalid or not properly formatted!');
    }
}

worker.gatherAllChecks=()=>{
    data.list('checks',(err,checks)=>{
        if(!err && checks && checks.length>0)
        {
            checks.forEach((check)=>{
                data.read('checks',check,(err,checkData)=>{
                    if(!err && checkData)
                    {
                        worker.validateCheckData(parseJSON(checkData));
                    }
                    else
                    {
                        console.log('Error reading one of the check data');
                    }
                })
            });
        }
        else
        {
            console.log('Error: could not find any checks to process!');
        }
    });
}

worker.loop=()=>{
    setInterval(()=>{
        worker.gatherAllChecks();
    },1000*60);
}

worker.init=()=>{
    worker.gatherAllChecks();
    worker.loop();

}

module.exports=worker;