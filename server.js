const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const bodyParser = require('body-parser');
const search = require("./helper/youtube_search")
const path = require('path');
const youtube = require("./helper/youtube");
const functions = require('./helper/functions');

const app = express();
const port = 5000;

app.use(logger('dev'));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({limit: '1mb'}));
app.use(bodyParser.urlencoded({  extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




app.get('/', (req, res) => {
    res.render('index.html');
});
app.get('/download', (req, res) => {
    const id = req.query.id
    res.render('download.html', {
        id: id
    });
});


app.get('/suggestion', async (req, res) => {
    const query  = req.query.query
    const result = await youtube.suggestion(query)
    res.status(200).json(result)
});

app.get('/search', async (req, res) => {
    const query = req.query.query
    const type  = req.query.type
    const result = await youtube.search(query, type)
    res.status(200).json(result)
});

app.get('/getVideoById', async (req, res) => {
    const id        =  req.query.id
    const formats   =  await youtube.getFormats(id)
    const videoInfo =  await youtube.search(id, "videoId")

    res.status(200).json({
    video: videoInfo,
    download: {
        formats: formats.links,
        token: {
            token: formats.token,
            time: formats.timeExpires
        }
    }
    })
    });
app.post('/download', async (req, res) => {
    const body = req.body.info
    const video = body.video

    const result = await youtube.download(
        body.videoId,
        body.type,
        body.quality,
        body.token,
        body.time,
        body.video
    )
        if(body.type == "mp3") {
            const fs = require("fs")
            const buffer = await functions.getBuffer(result)
            const tags   = await functions.addTags(buffer, video.title, video.thumbnail) 
            const stream = functions.bufferToStream(tags)
            
            res.setHeader('Content-Type', 'audio/mp3');
            res.header('Content-Disposition', 'attachment; filename=' + video.title + ".mp3")
            stream.pipe(res)
            

        } else {
            res.status(200).json({
                type: "url",
                source: result
            })
        }
});
app.post('/post', async (req, res) => {

    console.log(req.body)
});



app.use(function (req, res, next) {
    var err    = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        'message': err.message
    });
});

app.listen(port, () => {
    console.log(`Starting on port ${port}`);
});