require('dotenv').config();

const environments={};

environments.staging={
    port: 3000,
    envName: 'staging',
    secretKey: process.env.SECRET_KEY_STAGING,
    maxChecks: 5,
    twilio: {
        fromPhone: process.env.FROM_PHONE,
        accountSid: process.env.ACCOUNT_SID,
        authToken: process.env.AUTH_TOKEN
    },
};

environments.production={
    port: 5000,
    envName: 'production',
    secretKey: process.env.SECRET_KEY_PRODUCTION,
    maxChecks: 5,
    twilio: {
        fromPhone: process.env.FROM_PHONE,
        accountSid: process.env.ACCOUNT_SID,
        authToken: process.env.AUTH_TOKEN
    },
};

const currentEnvironment=typeof(process.env.NODE_ENV)==='string' ? process.env.NODE_ENV : 'staging';

const environmentToExport=typeof(environments[currentEnvironment])==='object' ? environments[currentEnvironment] : environments.staging;

module.exports=environmentToExport;