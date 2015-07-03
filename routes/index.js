var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MD5 = require("MD5");
var slug = require("slug");

mongoose.connect("mongodb://localhost/test");

// var User = mongoose.model("users", { name: String });
//
// var user1 = new User({name: 'from Mongoos'}); // creats in memory
// user1.save();
// User.find({}, function(err, data) {
//   console.log(data);
// });

var Question = mongoose.model("Question", {
  slug: { type: String, required: true, unique: true },
  body: {type: String, required: true, unique: true},
  email: {type: String, required: true},
  gravatarUrl: { type: String, required: true },
  createdAt: {type: Date, default: Date.now(), required: true}
});

// temp500Qs = Array.apply(null, Array(500)).map(function(n, i) { return {body: "Q" + i, email: "fake@fake.fake"}; });
// Question.create(temp500Qs);
Question.on("index", function(err) {
  console.log(err);
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

  question.slug = slug(req.body.body);
  console.log(question.slug);
  question.gravatarUrl = "http://www.gravatar.com/avatar/" + MD5(req.body.email);

  question.save(function(err, savedQuestion) {
    if (err) {
      res.status(400).json({ error: "Validation Failed" });
    }
    var question = Question.find({})
                    .sort({createdAt: -1})
                    .limit(10).exec(function(err, data) {
      if (err) {
          res.status(400).json({ error: "Invalid questions request" });
      }
      res.json(savedQuestion);
    });
  });
});
router.get('/questions', function(req, res) {
  var question = Question.find({})
                  .sort({createdAt: -1})
                  .limit(10).exec(function(err, data) {
    if (err) {
        res.status(400).json({ error: "Invalid questions request" });
    }
    res.json(data);
  });
});

module.exports = router;
