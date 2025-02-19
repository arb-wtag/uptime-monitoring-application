const crypto=require('crypto');
const environments=require('./environments');

const utilities={};

utilities.parseJSON=(jsonString)=>{
    let output;
    try{
        output=JSON.parse(jsonString);
    }
    catch{
        output={};
    }
    return output;
}

utilities.hash=(str)=>{
    if(typeof(str)==='string' && str.length>0)
    {
        let hash=crypto.createHmac('sha256',environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
}

utilities.createRandomString=(strLength)=>{
    let length=typeof(strLength)==='number' && strLength>0 ? strLength : false;
    if(length)
    {
        let possibleCharacters='abcdefghijklmnopqrstuvwxyz1234567890';
        let output='';
        for(let i=1;i<=length;i++)
        {
            let randomCharacter=possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));
            output+=randomCharacter;
        }
        return output;
    }
    return false;
}

module.exports=utilities;