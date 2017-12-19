$(function() {

	$('#bootstrapModalFullCalendar').fullCalendar({
		events: '/events/',
		header: {
		   left: 'prev today next',
		   center: 'title',
		   right: 'month agendaWeek agendaDay'
		},
		eventClick:  function(event, jsEvent, view) {
		   // $('#modalTitle').html(event.title);
		   // $('#modalBody').html(event.description);
		   // $('#eventUrl').attr('href',event.url);
		   // $('#fullCalModal').modal();
		   return false;
		},
		dayClick: function(date, jsEvent, view) {
         $('#fullCalModal').modal();
				 $('#sdate').attr('value',date.format());
    }
	});

    $('#edittask').fullCalendar({})
	$('#sdate').datepicker({ dateFormat: 'yy-mm-dd' });
    $('#edate').datepicker({ dateFormat: 'yy-mm-dd' });

});
