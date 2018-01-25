var express = require('express');
var router  = express.Router();
var path    = require('path');
var moment = require('moment');
var models  = require('./../models');

var calendarController = require(path.resolve(__dirname, 'calendar-controller'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FullCalendar with Event Modals' });
});

router.get('/bootstrap', function(req, res, next) {
    models.projects.findAll().then(function (project,err) {
        models.users.findAll().then(function(user,err){
            res.render('bootstrap', {
                title: 'TImeline',
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
        res.redirect('/bootstrap');
    }).catch(function() {
        console.log('Ankita error');
    });
});

router.post('/checkanotherevent',function(req,res,next) {

    models.tasks.findAll({
        where: {
            uid: req.body.uid,
            edate: req.body.start,
        }
    })
    .then(data => {
        res.json(data);
    })
    .catch(function(e){console.log("error")});

});

router.get('/calendarJSON', calendarController.calendarJSON);

module.exports = router;
