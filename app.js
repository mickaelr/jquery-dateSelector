'use strict';

$(document).ready(function() {
    console.log('ready!'); 
    console.log($('.dateselector'));
    $('.dateselector').dateSelector({
    	cssFramework: 'bootstrap', 
    	onDateChange: function() { 
    		console.log('date changed'); 
    		console.log($('.dateselector').dateSelector('getDate')); 
    	}
    });
});


