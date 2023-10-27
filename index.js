const app = require('express')();
let fs = require('fs');
const path = require('path');
const fluentFfmpeg = require('fluent-ffmpeg');
let videoExtensions = [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".flv", ".webm", ".3gp", ".m4v", ".mpeg", ".mpg", ".rm", ".rmvb", ".divx", ".asf", ".ogg", ".m2ts", ".vob", ".ogv", ".f4v", ".mpg2"];
const PORT = 8080;


function dirTree(filename) {
    let stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info = fs.readdirSync(filename).map(function (child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        info.type = "file";

        info.extension = path.basename(filename).split('.')[(path.basename(filename).split('.').length - 1)]
    }
    return info
}

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))

})

app.get('/file', (req, res) => {
    let folderJson = dirTree('C:/Users/RAHUL JANGIR/Videos')
    let filtered = folderJson.flat(Infinity).filter((v) => {
        return videoExtensions.includes('.' + v.extension.toLowerCase())
    })
    res.json(filtered)
})
app.get('/poster', (req, res) => {
    res.sendFile(path.join(__dirname, "1.png"))
})

app.get('/video/:link', (req, res) => {
    let range = req.headers.range
    if (!range) {
        res.status(400).send("please send Range")
        return;
    }
    // console.log(req.headers)
    let videoPath = `C:/${req.params.link.split('_-_-_').join('/')}`
    let video = fs.statSync(videoPath)
    let size = video.size;
    let chuckSize = (10 ** 6) * 2;
    let start = Number(range.replace(/\D/g, ""))
    let end = Math.min(start + chuckSize, size - 1)
    let Content_length = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Contenet-Length": Content_length,
        "Content-Type": "Video/mkv"
    }
    res.writeHead(206, headers);
    const videoStrim = fs.createReadStream(videoPath, { start, end })
    videoStrim.pipe(res)
})

app.listen(PORT, (PORT) => {
    console.log("Running")
})