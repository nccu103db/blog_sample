var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var Article = require('../models/Article');
var async = require('async');
var thunkify = require('thunkify');
/* GET home page. */
router.get('/', function(req, res, next) {
  var getAllArticles = thunkify(Article.getAll);
  var getMember = Member.get;

  getAllArticles()(function(err, articleList) {
    if(err) {
      next();
    } else {

      async.each(articleList, function(article, cb) {
        var a = getMember(article.memberId);

        a(function(err, member) {
          if(err) {
            cb(err);
          } else {
            article.member = member;
            cb(null);
          }
        });
        
      }, function(err){
        if(err) {
          res.status = err.code;
          next();
        } else {
          res.render('index',
          {
            member : req.session.member || null,
            articleList: articleList
          });
        }
      });

    }
  });
});


module.exports = router;
