const express = require('express')
const app = express()
const fs = require('fs')
const path = './video.mp4'
const stats = fs.statSync(path)
const fileSize = stats.size
app.get('/vid',(req,res) =>{
    const range = req.header.range
    if(range){
        const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
    }
    else{
        const head = {
            'Content-Length' : fileSize,
            'Content-Type' : 'video/mp4'
        }
        res.writeHead(200,head);
        fs.createReadStream(path).pipe(res);
    }
})

app.get('/vid1',(req,res) => {
    res.sendFile(path)
})
app.listen(3000)