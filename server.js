const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require("moment");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}@${process.env.HOST}:${process.env.PORT}/${process.env.DB}`, err => {

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
            res.json({message: 'Slide created!'});
          });
        }
      );
  }
);

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

