const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require("moment");

app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, err => {

    app.get('/health', (req, res) => {
      res.json({message: 'woooooooooooo.'});
    });
    let Slide = require('./app/models/slide');
    app.route('/slide')
      .get((req, res) => {
        Slide.find({}).exec((err, slides) => {
          const response = slides.reduce((response, currentSlide) => {
              const padMonth = ('00' + currentSlide.publish.month).slice(-2);
              const key = `${currentSlide.publish.year}${padMonth}`;
              response[key] = response[key] || [];
              response[key].push(
                {
                  name: '',
                  author: '',
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
          let body = '';
          req.on('data', function (data) {
            body += data;
          });
          const params = req.body.text.split(" ", -1);
          const year = params[1].slice(0, -2);
          const month = params[1].slice(-2);
          const user = params[2];
          const serviceType = params[3];
          const url = params[4];
          let slide = new Slide();
          slide.publish.month = month;
          slide.publish.year = year;
          slide.presentation.presentationUrl = url;
          slide.presentation.presenter = user;
          slide.presentation.serviceType = serviceType;
          slide.createdAt = moment.now();
          slide.updatedAt = moment.now();
          slide.save(err => {
            if (err) {
              res.send(err);
            }
            res.json({text: "良いスライドやん"});
          });
        }
      );
  }
);

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

