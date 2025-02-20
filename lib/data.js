const fs=require('fs');
const path=require('path');

const lib={};

lib.basedir=path.join(__dirname,'/../.data/');

lib.create=function(dir,file,data,callback){
    fs.open(lib.basedir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor)
        {
            const stringData=JSON.stringify(data);

            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(error){
                        if(!error)
                        {
                            callback(false);
                        }
                        else
                        {
                            callback('Error closing the new file!');
                        }
                    });
                }
                else {
                    callback('Error writing to new file!');
                }
            });
        }
        else
        {
            callback('Could not create new file, it may already exist!')
        }
    });
};

lib.read=(dir,file,callback)=>{
    fs.readFile(lib.basedir+dir+'/'+file+'.json','utf8',(err,data)=>{
        callback(err,data);
    });
};

lib.update=(dir,file,data,callback)=>{
    fs.open(lib.basedir+dir+'/'+file+'.json','r+',(err,fileDescriptor)=>{
        if(!err && fileDescriptor)
        {
            const stringData=JSON.stringify(data);
            fs.ftruncate(fileDescriptor,(err)=>{
                if(!err)
                {
                    fs.writeFile(fileDescriptor,stringData,(err)=>{
                        if(!err)
                        {
                            fs.close(fileDescriptor,(err)=>{
                                if(!err)
                                {
                                    callback(false);
                                }
                                else{
                                    callback('error closing file');
                                }
                            })
                        }
                        else
                        {
                            callback('Error writing to file');
                        }
                    });
                }
                else
                {
                    callback('Error truncating file!');
                }
            })
        }
        else
        {
            callback('Error updating. File may not exist');
        }
    })
}

lib.delete=(dir,file,callback)=>{
    fs.unlink(lib.basedir+dir+'/'+file+'.json',(err)=>{
        if(!err)
        {
            callback(false);
        }
        else
        {
            callback('Error deleting file');
        }
    })
}

lib.list=(dir,callback)=>{
    fs.readdir(lib.basedir+dir+'/',(err,fileNames)=>{
        if(!err && fileNames && fileNames.length>0)
        {
            let trimmedFileNames=[];
            fileNames.forEach((fileName)=>{
                trimmedFileNames.push(fileName.replace('.json',''));
            });
            callback(false,trimmedFileNames);
        }
        else
        {
            callback('Error reading directory!');
        }
    })
}

module.exports=lib;