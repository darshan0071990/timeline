var express = require('express');
var router  = express.Router();
var path    = require('path');
var moment = require('moment');
var models  = require('./../models');

var calendarController = require(path.resolve(__dirname, 'calendar-controller'));

/* GET home page. */
router.get('/', function(req, res, next) {
    models.projects.findAll().then(function (project,err) {
        models.users.findAll().then(function(user,err){
            res.render('index', {
                title: 'Timeline',
                bootstrap: true,
                projects:project,
                users:user,
                'jqueryui': true
            });
        });
    });
});

router.get('/events',function(req,res,next){
    var event = [];
    models.tasks.findAll({
        include: [{// Notice `include` takes an ARRAY
            model: models.projects,
        }]
    }).then(function (taskdata,err) {
        taskdata.forEach(function(item){
            event.push({
                "id":item.id,
                "title":item.name+"\n"+item.project.name,
                "allday":"true",
                "resourceId":item.uid,
                "borderColor":item.project.color,
                "color":item.project.color,
                "textColor":"#201a32",
                "description":item.description,
                "start": moment(item.sdate+" 00:00:00").format("YYYY-MM-DD HH:mm:ss"),
                "end": moment(item.edate+" 23:59:59").format("YYYY-MM-DD HH:mm:ss")
            });
        });
        res.json(event);
    }).catch(function(e) {
        console.log('Darshan error'+e);
    });


});


router.post('/createtask',function(req,res,next){
    var sdate = moment(req.body.sdate,'DD-MM-YYYY').format("YYYY-MM-DD");
    var edate = moment(req.body.edate,'DD-MM-YYYY').format("YYYY-MM-DD");
    models.tasks.create({ name: req.body.name, description: req.body.description, sdate: sdate, edate: edate, pid: req.body.pid, uid: req.body.uid }).then(task => {
        res.redirect('/');
    }).catch(function() {
        console.log('Ankita error');
    });
});

router.post('/updatetask',function(req,res,next){
    var sdate = moment(req.body.sdate,'DD-MM-YYYY').format("YYYY-MM-DD");
    var edate = moment(req.body.edate,'DD-MM-YYYY').format("YYYY-MM-DD");

    models.tasks.update({
        name: req.body.name,
        description: req.body.description,
        sdate: sdate,
        edate: edate,
        pid: req.body.pid
    }, {where: {id:req.body.id}}).then(task => {
        res.redirect('/');
    }).catch(function() {
        console.log('Ankita error');
    });
});


router.post('/checkanotherevent',function(req,res,next) {
    var query = "SELECT id, name, sdate, edate, uid FROM tasks AS tasks WHERE tasks.id <> '"+req.body.id+"' AND tasks.uid = '"+req.body.uid+"' AND '"+req.body.start+"' >= tasks.sdate AND '"+req.body.start+"' <=tasks.edate;";

    models.sequelize.query(query, { model: models.tasks,raw:true }).then(data=>{ console.log(data);res.json(data);}).catch(error=>{console.log(error)});
});

router.get('/fetchTask/:id',function (req,res,next) {
    var id = req.params.id;
    models.tasks.findOne({
        where: {id: id},
        include: [
            {model: models.users,
        }],
        raw:true
    })
    .then(task => {
        console.log(task);
        res.json(task);
    })
    .catch(error =>{
        console.log(error);
    });
});

router.get('/deleteTask/:id',function (req,res,next) {
    var id = req.params.id;
    models.tasks.destroy({
        where: {id: id},
    })
        .then(task => {
        res.json(true);
    })
    .catch(error =>{
            res.json(false);
    });
});

router.post('/shiftEvent',function (req,res,next) {
   models.tasks.update(
       {sdate: req.body.start, edate: req.body.end},
       {where: {id: req.body.id}}
   ).then(result=> {
      res.json(true);
   }).catch(error=>{
        res.json(false);
    });
});

router.post('/linkEvent',function (req,res,next) {
    console.log(req.body.oid + " "+ req.body.nid);
    models.tasks.findOne({
        where: {id: req.body.oid},
        raw:true
    }).then(task => {
        var edate = moment(task.edate,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD");
        models.tasks.findOne({
            where: {id: req.body.nid},
            raw:true
        }).then(data => {
            var start_date = moment(data.sdate,"YYYY-MM-DD");
            var end_date = moment(data.edate,"YYYY-MM-DD");
            var diff_days = end_date.diff(start_date,'days');
            var final_end_day = moment(edate,"YYYY-MM-DD").add(diff_days,'days').format("YYYY-MM-DD");
            models.tasks.update(
                {sdate: edate, edate: final_end_day},
                {where: {id: req.body.nid}}
            ).then(result=> {
                res.json(true);
            }).catch(error=>{
                res.json(false);
            });
        })
        .catch(error => {console.log(error)});
    })
    .catch(error =>{
            console.log(error);
    });
});

module.exports = router;
