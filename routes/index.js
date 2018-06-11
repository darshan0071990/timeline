var express = require('express');
var router  = express.Router();
var path    = require('path');
var moment = require('moment');
var models  = require('./../models');

/* GET home page. */
router.get('/', function(req, res, next) {
    models.projects.findAll().then(function (project,err) {
        models.users.findAll().then(function(user,err){
            res.render('index', {
                title: 'Timeline',
                projects:project,
                users:user,
            });
        }).catch(function(e){
            res.render('error');
        });
    }).catch(function (e) {
        res.render('error');
    });
});

router.get('/events',function(req,res,next){
    var event = [];
    models.tasks.findAll({
        include: [{
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
        res.render('error');
    });
});


router.post('/createtask',function(req,res,next){
    var sdate = moment(req.body.sdate,'DD-MM-YYYY').format("YYYY-MM-DD");
    var edate = moment(req.body.edate,'DD-MM-YYYY').format("YYYY-MM-DD");
    models.tasks.create({
        name: req.body.name,
        description: req.body.description,
        sdate: sdate,
        edate: edate,
        pid: req.body.pid,
        uid: req.body.uid })
    .then(task => {
        res.redirect('/');
    }).catch(function() {
        res.render("error");
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
        res.render("error");
    });
});


router.post('/updateLinkedEvents',function(req,res,next){
    var id = req.body.id;
    var sdate = moment(req.body.start,'YYYY-MM-DD').format("YYYY-MM-DD");
    var edate = moment(req.body.end,'YYYY-MM_DD').format("YYYY-MM-DD");
    var linkId = req.body.linkId;
    var linkstartdate = moment(edate,'YYYY-MM-DD').add(1,'days').format('YYYY-MM-DD');
    var linkenddate = moment(req.body.linkend,'YYYY-MM_DD').format("YYYY-MM-DD");
    models.tasks.update({
        sdate: sdate,
        edate: edate,
        uid:req.body.uid,
    }, {where: {id:id}}).then(task => {
        models.tasks.update({
                sdate: linkstartdate,
                edate: linkenddate,
                uid:req.body.uid,
            }, {where: {id:linkId}}).then(task => {
                res.json(true);
            }).catch(function() {
                res.json(false);
            });
    }).catch(function() {
        res.json(false);
    });
});


router.post('/checkanotherevent',function(req,res,next) {
    var query = "SELECT id, name, sdate, edate, uid FROM tasks AS tasks WHERE tasks.id <> '"+req.body.id+"' AND tasks.uid = '"+req.body.uid+"' AND '"+req.body.start+"' >= tasks.sdate AND '"+req.body.start+"' <=tasks.edate;";

    models.sequelize.query(query, { model: models.tasks,raw:true })
    .then(data=>{
        res.json(data);
    })
    .catch(error=>{
        console.log(error);
    });
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
       {sdate: req.body.start, edate: req.body.end, uid: req.body.uid},
       {where: {id: req.body.id}}
   ).then(result=> {
      res.json(true);
   }).catch(error=>{
       console.log(error);
        res.json(false);
    });
});

router.post('/linkEvent',function (req,res,next) {
    models.tasks.findOne({
        where: {id: req.body.oid},
        raw:true
    }).then(task => {
        var edate = moment(task.edate,"YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD");
        models.tasks.findOne({
            where: {id: req.body.nid},
            raw:true
        }).then(data => {
            models.linktasks.create({
                basetask_id: req.body.oid,
                linktask_id: req.body.nid })
                .then(task => {
                    var start_date = moment(data.sdate,"YYYY-MM-DD");
                    var end_date = moment(data.edate,"YYYY-MM-DD");
                    var diff_days = end_date.diff(start_date,'days');
                    var final_end_day = moment(edate,"YYYY-MM-DD").add(diff_days,'days').format("YYYY-MM-DD");
                    models.tasks.update(
                        {sdate: edate, edate: final_end_day},
                        {where: {id: req.body.nid}}
                    ).then(result=> {
                        res.json(true);
                    }).catch(error=>{res.json(false);});
                }).catch(function() {console.log(error);});
            });
    }).catch(error => {console.log(error)});
});

router.get('/checkLinked/:id/:flag',function (req,res,next) {
    var flag = req.params.flag;
    console.log(flag);
    models.linktasks.find({
        where: {basetask_id: req.params.id},
        include: [
            {model: models.tasks,
            }],
        raw:true
        }).then(links => {
           if(links != null)
            {
                if (flag=="false") {
                    res.json(links.linktask_id);
                } else {
                    res.json(links);
                }
            }
           else
            {
                res.json(false);
            }
   }).catch(error => {console.log(error)});
});

router.get('/linkEvent/:id',function (req,res,next) {
    var id = req.params.id;
    models.tasks.findOne({
        where: {id: id},
        include: [
            {model: models.tasks,
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

module.exports = router;
