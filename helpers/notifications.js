const https=require('https');
const {twilio}=require('./environments');
const queryString=require('querystring');

const notifications={};

notifications.sendTwilioSms=(phone,message,callback)=>{
    const userPhone=typeof(phone)==='string' && phone.trim().length===11 && /^\d+$/.test(phone.trim()) ? phone.trim() : false;
    const userMessage=typeof(message)==='string' && message.trim().length>0 && message.trim().length<=1600 ? message.trim() : false;
    console.log(userPhone); //here I can see 01234567899 in the console, can you analyze further to find the error?
    //console.log(userMessage);
    if(userPhone && userMessage)
    {
        const payload={
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMessage
        }
        const payloadString=queryString.stringify(payload);

        const requestDetails={
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
        }
        const req=https.request(requestDetails,(res)=>{
            const status=res.statusCode;
            /*if(status===200 || status===201)
            {
                callback(false);
            }
            else
            {
                callback(`Status code returned was ${status}`);
            }*/
           let responseData='';
           res.on('data',(chunk)=>{
            responseData+=chunk;
           });
           res.on('end',()=>{
            if(status===200 || status===201)
            {
                callback(false);
            }
            else
            {
                callback(`Status code: ${status}, Response: ${responseData}`);
            }
           });
        });
        req.on('error',(err)=>{
            callback(err);
        })
        req.write(payloadString);
        req.end();
    }
    else
    {
        callback("Given parameters were missing or invalid!");
    }
}

module.exports=notifications;