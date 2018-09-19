const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  time: { type: String, required: true },
  content: { type: String, required: true }
});

const NextSchema = new Schema(
  {
    nextTime: {
      date: { type: String, required: true },
      month: { type: String, required: true },
      year: { type: String, required: true }
    },
    place: {
      company: { type: String, required: true },
      companyLink: { type: String, required: false },
      address: { type: String, required: true }
    },
    schedule: { type: [ScheduleSchema], required: false }
  },
  {
    collection : 'next'
  }
);

module.exports = mongoose.model('next', NextSchema);

