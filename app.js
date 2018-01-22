var express = require('express'),
    multer  = require('multer'),
    UPLOAD_DIR = __dirname + '/uploads/',
    upload = multer({ dest: UPLOAD_DIR }),
    app = express();

var fs = require('fs-extra');

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(express.static(UPLOAD_DIR));

app.get('/', function (req, res) {
  res.sendfile('index.html' );
});

app.post('/upload', upload.single('userFile'), function (req, res, next) {
  console.log(req.file);
  console.log(UPLOAD_DIR + req.file.originalname);

  var src = req.file.path,
      dest = UPLOAD_DIR + req.file.originalname;

  fs.move(src, dest,
          {clobber: true},
          function (err) {
            if (err) {
              res.status(500);
              res.send(err);
            } else {
              //res.send('ok');
              res.json({ imageId: '123',
                         imageUrl: req.file.originalname
                       });
            }
          });
});

app.listen(4002, function () {
  console.log('open http://localhost:4002/');
});
