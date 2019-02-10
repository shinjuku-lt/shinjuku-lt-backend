const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require("moment");
const multer = require('multer');
const path = require('path');
const cors = require( 'cors' );

const upDir = path.join(__dirname, 'upload');
const uploadDir = multer({dest: upDir});

const uploadPdf2Drive = require("./app/middlewares/drive")

app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());

function isLogin() {
  // TODO かねぽん
  return false;
}

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, err => {

  app.get('/health', (req, res) => {
    res.json({message: 'woooooooooooo.'});
  });
  let Slide = require('./app/models/slide');
  app.route('/slide')
  .get((req, res) => {
    const ignoreTypes = isLogin() ? [] : ['pdf']
    Slide.find({'presentation.serviceType': {$nin: ignoreTypes}}).exec((err, slides) => {
      const response = slides.reduce((response, currentSlide) => {
        const padMonth = ('00' + currentSlide.publish.month).slice(-2);
        const key = `${currentSlide.publish.year}${padMonth}`;
        if (currentSlide.presentation.serviceType === 'pdf') {
          currentSlide.presentation.presentationUrl = currentSlide.presentation.presentationUrl.replace(/view.*/g, 'preview');
        }
        response[key] = response[key] || [];
        response[key].push(
          {
            type: currentSlide.presentation.serviceType,
            presenter: currentSlide.presentation.presenter,
            page: {
              url: currentSlide.presentation.presentationUrl,
              width: 335,
              height: 230
            }
          });
          return response;
        }, {}
        );
        res.json(response);
      })
    })
    .post((req, res) => {
      let slide = new Slide();
      slide.publish.month = req.body.publish.month;
      slide.publish.year = req.body.publish.year;
      slide.presentation.presentationUrl = req.body.presentation.presentationUrl;
      slide.presentation.presenter = req.body.presentation.presenter;
      slide.presentation.serviceType = req.body.presentation.serviceType;
      slide.createdAt = moment.now();
      slide.updatedAt = moment.now();
      slide.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({text: "良いスライドやん"});
      });
    });

    app.post('/upload-pdf', uploadDir.single('upFile'), (req, res) => {
      const publishDate = moment(req.body.date);

      uploadPdf2Drive(req.file, (url) => {
        const slide = new Slide();
        slide.publish.month = publishDate.month() + 1; // 0始まりになるので1足す
        slide.publish.year = publishDate.year();
        slide.presentation.presentationUrl = url;
        slide.presentation.presenter = req.body.presenter;
        slide.presentation.serviceType = 'pdf';
        slide.createdAt = moment.now();
        slide.updatedAt = moment.now();
        slide.save().then(product => {
          console.log(product);
          res.redirect('/');
        }).catch(err => console.error(err))
      })
    })

    let NextSlide = require('./app/models/next');
    app.route('/next')
    .get((req, res) => {
      NextSlide.findOne({}).exec((err, next) => {
        const padMonth = ('00' + next.nextTime.month).slice(-2);
          const padDate = ('00' + next.nextTime.date).slice(-2);
          next.nextTime.month = padMonth
          next.nextTime.date = padDate
          res.json(next);
        })
      })
      .put((req, res) => {
        NextSlide.findOneAndUpdate({}, req.body, (err, next) => {
          const padMonth = ('00' + next.nextTime.month).slice(-2);
          const padDate = ('00' + next.nextTime.date).slice(-2);
          next.nextTime.month = padMonth
          next.nextTime.date = padDate
          res.json(next);
        })
      })
  }
);

app.get('/', (req, res) => {
  res.send(
    `
    <form method="post" action="/upload-pdf" enctype="multipart/form-data">
      <input type="text" name="title"><br />
      <input type="text" name="presenter"><br />
      <input type="date" name="date"><br />
      <input type="file" name="upFile" /><br />
      <button >x</button>
    </form>
    `
  );
});


app.listen(3000, function () {
  console.log('listening on port 3000!');
});
