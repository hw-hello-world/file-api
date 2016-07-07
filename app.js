var express = require('express'),
    multer  = require('multer'),
    UPLOAD_DIR = __dirname + '/uploads/',
    upload = multer({ dest: UPLOAD_DIR }),
    app = express();

var fs = require('fs-extra');

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('/', function (req, res) {
  res.sendfile('index.html' );
});

app.post('/upload', upload.single('userFile'), function (req, res, next) {
  console.log(req.file);
  console.log(UPLOAD_DIR + req.file.originalname);

  fs.move(req.file.path,
          UPLOAD_DIR + req.file.originalname,
          {clobber: true},
          function (err) {
            if (err) {
              res.status(500);
              res.send(err);
            } else {
              //res.send('ok');
              res.json({done: 'succeed'});
            }
          });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
