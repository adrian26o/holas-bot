const fs = require("fs");
const path = require("path");

module.exports = []

fs.readdir(__dirname,undefined,(err,files)=>{

    files.forEach((file)=>{
        if(__dirname+path.posix.sep+file==__filename) return;
        if(__dirname+path.posix.sep+file==__dirname+path.posix.sep+"tools.js") return;

        const command = require(__dirname+path.posix.sep+file);
        module.exports.push(command)
    })
})
