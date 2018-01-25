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
                "start": moment(item.sdate).format("YYYY-MM-DD"),
                "end": moment(item.edate).format("YYYY-MM-DD")
            });
        });
        res.json(event);
    }).catch(function(e) {
        console.log('Darshan error'+e);
    });


});


router.post('/createtask',function(req,res,next){
    var name = req.body.name;
    var description = req.body.description;
    var sdate = moment(req.body.sdate,'DD-MM-YYYY').format("YYYY-MM-DD");
    var edate = moment(req.body.edate,'DD-MM-YYYY').add(1, "days").format("YYYY-MM-DD");
    var pid = req.body.pid;
    var uid = req.body.uid;
    models.tasks.create({ name: name, description: description, sdate: sdate, edate: edate, pid: pid, uid: uid }).then(task => {
        res.redirect('/bootstrap');
    }).catch(function() {
        console.log('Ankita error');
    });
});

router.get('/calendarJSON', calendarController.calendarJSON);

module.exports = router;
