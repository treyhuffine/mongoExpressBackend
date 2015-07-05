var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MD5 = require("MD5");
var slug = require("slug");

mongoose.connect("mongodb://localhost/test");
// mongoose.connect(process.env.MONGOLAB_URI);

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
  createdAt: {type: Date, default: Date.now(), required: true},
  answers: [{
    body: String,
    email: String,
    gravatarUrl: String,
    createdAt: {type: Date, default: Date.now()}
  }]
});

// temp500Qs = Array.apply(null, Array(500)).map(function(n, i) { return {body: "Q" + i, email: "fake@fake.fake"}; });
// Question.create(temp500Qs);
Question.on("index", function(err) {
  console.log(err);
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/tests', function(req, res, next) {
  Question.remove({}, function() {
    res.render('tests');
  });
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

  question.slug = slug(req.body.body || '');
  question.gravatarUrl = "http://www.gravatar.com/avatar/" + MD5(req.body.email);
  console.log(question);
  question.save(function(err, savedQuestion) {
    if (err) {
      res.status(400).json({ error: "Validation Failed" });
    }
    res.json(savedQuestion);
  });
});
router.get("/questions", function(req, res) {
  Question.find({}).sort({ createdAt: 'desc' }).limit(20).exec(function(err, questions) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read questions data" });
    }
    res.json(questions);
  });
});
router.get("/questions/:questionCode", function(req, res) {
  Question.findOne({slug: req.params.questionCode}).exec(function(err, question) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read questions data" });
    }
    if (!question) {
      res.status(404);
    }
    res.json(question);
  });
});
router.patch("/questions/:questionCode", function(req, res) {
  console.log("patch",req.params.questionCode, req);
  Question.findOneAndUpdate({ slug: req.params.questionCode }, req.body, { new: true },
    function(err, updatedQuestion) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not read questions data" });
      }
      if (!updatedQuestion) {
        res.status(404);
      }
      res.json(updatedQuestion);
    });
});
router.delete("/questions/:questionCode", function(req, res) {
  Question.findOneAndRemove({ slug: req.params.questionCode },
    function(err, updatedQuestion) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not read questions data" });
      }
      if (!updatedQuestion) {
        res.status(404);
      }
      res.json({message: 'question deleted'});
    });
});
router.post("/questions/:questionCode/answers", function(req, res) {
  Question.findOne({ slug: req.params.questionCode },
    function(err, question) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not read questions data" });
      }
      if (!question) {
        res.status(404);
      }
      var answer = req.body;
      answer.gravatarUrl = "http://www.gravatar.com/avatar/" + MD5(req.body.email);
      question.answers.push(req.body);
      question.save(function(err, savedQuestion) {
        if (err) {
          console.log(err);
          res.status(400).json({ error: "Could not read questions data" });
        }
        res.json(savedQuestion);
      });
    });
});

module.exports = router;
