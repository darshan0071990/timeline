$(function() {

	$('#calander').fullCalendar({
        weekNumbers: true,
        themeSystem: 'bootstrap3',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        now: moment().format(),
        editable: true, // enable draggable events
        aspectRatio: 2.3,
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'today prev,next',
            center: 'title',
            right:"",
        },
        defaultView: 'timelineYear',
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
		   $('#fullCalModal').modal();
		   return false;
		},
		select: function(start, end, jsEvent, view,resource) {
	 		$('#fullCalModal').modal();
            $('#sdate').attr('value', moment(start).format());
         	$('#edate').attr('value',moment(end).subtract(1, "days").format());
			$('#uid').attr('value',resource.id);
			$('#user').attr('value',resource.title);
    }
	});
});
