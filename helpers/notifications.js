const https=require('https');
const {twilio}=require('./environments');
const queryString=require('querystring');

const notifications={};

notifications.sendTwilioSms=(phone,message,callback)=>{
    const userPhone=typeof(phone)==='string' && phone.trim().length===11 ? phone.trim() : false;
    const userMessage=typeof(message)==='string' && message.trim().length>0 && message.trim().length<=1600 ? message.trim() : false;
    console.log(userPhone);
    console.log(userMessage);
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
            if(status===200 || status===201)
            {
                callback(false);
            }
            else
            {
                callback(`Status code returned was ${status}`);
            }
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