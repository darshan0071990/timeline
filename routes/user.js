var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next) {
    models.users.findAll().then(function (data,err) {
        console.log(data);
        res.render('users', {
            title: 'Users',
            bootstrap: true,
            data: data
        });
    });
});

router.get('/adduser', function(req, res, next) {
    res.render('adduser', {
        title: 'Add Users',
        bootstrap: true,
    });
});

router.post('/adduser',function(req,res,next){
    models.users.create({ name:req.body.name, email: req.body.email}).then(task => {
        // you can now access the newly created task via the variable task
        res.redirect('/user');
    });

});
router.get('/fetchUsers',function(req,res,next){
    models.users.findAll({attributes: ['id', ['name','title']]}).then(function (data,err) {
        res.send(data);
    })
});
    // sql.sync()
    //     .then(() => User.create({
    //     name:req.body.name,
    //     email: req.body.email
    // })).then(function (data) {
    //     res.redirect('/users');
    // }).error(function(err){
    //     res.send("Not Success");
    // });



module.exports = router;