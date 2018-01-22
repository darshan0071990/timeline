$(function() {

	$('#calander').fullCalendar({
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        now: moment().format(),
        editable: true, // enable draggable events
        aspectRatio: 10,
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'today prev,next',
            center: 'title',
            right: 'timelineDay,timelineTenDay,timelineMonth,timelineYear'
        },
        defaultView: 'timelineMonth',
        views: {
            timelineThreeDays: {
                type: 'timeline',
                duration: { days: 3 }
            }
        },
        resourceLabelText: 'Users',
        resources: '/user/fetchUsers',
        // events: [
        //     { id: '1', resourceId: '1', start: '2018-01-07T02:00:00', end: '2018-01-07T07:00:00', title: 'event 1' },
        //     { id: '2', resourceId: 'c', start: '2018-01-07T05:00:00', end: '2018-01-07T22:00:00', title: 'event 2' },
        //     { id: '4', resourceId: '1', start: '2018-01-07T03:00:00', end: '2018-01-07T08:00:00', title: 'event 4' },
        //     { id: '5', resourceId: 'f', start: '2018-01-07T00:30:00', end: '2018-01-07T02:30:00', title: 'event 5' }
        // ],
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
