var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

// var User = mongoose.model("users", { name: String });
//
// var user1 = new User({name: 'from Mongoos'}); // creats in memory
// user1.save();
// User.find({}, function(err, data) {
//   console.log(data);
// });

var Question = mongoose.model("Question", {
  body: {type: String, required: true},
  email: {type: String, required: true},
  createdAt: Date
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  res.send('Just testing');
});
router.post('/test', function(req, res, next) {
  var response = req.body;
  response.serverTime = new Date();
  res.send(response);
});
router.post('/questions', function(req, res) {
  var question = new Question(req.body);
  question.createdAt = new Date();
  question.save(function(err, savedQuestion) {
    if (err) {
      res.status(400).json({ error: "Validation Failed" });
    }
    res.json(savedQuestion);
  });
});

module.exports = router;
