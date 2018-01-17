$(function() {

	$('#bootstrapModalFullCalendar').fullCalendar({
		events: '/events/',
		header: {
		   left: 'prev today next',
		   center: 'title',
		   right: 'month agendaWeek agendaDay'
		},

        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
        selectable: true,
        editable: true,

		eventClick:  function(event, jsEvent, view) {
		   // $('#modalTitle').html(event.title);
		   // $('#modalBody').html(event.description);
		   // $('#eventUrl').attr('href',event.url);
		   // $('#fullCalModal').modal();
		   return false;
		},

		select: function(event, jsEvent, view) {
         $('#fullCalModal').modal();
         $('#sdate').attr('value',date.format());
         $('#edate').attr('value',date.format());
    }
	});

	$('#sdate , #edate').datepicker({ dateFormat: 'dd-mm-yy' });

});
