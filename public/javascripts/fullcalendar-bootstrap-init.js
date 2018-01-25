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
            right:"",
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
		   $('#fullCalModal').appendTo("body").modal('show');
		   return false;
		},
		select: function(start, end, jsEvent, view,resource) {
	 		$('#fullCalModal').modal();
            $('#sdate').attr('value', moment(start).format("DD-MM-YYYY"));
         	$('#edate').attr('value',moment(end).subtract(1, "days").format("DD-MM-YYYY"));
			$('#uid').attr('value',resource.id);
			$('#user').attr('value',resource.title);
        },
        eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
            event_changeHandler(event, delta, revertFunc);
        }
	});


    $('#sdate').datepicker({ dateFormat: 'dd-mm-yy' });
    $('#edate').datepicker({ dateFormat: 'dd-mm-yy' });

    function event_changeHandler(event, delta, revertFunc) {
        var start = moment(event.start).subtract(1,"days").format('YYYY-MM-DD');
        var end = moment(event.end).format('YYYY-MM-DD');
        $.ajax({
            url: "/checkanotherevent",
            type: "POST",
            dataType: "json",
            data: {'start':start, "uid": event.resourceId},
            success: function(data){
                var response = jQuery.parseJSON(JSON.stringify(data));
                if(response[0] != undefined){
                    if (confirm("Do you want to link this Task  to "+ response[0].name + " ?")) {
                        return true;
                    } else {
                        revertFunc();
                    }
                }else{
                    revertFunc();
                }
            },
            error: function (error) {
                return false;
            }
        });
    }
});
