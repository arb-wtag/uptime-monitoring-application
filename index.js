const http=require('http');
const {handleReqRes}=require('./helpers/handleReqRes');
const environment=require('./helpers/environments');
const data=require('./lib/data');
const server=require('./lib/server');
const worker=require('./lib/worker');

const app={};

app.init=()=>{
    server.init();
    worker.init();
};

app.init();

module.exports=app;