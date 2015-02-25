/*--------------------------------------------------------------------
 *JAVASCRIPT "dateselector.js"
 *Version:    0.0.1 - 2015
 *author:     Mickaël Roy
 *website:    http://www.mickaelroy.com
 *Licensed MIT 
-----------------------------------------------------------------------*/

(function ($){
 
    $.fn.dateSelector = function(methodOrOptions) {

        // Declare names values
        var monthNames = [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre"
	]; 
	var dayNames = [
            'Dimanche',
            'Lundi',
            'Mardi',
            'Mercredi',
            'Jeudi',
            'Vendredi',
            'Samedi'
	];

        // Declare current date / time values
        var now = new Date();
        var 
            currentYear 	= now.getFullYear(), 
            currentMonth 	= now.getMonth(), 
            currentDay 		= now.getDate(), 
            currentHours 	= now.getHours(), 
            currentMinutes 	= now.getMinutes(), 
            currentSeconds 	= now.getSeconds();
             
        // Declare default values
        var defaults = {
            minYear         : 1970, 
            maxYear         : currentYear,
            dateFormat      : 'DD/MM/YYYY HH:mm:ss',
            showDate        : true,
            showTime        : false,
            defaultDate     : now,
            // Following settings aren't implemented yet
            hoursFormat     : '24',
            hoursStep       : 1,
            minutesStep     : 1,
            secondsStep     : 1,
            cssFramework    : undefined, // could be 'bootstrap', 'foundation'
            lang            : 'fr'
        };

        // Declare settings
        var settings        = $.extend({}, defaults, methodOrOptions);
        settings.minMonth   = 0,
        settings.maxMonth   = 11, 
        settings.minDay     = 1, 
        settings.maxDay     = 31, 
        settings.minHours   = 0, 
        settings.maxHours   = 23, 
        settings.minMinutes = 0, 
        settings.maxMinutes = 59, 
        settings.minSeconds = 0, 
        settings.maxSeconds = 59;

        // Do plugin logic
        return this.each(function() {

            // To avoid useless call to the jQuery selector
            var $this = $(this);
            
            // Hide the source element to create dateSelector's one instead
            //$this.css('display', 'none');
            //
            // Declare dateSelector instance
            var dateSelectorValue;
            
            // Declare future dateSelector's elements
            var 
		dateContainer 	= $('<div class="dateselector-container">'), 
		yearSelect 	= $('<select class="dateselector-year">'), 
		monthSelect 	= $('<select class="dateselector-month">'), 
		daySelect 	= $('<select class="dateselector-day">'),
		hoursSelect 	= $('<select class="dateselector-hours">'), 
		minutesSelect 	= $('<select class="dateselector-minutes">'), 
		secondsSelect 	= $('<select class="dateselector-seconds">');
             
            // Fill dateSelector's selects with appropriate options
            for(var y = settings.maxYear; y >= settings.minYear; y--) {
		var yearOption = $('<option value="' + y + '">' + y + '</option>').click(function() {
                    $(this).addClass('selected');
                    //$(this).siblings().removeClass('selected');
                });
		yearSelect.append(yearOption);
            }
            for(var M = settings.minMonth; M <= settings.maxMonth; M++) {
                var monthOption = $('<option value="' + M + '">' + monthNames[M] + '</option>');
                monthSelect.append(monthOption);
            }
            for(var d = settings.minDay; d <= settings.maxDay; d++) {
                var dayOption = $('<option value="' + d + '">' + d + '</option>');
                daySelect.append(dayOption);
            }
            for(var h = settings.minHours; h <= settings.maxHours; h++) {
		var hoursOption = $('<option value="' + h + '">' + h + '</option>');
		hoursSelect.append(hoursOption);
            }
            for(var m = settings.minMinutes; m <= settings.maxMinutes; m++) {
                var minutesOption = $('<option value="' + m + '">' + m + '</option>');
                minutesSelect.append(minutesOption);
            }
            for(var s = settings.minSeconds; s <= settings.maxSeconds; s++) {
                var secondsOption = $('<option value="' + s + '">' + s + '</option>');
                secondsSelect.append(secondsOption);
            }
            
            // Method that get the last month day giving a year and a month (0-11)
            var getLastMonthDay = function(year, month) {
                // TODO: check if year and month are integers to remove the "+" sign in front of "month" in the following...
                if(year !== undefined && month !== undefined)
                    return new Date(year, +month + 1, 0).getDate();
                else return undefined;
            };
            // Method that returns the value of the dateSelector
            var getDateSelectorValue = function() {
		var 
                    dateSelectorYear 	= yearSelect.find(':selected').val(),
                    dateSelectorMonth 	= monthSelect.find(':selected').val(),
                    dateSelectorDay 	= daySelect.find(':selected').val(),
                    dateSelectorHours 	= hoursSelect.find(':selected').val(),
                    dateSelectorMinutes = minutesSelect.find(':selected').val(),
                    dateSelectorSeconds = secondsSelect.find(':selected').val();
                var lastMonthDay = getLastMonthDay(dateSelectorYear, dateSelectorMonth);
                if(dateSelectorDay > lastMonthDay) {
                    daySelect.find('option[value="' + lastMonthDay + '"]').prop('selected', true);
                    dateSelectorDay = lastMonthDay;
                }
		return new Date(
                    dateSelectorYear ? dateSelectorYear : currentYear,
                    dateSelectorMonth ? dateSelectorMonth : 0,
                    dateSelectorDay ? dateSelectorDay : 1,
                    dateSelectorHours ? dateSelectorHours : 0,
                    dateSelectorMinutes ? dateSelectorMinutes : 0,
                    dateSelectorSeconds ? dateSelectorSeconds : 0,
                    0
		);
            };
            // Method that set the value of the dateSelector, giving a specific date
            var setDateSelectorValue = function(date) {
		yearSelect.find('option[value="' + date.getFullYear() + '"]').prop('selected', true);
		monthSelect.find('option[value="' + date.getMonth() + '"]').prop('selected', true);
		daySelect.find('option[value="' + date.getDate() + '"]').prop('selected', true);
		hoursSelect.find('option[value="' + date.getHours() + '"]').prop('selected', true);
		minutesSelect.find('option[value="' + date.getMinutes() + '"]').prop('selected', true);
		secondsSelect.find('option[value="' + date.getSeconds() + '"]').prop('selected', true);
            };
            //
            var updateSourceInputValue = function() {
                if(dateSelectorValue) $this.val(moment(dateSelectorValue).format(settings.dateFormat));
            };
            // Method that disable non-available days (for a month)
            var disableNonAvailableDays = function() {
                if(!dateSelectorValue) return;
                var lastMonthDay = getLastMonthDay(dateSelectorValue.getFullYear(), dateSelectorValue.getMonth());
                for(var i = 1; i <= lastMonthDay; i++) {
                    daySelect.find('option[value="' + i + '"]').prop('disabled', false);
                }
                for(var j = lastMonthDay + 1; j <= settings.maxDay; j++) {
                    daySelect.find('option[value="' + j + '"]').prop('disabled', true);
                }
            };
            // Method that return the date value
            var getDate = function() {
                return dateSelectorValue;
            };
            // Method that return the formatted date value
            var getDateString = function() {
                return moment(dateSelectorValue).format(settings.dateFormat);
            };

            // Handle dateSelector changes
            yearSelect.change(function() {
		dateSelectorValue = getDateSelectorValue();
                updateSourceInputValue();
                disableNonAvailableDays();
            });
            monthSelect.change(function() {
		dateSelectorValue = getDateSelectorValue();
                updateSourceInputValue();
                disableNonAvailableDays();
            });
            daySelect.change(function() {
		dateSelectorValue = getDateSelectorValue();
                updateSourceInputValue();
            });
            hoursSelect.change(function() {
		dateSelectorValue = getDateSelectorValue();
                updateSourceInputValue();
            });
            minutesSelect.change(function() {
		dateSelectorValue = getDateSelectorValue();
                updateSourceInputValue();
            });
            secondsSelect.change(function() {
		dateSelectorValue = getDateSelectorValue();
                updateSourceInputValue();
            });

            // Set default date
            if(settings.defaultDate instanceof Date) {
                dateSelectorValue = settings.defaultDate;
                setDateSelectorValue(settings.defaultDate);
            }

            // Append the dateSelector right after the source element
            if(settings.showDate)
                dateContainer.append(daySelect).append(monthSelect).append(yearSelect);
            if(settings.showTime)
                dateContainer.append(hoursSelect).append(minutesSelect).append(secondsSelect);
            $this.parent().append(dateContainer);
            
        });
        
    };
 
}(jQuery));