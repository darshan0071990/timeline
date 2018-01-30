$(function() {
    $('#calander').fullCalendar({
        weekNumbers: true,
        themeSystem: 'bootstrap3',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        now: moment().format(),
        editable: true, // enable draggable events
        aspectRatio: 2.3,
        resourceAreaWidth: '10%',
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'today prev,next',
            center: 'title',
            right:""
        },
        weekNumberTitle: 'w',
        displayEventTime: false,
        defaultView: 'timelineMonth',
        resourceLabelText: 'Users',
        resources: '/user/fetchUsers',
		events: '/events/',
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
		eventClick:  function(event, jsEvent, view) {
		   $('#modalTitle').html(event.title);
		   $('#modalBody').html(event.description);
		   $('#eventUrl').attr('href',event.url);
		   showEditModal(event.id);
		   return false;
		},
		select: function(start, end, jsEvent, view,resource) {
            $('#sdate').attr('value', moment(start).format("DD-MM-YYYY"));
         	$('#edate').attr('value',moment(end).subtract(1, "days").format("DD-MM-YYYY"));
			$('#uid').attr('value',resource.id);
			$('#user').attr('value',resource.title);
            $('#fullCalModal').modal();
        },
        eventDrop: function(event, delta, revertFunc) {
            event_changeHandler(event, delta, revertFunc,"drop");
        },
        eventResize: function(event,delta,revertFunc, ui, view) {
            event_changeHandler(event, delta, revertFunc,"resize");
        },
        eventRender: function(event, element,view) {
            // var color = hexToRgbA(event.color);
            // $(".fc-highlight").css("background-color",color +" !important");
            $(".fc-highlight-container").first().remove();
        }
	});

    //Convert Hex Color code to RGB
    // function hexToRgbA(hex){
    //     var c;
    //     if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    //         c= hex.substring(1).split('');
    //         if(c.length== 3){
    //             c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    //         }
    //         c= '0x'+c.join('');
    //         return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    //     }
    //     throw new Error('Bad Hex');
    // }

    $(".modal").on("hidden.bs.modal", function(){
        $("#task-edit-form").trigger( "reset" );
        $("#task-form").trigger( "reset" );
    });

	function showEditModal(id){
        $.ajax({
            url: "/fetchTask/"+id,
            success: function(data){
                var response = jQuery.parseJSON(JSON.stringify(data));
                console.log(response);
                $("#task-edit-name").val(response.name);
                $("#task-edit-desc").val(response.description);
                $("#task-edit-pid").val(response.pid);
                $('#task-edit-sdate').attr('value', moment(response.sdate).format("DD-MM-YYYY"));
                $('#task-edit-edate').attr('value',moment(response.edate).format("DD-MM-YYYY"));
                $("#task-edit-user").val(response["user.name"]);
                $("#task-edit-uid").val(response.uid);
                $("#task-id").val(response.id);
                $('#fullEditCalModal').modal();
            },
            error: function (error) {
                return false;
            }
        });
    }

    $('#sdate').datepicker({ dateFormat: 'dd-mm-yy' });
    $('#edate').datepicker({ dateFormat: 'dd-mm-yy' });
    $('#task-edit-sdate').datepicker({ dateFormat: 'dd-mm-yy' });
    $('#task-edit-edate').datepicker({ dateFormat: 'dd-mm-yy' });

    $("#delete_task").click(function (e) {
        e.preventDefault();
        var task_id = $("#task-id").val();
       if(confirm("Are you sure you want to delete Task "+ $("#task-edit-name").val())){
           $.ajax({
               url: "/deleteTask/"+task_id,
               success: function(data){
                   if(data) {
                       $("#calander").fullCalendar('removeEvents', [task_id]);
                       $('#fullEditCalModal').modal('hide');
                   }
                   else
                       return false;
               },
               error: function (error) {
                   return false;
               }
           });
       }else{
           alert("Cancel");
       }
    });

    function event_changeHandler(event, delta, revertFunc,type) {
        var showDate = moment(event.start).format('Do MMM YYYY');
        var start = moment(event.start).format('YYYY-MM-DD');
        var end = moment(event.end).format('YYYY-MM-DD');
        $.ajax({
            url: "/checkanotherevent",
            type: "POST",
            dataType: "json",
            data: {'id':event.id,'start':start, "uid": event.resourceId},
            success: function(data){
                var response = jQuery.parseJSON(JSON.stringify(data));
                if(response[0] != undefined){
                    if (confirm("Do you want to link this Task  to "+ response[0].name + " ?")) {
                        linkEvent(response[0].id,event.id);
                    } else {
                        revertFunc();
                    }
                }else{
                    var confirm_msg = "";
                    if(type=="drop")
                        confirm_msg = "Do you want move this Task to "+ showDate + " ?";
                    else
                        confirm_msg = "Do you want to change the duration of Task: "+event.title;
                    if (confirm(confirm_msg)) {
                        shiftEvent(event,start,end);
                    } else {
                        revertFunc();
                    }
                }
            },
            error: function (error) {
                return false;
            }
        });
    }

    function shiftEvent(event,start,end){
        $.ajax({
            url: "/shiftEvent",
            type: "POST",
            dataType: "json",
            data: {'start':start,"end":end, "id": event.id},
            success: function(data){
                var response = jQuery.parseJSON(JSON.stringify(data));
                if(data){
                    alert("Update Successful");
                }else{
                    alert("Update Failed");
                }
            },
            error: function (error) {
                alert("Something went wrong, Please try again later.");
            }
        });
    }

    function linkEvent(old_taskId, new_taskId){
        $.ajax({
            url: "/linkEvent",
            type: "POST",
            dataType: "json",
            data: {'oid':old_taskId,"nid":new_taskId},
            success: function(data){
                var response = jQuery.parseJSON(JSON.stringify(data));
                if(data){
                    location.reload();
                }else{
                    alert("Update Failed");
                }
            },
            error: function (error) {
                alert("Something went wrong, Please try again later.");
            }
        });
    }
});