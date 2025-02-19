const {StringDecoder}=require('string_decoder');
const url=require('url');
const routes=require('../routes');
const {notFoundHandler}=require('../handlers/routeHandlers/notFoundHandler');
const {parseJSON}=require('../helpers/utilities');

const handler={};

handler.handleReqRes=(req,res)=>{
    const parsedUrl=url.parse(req.url,true);
    const path=parsedUrl.pathname;
    const trimmedPath=path.replace(/^\/+|\/+$/g,'');
    const method=req.method.toLowerCase();
    const queryStringObject=parsedUrl.query;
    const headersObject=req.headers;

    const requestProperties={
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    }

    const decoder=new StringDecoder('utf-8');
    let realData='';
    const chosenHandler=routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    req.on('data',(buffer)=>{
        realData+=decoder.write(buffer);
        //console.log(realData);
    });
    req.on('end',()=>{
        realData+=decoder.end();
        console.log(realData);
        requestProperties.body=parseJSON(realData);
        chosenHandler(requestProperties,(statusCode,payload)=>{
            statusCode=typeof(statusCode)==='number' ? statusCode : 500;
            payload=typeof(payload)==='object' ? payload : {};
            const payloadString=JSON.stringify(payload);
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
        //res.end('Hello World');
    })
}

module.exports=handler;