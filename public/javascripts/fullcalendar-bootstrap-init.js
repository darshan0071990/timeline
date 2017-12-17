$(function() {

	$('#bootstrapModalFullCalendar').fullCalendar({
		events: '/events/',
		header: {
		   left: '',
		   center: 'prev title next',
		   right: ''
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

	$('#sdate').datepicker({ dateFormat: 'yy-mm-dd' });
    $('#edate').datepicker({ dateFormat: 'yy-mm-dd' });
});
