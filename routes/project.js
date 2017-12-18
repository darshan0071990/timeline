var express = require('express');
var router  = express.Router();
var models  = require('./../models');

router.get('/', function(req, res, next) {
    models.projects.findAll().then(function (data,err) {
        console.log(data);
        res.render('projects', {
            title: 'Projects',
            bootstrap: true,
            data: data
        });
    });
});

router.get('/addproject', function(req, res, next) {
    res.render('addproject', {
        title: 'Add Projects',
        bootstrap: true,
    });
});

router.post('/createproject',function(req,res,next){
    models.projects.create({ name:req.body.name, color: req.body.color}).then(task => {
        // you can now access the newly created task via the variable task
        res.redirect('/project');
    });
    //     models.Project.create({
    //     name:req.body.name,
    //     color: req.body.color
    // })).then(function (data) {
    //     res.redirect('/projects');
    // }).error(function(err){
    //     res.send("Not Success");
    // });
});

module.exports = router;
