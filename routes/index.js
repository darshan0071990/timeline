var express = require('express');
var router  = express.Router();
var path    = require('path');
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
                title: 'Express',
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
    models.tasks.findAll().then(function (taskdata,err) {
        taskdata.forEach(function(item){
            event.push({
                "id":item.id,
                "title":"DW",
                "allday":"true",
                "resourceId":item.uid,
                "borderColor":"#5173DA",
                "color":"#99ABEA",
                "textColor":"#000000",
                "description":item.description,
                "start": item.sdate,
                "end": item.edate,
            });
        });
        res.json(event);
    });


});

router.get('/jquery', function(req, res, next) {
  res.render('jqueryui', {
  	title: 'Express',
  	'jqueryui': true
  });
});

router.get('/gcal', function(req, res, next) {
  res.render('google-calendar', {
  	title: 'Express',
  	'googleCalendar': true,

  	GOOGLE_KEY: process.env.GOOGLE_CALENDAR_API_KEY,
  	GOOGLE_CLIENT: process.env.GOOGLE_CALENDAR_CLIENT_ID
  });
});

router.post('/createtask',function(req,res,next){
    var name = req.body.name;
    var description = req.body.description;
    var sdate = req.body.sdate;
    var edate = req.body.edate;
    var pid = req.body.pid;
    var uid = req.body.uid;

    models.tasks.create({ name: name, description: description, sdate: sdate, edate: edate, pid: pid, uid: uid }).then(task => {
            res.redirect('/bootstrap');
    });
});

router.get('/calendarJSON', calendarController.calendarJSON);

module.exports = router;
