const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlideSchema = new Schema({
  publish: {
    month: { type: Number, required: true },
    year: { type: Number, required: true }
  },
  presentation: {
    presentationUrl: { type: String, required: true, unique: true},
    presenter: { type: String, required: true },
    serviceType: { type: String, required: true }
  },
  createdAt: {type: Date},
  updatedAt: {type: Date}
},
{
  collection : 'slide'
});

module.exports = mongoose.model('slide', SlideSchema);
