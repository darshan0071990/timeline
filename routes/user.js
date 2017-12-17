var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next) {
    User.findAll().then(function (data,err) {
        console.log(data);
        res.render('users', {
            title: 'Users',
            bootstrap: true,
            data: data
        });
    });
});

router.get('/addusers', function(req, res, next) {
    res.render('addusers', {
        title: 'Add Users',
        bootstrap: true,
    });
});

router.post('/createusers',function(req,res,next){
    sql.sync()
        .then(() => User.create({
        name:req.body.name,
        email: req.body.email
    })).then(function (data) {
        res.redirect('/users');
    }).error(function(err){
        res.send("Not Success");
    });
});

module.exports = router;