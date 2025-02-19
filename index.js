const http=require('http');
const {handleReqRes}=require('./helpers/handleReqRes');
const environment=require('./helpers/environments');
const data=require('./lib/data');

const app={};

data.delete('test','newFile',(err)=>{
    console.log(`error was`,err);
})

app.handleReqRes=handleReqRes;

app.createServer=()=>{
    const server=http.createServer(app.handleReqRes);
    server.listen(environment.port,()=>{
        console.log(`listening to port ${environment.port}`);
    })
}

app.createServer();