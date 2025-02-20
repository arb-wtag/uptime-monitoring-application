const http=require('http');
const {handleReqRes}=require('../helpers/handleReqRes');
const environment=require('../helpers/environments');
//const data=require('./lib/data');

const server={};

server.handleReqRes=handleReqRes;

server.createServer=()=>{
    const myServerVar=http.createServer(server.handleReqRes);
    myServerVar.listen(environment.port,()=>{
        console.log(`listening to port ${environment.port}`);
    })
}

server.init=()=>{
    server.createServer();
}

module.exports=server;