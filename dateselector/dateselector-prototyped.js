/*--------------------------------------------------------------------
 *JAVASCRIPT "dateselector.js"
 *Version:    0.0.1 - 2015
 *author:     Mickaël Roy
 *website:    http://www.mickaelroy.com
 *Licensed MIT 
-----------------------------------------------------------------------*/

(function ($){
 
    var pluginName = 'dateSelector';
 
    /**
     * The plugin constructor
     * @param {DOM Element} element The DOM element where plugin is applied
     * @param {Object} options Options passed to the constructor
     */
    function DateSelector(element, options) {

        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference  to the source element
        this.$el = $(element);

        // Set the instance options extending the plugin defaults and
        // the options passed by the user
        this.settings = $.extend({}, $.fn[pluginName].defaults, options);
        this.settings.minMonth   = 0,
        this.settings.maxMonth   = 11, 
        this.settings.minDay     = 1, 
        this.settings.maxDay     = 31, 
        this.settings.minHours   = 0, 
        this.settings.maxHours   = 23, 
        this.settings.minMinutes = 0, 
        this.settings.maxMinutes = 59, 
        this.settings.minSeconds = 0, 
        this.settings.maxSeconds = 59;

        // Set the DateSelector value (javascript Date)
        if(!(this.settings.defaultValue instanceof Date))
            this.settings.defaultValue = new Date();
        this.currentValue = this.settings.defaultValue;
        
        //Instanciate an object that will contain all select / dropdown fields
        this.selectElements = {};
            
        // Initialize the plugin instance
        this.init();
    }
    
    /**
     * Set up your Plugin protptype with desired methods.
     * It is a good practice to implement 'init' and 'destroy' methods.
     */
    DateSelector.prototype = {
        
        /**
         * Initialize the plugin instance.
         * Set any other attribtes, store any other element reference, register 
         * listeners, etc
         *
         * When bind listerners remember to name tag it with your plugin's name.
         * Elements can have more than one listener attached to the same event
         * so you need to tag it to unbind the appropriate listener on destroy:
         * 
         * @example
         * this.$someSubElement.on('click.' + pluginName, function() {
         *      // Do something
         * });
         *         
         */
        init: function() {
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
            
            // Declare current date / time values
            /*var now = new Date();
            var 
                currentYear     = now.getFullYear(), 
                currentMonth    = now.getMonth(), 
                currentDay      = now.getDate(), 
                currentHours    = now.getHours(), 
                currentMinutes  = now.getMinutes(), 
                currentSeconds  = now.getSeconds();*/
            
            // Set main container
            if(this.settings.container !== undefined) {
                var container = $(this.settings.container);
                if(container && container.length() > 0) {
                    this.container = container[0];
                    this.$el.parent().append(this.container);
                }
            }
            if(this.container === undefined)
                this.container = $('<div>');
            this.container.addClass('dateselector-container');

            // Create select fields
            switch(this.settings.cssFramework) {
                case 'bootstrap':
                    this.selectElements.yearSelect      = $('<ul class="dropdown-menu">'), 
                    this.selectElements.monthSelect     = $('<ul class="dropdown-menu">'), 
                    this.selectElements.daySelect       = $('<ul class="dropdown-menu">'),
                    this.selectElements.hoursSelect     = $('<ul class="dropdown-menu">'), 
                    this.selectElements.minutesSelect   = $('<ul class="dropdown-menu">'), 
                    this.selectElements.secondsSelect   = $('<ul class="dropdown-menu">');
                    break;
                default: 
                    this.selectElements.yearSelect      = $('<select class="dateselector-year">'), 
                    this.selectElements.monthSelect     = $('<select class="dateselector-month">'), 
                    this.selectElements.daySelect       = $('<select class="dateselector-day">'),
                    this.selectElements.hoursSelect     = $('<select class="dateselector-hours">'), 
                    this.selectElements.minutesSelect   = $('<select class="dateselector-minutes">'), 
                    this.selectElements.secondsSelect   = $('<select class="dateselector-seconds">');
                    break;
            }
            
            // Fill dateSelector's selects with appropriate options
            switch(this.settings.cssFramework) {
                case 'bootstrap':
                    // "value" attribute is important if we let the _getDateSelectorValue method use $('li.selected').val()
                    for(var y = this.settings.maxYear; y >= this.settings.minYear; y--) {
                        var yearOption = $('<li value="' + y + '"><a href="">' + y + '</a></li>');
                        this.selectElements.yearSelect.append(yearOption);
                    }
                    for(var M = this.settings.minMonth; M <= this.settings.maxMonth; M++) {
                        var monthOption = $('<li value="' + M + '"><a href="">' + monthNames[M] + '</a></li>');
                        this.selectElements.monthSelect.append(monthOption);
                    }
                    for(var d = this.settings.minDay; d <= this.settings.maxDay; d++) {
                        var dayOption = $('<li value="' + d + '"><a href="">' + d + '</a></li>');
                        this.selectElements.daySelect.append(dayOption);
                    }
                    for(var h = this.settings.minHours; h <= this.settings.maxHours; h++) {
                        var hoursOption = $('<li value="' + h + '"><a href="">' + h + '</a></li>');
                        this.selectElements.hoursSelect.append(hoursOption);
                    }
                    for(var m = this.settings.minMinutes; m <= this.settings.maxMinutes; m++) {
                        var minutesOption = $('<li value="' + m + '"><a href="">' + m + '</a></li>');
                        this.selectElements.minutesSelect.append(minutesOption);
                    }
                    for(var s = this.settings.minSeconds; s <= this.settings.maxSeconds; s++) {
                        var secondsOption = $('<li value="' + s + '"><a href="">' + s + '</a></li>');
                        this.selectElements.secondsSelect.append(secondsOption);
                    }
                    break;
                default: 
                    for(var y = this.settings.maxYear; y >= this.settings.minYear; y--) {
                        var yearOption = $('<option value="' + y + '">' + y + '</option>');
                        this.selectElements.yearSelect.append(yearOption);
                    }
                    for(var M = this.settings.minMonth; M <= this.settings.maxMonth; M++) {
                        var monthOption = $('<option value="' + M + '">' + monthNames[M] + '</option>');
                        this.selectElements.monthSelect.append(monthOption);
                    }
                    for(var d = this.settings.minDay; d <= this.settings.maxDay; d++) {
                        var dayOption = $('<option value="' + d + '">' + d + '</option>');
                        this.selectElements.daySelect.append(dayOption);
                    }
                    for(var h = this.settings.minHours; h <= this.settings.maxHours; h++) {
                        var hoursOption = $('<option value="' + h + '">' + h + '</option>');
                        this.selectElements.hoursSelect.append(hoursOption);
                    }
                    for(var m = this.settings.minMinutes; m <= this.settings.maxMinutes; m++) {
                        var minutesOption = $('<option value="' + m + '">' + m + '</option>');
                        this.selectElements.minutesSelect.append(minutesOption);
                    }
                    for(var s = this.settings.minSeconds; s <= this.settings.maxSeconds; s++) {
                        var secondsOption = $('<option value="' + s + '">' + s + '</option>');
                        this.selectElements.secondsSelect.append(secondsOption);
                    }
                    break;
            }
            
            // Add dropdown button when it's required
            switch(this.settings.cssFramework) {
                case 'bootstrap':
                    var dropdownTemplate = $(
                        '<div class="dropdown">' +
                            '<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">' +
                                'Dropdown' +
                                '<span class="caret"></span>' +
                            '</button>' +
                        '</div>'
                    );
                    this.selectElements.yearSelect      = dropdownTemplate.clone().addClass('dateselector-year').append(this.selectElements.yearSelect);
                    this.selectElements.monthSelect     = dropdownTemplate.clone().addClass('dateselector-month').append(this.selectElements.monthSelect); 
                    this.selectElements.daySelect       = dropdownTemplate.clone().addClass('dateselector-day').append(this.selectElements.daySelect);
                    this.selectElements.hoursSelect     = dropdownTemplate.clone().addClass('dateselector-hours').append(this.selectElements.hoursSelect); 
                    this.selectElements.minutesSelect   = dropdownTemplate.clone().addClass('dateselector-minutes').append(this.selectElements.minutesSelect); 
                    this.selectElements.secondsSelect   = dropdownTemplate.clone().addClass('dateselector-seconds').append(this.selectElements.secondsSelect);
                    dropdownTemplate.remove();
                    break;
                default: 
                    break;
            }
            
            // Set default date
            if(this.settings.defaultValue instanceof Date) {
                this._setDateSelectorValue(this.currentValue);
                this._disableNonAvailableDays();
            }

            // Handle dateSelector changes
            switch(this.settings.cssFramework) {
                case 'bootstrap':
                    var that = this;
                    this.selectElements.yearSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                    });
                    this.selectElements.monthSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                    });
                    this.selectElements.daySelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                    });
                    this.selectElements.hoursSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                    });
                    this.selectElements.minutesSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                    });
                    this.selectElements.secondsSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                    });
                    break;
                default:
                    this.selectElements.yearSelect.on('change', function() {
                        this._updateDateSelector();
                    });
                    this.selectElements.monthSelect.on('change', function() {
                        this._updateDateSelector();
                    });
                    this.selectElements.daySelect.on('change', function() {
                        this._updateDateSelector();
                    });
                    this.selectElements.hoursSelect.on('change', function() {
                        this._updateDateSelector();
                    });
                    this.selectElements.minutesSelect.on('change', function() {
                        this._updateDateSelector();
                    });
                    this.selectElements.secondsSelect.on('change', function() {
                        this._updateDateSelector();
                    });
                    break;
            }
            
            // Append the dateSelector right after the source element
            if(this.settings.showDate)
                this.container.append(this.selectElements.daySelect).append(this.selectElements.monthSelect).append(this.selectElements.yearSelect);
            if(this.settings.showTime)
                this.container.append(this.selectElements.hoursSelect).append(this.selectElements.minutesSelect).append(this.selectElements.secondsSelect);
            this.$el.parent().append(this.container);
        },

        /**
         * The 'destroy' method is were you free the resources used by your plugin:
         * references, unregister listeners, etc.
         *
         * Remember to unbind for your event:
         *
         * @example
         * this.$someSubElement.off('.' + pluginName);
         *
         * Above example will remove any listener from your plugin for on the given
         * element.
         */
        destroy: function() {

            // Remove any attached data from your plugin
            this.$el.removeData();
        },

        /**
         * Write public methods within the plugin's prototype. They can 
         * be called with:
         *
         * @example
         * $('#element').jqueryPlugin('somePublicMethod','Arguments', 'Here', 1001);
         *  
         * @param  {[type]} foo [some parameter]
         * @param  {[type]} bar [some other parameter]
         * @return {[type]}
         */
        somePublicMethod: function() {

            // This is a call to a pseudo private method
            //this._pseudoPrivateMethod();

            // This is a call to a real private method. You need to use 'call' or 'apply'
            //privateMethod.call(this);
        },

        /**
         * Another public method which acts as a getter method. You can call as any usual
         * public method:
         *
         * @example
         * $('#element').jqueryPlugin('someGetterMethod');
         *
         * to get some interesting info from your plugin.
         * 
         * @return {[type]} Return something
         */
        getDate: function() {
            return this.currentValue;
        },
        
        getDateString: function() {
            return moment(this.currentValue).format(this.settings.dateFormat);
        },

        /**
         * You can use the name convention functions started with underscore are
         * private. Really calls to functions starting with underscore are 
         * filtered, for example:
         * 
         *  @example
         *  $('#element').jqueryPlugin('_pseudoPrivateMethod');  // Will not work
         */
        //
        _updateSourceInputValue: function() {
            if(this.currentValue) this.$el.val(this.getDateString(this.currentValue));
        },
        // Method that disable non-available days (for a month)
        _disableNonAvailableDays: function() {
            if(!this.currentValue) return;
            
            var lastMonthDay = getLastMonthDay(this.currentValue.getFullYear(), this.currentValue.getMonth());
            switch(this.settings.cssFramework) {
                case 'bootstrap':
                    for(var i = 1; i <= lastMonthDay; i++) {
                        this.selectElements.daySelect.find('li[value="' + i + '"]').removeClass('disabled');
                    }
                    for(var j = lastMonthDay + 1; j <= this.settings.maxDay; j++) {
                        this.selectElements.daySelect.find('li[value="' + j + '"]').addClass('disabled');
                    }
                    break;
                default:
                    for(var i = 1; i <= lastMonthDay; i++) {
                        this.selectElements.daySelect.find('option[value="' + i + '"]').prop('disabled', false);
                    }
                    for(var j = lastMonthDay + 1; j <= this.settings.maxDay; j++) {
                        this.selectElements.daySelect.find('option[value="' + j + '"]').prop('disabled', true);
                    }
                    break;
            }
        },
        // Method that returns the value of the dateSelector
        _getDateSelectorValue: function() {
            var selector;
            switch(this.settings.cssFramework) {
                case 'bootstrap':
                    selector = '.selected';
                    break;
                default:
                    selector = ':selected';
                    break;
            }
            var 
                dateSelectorYear    = this.selectElements.yearSelect ? this.selectElements.yearSelect.find(selector).val() : undefined,
                dateSelectorMonth   = this.selectElements.monthSelect ? this.selectElements.monthSelect.find(selector).val() : undefined,
                dateSelectorDay     = this.selectElements.daySelect ? this.selectElements.daySelect.find(selector).val() : undefined,
                dateSelectorHours   = this.selectElements.hoursSelect ? this.selectElements.hoursSelect.find(selector).val() : undefined,
                dateSelectorMinutes = this.selectElements.minutesSelect ? this.selectElements.minutesSelect.find(selector).val() : undefined,
                dateSelectorSeconds = this.selectElements.secondsSelect ? this.selectElements.secondsSelect.find(selector).val() : undefined;
            var lastMonthDay = getLastMonthDay(dateSelectorYear, dateSelectorMonth);
            if(dateSelectorDay > lastMonthDay) {
                this.selectElements.daySelect.find('option[value="' + lastMonthDay + '"]').prop('selected', true);
                dateSelectorDay = lastMonthDay;
            }
            return new Date(
                dateSelectorYear ? dateSelectorYear : this.settings.defaultValue.getFullYear(),
                dateSelectorMonth ? dateSelectorMonth : 0,
                dateSelectorDay ? dateSelectorDay : 1,
                dateSelectorHours ? dateSelectorHours : 0,
                dateSelectorMinutes ? dateSelectorMinutes : 0,
                dateSelectorSeconds ? dateSelectorSeconds : 0,
                0
            );
        },
        // Method that set the value of the dateSelector, giving a specific date
        _setDateSelectorValue: function(date) {
            switch(this.settings.cssFramework) {
                case 'bootstrap':
                    this.selectElements.yearSelect.find('li[value="' + date.getFullYear() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.monthSelect.find('li[value="' + date.getMonth() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.daySelect.find('li[value="' + date.getDate() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.hoursSelect.find('li[value="' + date.getHours() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.minutesSelect.find('li[value="' + date.getMinutes() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.secondsSelect.find('li[value="' + date.getSeconds() + '"]').addClass('selected').siblings().removeClass('selected');

                    this.selectElements.yearSelect.find('.dropdown-toggle').text(this.selectElements.yearSelect.find('li.selected a').text());
                    this.selectElements.monthSelect.find('.dropdown-toggle').text(this.selectElements.monthSelect.find('li.selected a').text());
                    this.selectElements.daySelect.find('.dropdown-toggle').text(this.selectElements.daySelect.find('li.selected a').text());
                    this.selectElements.hoursSelect.find('.dropdown-toggle').text(this.selectElements.hoursSelect.find('li.selected a').text());
                    this.selectElements.minutesSelect.find('.dropdown-toggle').text(this.selectElements.minutesSelect.find('li.selected a').text());
                    this.selectElements.secondsSelect.find('.dropdown-toggle').text(this.selectElements.secondsSelect.find('li.selected a').text());
                    break;
                default:
                    this.selectElements.yearSelect.find('option[value="' + date.getFullYear() + '"]').prop('selected', true);
                    this.selectElements.monthSelect.find('option[value="' + date.getMonth() + '"]').prop('selected', true);
                    this.selectElements.daySelect.find('option[value="' + date.getDate() + '"]').prop('selected', true);
                    this.selectElements.hoursSelect.find('option[value="' + date.getHours() + '"]').prop('selected', true);
                    this.selectElements.minutesSelect.find('option[value="' + date.getMinutes() + '"]').prop('selected', true);
                    this.selectElements.secondsSelect.find('option[value="' + date.getSeconds() + '"]').prop('selected', true);
                    break;
            }
        },
        //
        _updateDateSelector: function() {
            this.currentValue = this._getDateSelectorValue();
            this._setDateSelectorValue(this.currentValue);
            this._disableNonAvailableDays();   
            this._updateSourceInputValue();
            this.settings.onDateChange.call(this);
        }
    };

    /**
     * These are real private methods. A plugin instance has access to them
     * @return {[type]}
     */
    // Method that get the last month day giving a year and a month (0-11)
    var getLastMonthDay = function(year, month) {
        // TODO: check if year and month are integers to remove the "+" sign in front of "month" in the following...
        if(year !== undefined && month !== undefined)
            return new Date(year, +month + 1, 0).getDate();
        else return undefined;
    };
    
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new DateSelector(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length === 0 && $.inArray(options, $.fn[pluginName].getters) !== -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof DateSelector && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };
    
    /**
     * Names of the pluguin methods that can act as a getter method.
     * @type {Array}
     */
    $.fn[pluginName].getters = ['getDate', 'getDateString'];

    /**
     * Default options
     */
    $.fn[pluginName].defaults = {
        minYear         : 1970, 
        maxYear         : new Date().getFullYear(),
        dateFormat      : 'DD/MM/YYYY HH:mm:ss',
        showDate        : true,
        showTime        : false,
        defaultValue    : new Date(),
        // Following settings aren't implemented yet
        hoursStep       : 1,
        minutesStep     : 1,
        secondsStep     : 1,
        cssFramework    : undefined, // could be 'bootstrap', 'foundation'
        lang            : 'fr',
        container       : undefined,
        onDateChange    : function() {}
    };
 
}(jQuery));