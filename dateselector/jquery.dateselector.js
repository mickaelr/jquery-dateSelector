/*--------------------------------------------------------------------
 *JAVASCRIPT "dateselector.js"
 *Version:    0.1.1 - 2015
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
        $.event.trigger({
            type: "buildingSelector.dateselector",
            message: "start dateSelector constructor",
            time: new Date()
        });

        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference  to the source element
        this.$el = $(element);

        // Set a random (and normally unique) id for the object
        this.instanceId = Math.round(new Date().getTime() + (Math.random() * 100));

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

        // Validate hoursStep, minutesStep and secondsStep values
        if(!this.settings.hoursStep || 24 % this.settings.hoursStep != 0)
            this.settings.hoursStep = $.fn[pluginName].defaults.hoursStep;
        if(!this.settings.minutesStep || 60 % this.settings.minutesStep != 0)
            this.settings.minutesStep = $.fn[pluginName].defaults.minutesStep;
        if(!this.settings.secondsStep || 60 % this.settings.secondsStep != 0)
            this.settings.secondsStep = $.fn[pluginName].defaults.secondsStep;

        // Set the DateSelector value (javascript Date)
        if(!(this.settings.defaultValue instanceof Date))
            this.settings.defaultValue = new Date();
        this.currentValue = this.settings.defaultValue;
        
        //Instanciate an object that will contain all select / dropdown fields
        this.selectElements = {};
            
        // Initialize the plugin instance
        this.init();

        $.event.trigger({
            type: "selectorBuilt.dateselector",
            message: "end dateSelector constructor",
            time: new Date()
        });
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
            $.event.trigger({
                type: "initializingSelector.dateselector",
                message: "start dateSelector initialization",
                time: new Date()
            });

            if(this.settings.lang)
                moment.locale(this.settings.lang);
            // Declare names values
            var monthNames = moment.months();
            
            // Hide element if necessary
            if(this.settings.hideSourceNode)
                this.$el.css('display', 'none');

            // Set main container
            if(this.settings.container !== undefined) {
                var container = $(this.settings.container);
                if(container && container.length > 0)
                    this.container = $(container[0]);
            }
            if(this.container === undefined) {
                this.container = $('<div>');
                this.$el.after(this.container);
            }
            this.container.addClass('dateselector-container');
            if(this.settings.cssFramework)
                this.container.addClass('dateselector-' + this.settings.cssFramework);
            else
                this.container.addClass('dateselector-default');

            // Set containerClass option if necessary
            if(this.settings.containerClass && this.settings.containerClass != '')
                this.container.addClass(this.settings.containerClass);

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
                case 'foundation':
                    this.selectElements.yearSelect      = $('<ul id="dateselector-year-' + this.instanceId + '" class="f-dropdown">'), 
                    this.selectElements.monthSelect     = $('<ul id="dateselector-month-' + this.instanceId + '" class="f-dropdown">'), 
                    this.selectElements.daySelect       = $('<ul id="dateselector-day-' + this.instanceId + '" class="f-dropdown">'),
                    this.selectElements.hoursSelect     = $('<ul id="dateselector-hours-' + this.instanceId + '" class="f-dropdown">'), 
                    this.selectElements.minutesSelect   = $('<ul id="dateselector-minutes-' + this.instanceId + '" class="f-dropdown">'), 
                    this.selectElements.secondsSelect   = $('<ul id="dateselector-seconds-' + this.instanceId + '" class="f-dropdown">');
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
                case 'bootstrap': case 'foundation':
                    // "value" attribute is important if we let the _getDateSelectorValue method use $('li.selected').val()
                    for(var y = this.settings.maxYear; y >= this.settings.minYear; y--) {
                        var yearOption = $('<li value="' + y + '"><a href="#">' + y + '</a></li>');
                        this.selectElements.yearSelect.append(yearOption);
                    }
                    for(var M = this.settings.minMonth; M <= this.settings.maxMonth; M++) {
                        var monthOption = $('<li value="' + M + '"><a href="#">' + monthNames[M] + '</a></li>');
                        this.selectElements.monthSelect.append(monthOption);
                    }
                    for(var d = this.settings.minDay; d <= this.settings.maxDay; d++) {
                        var dayOption = $('<li value="' + d + '"><a href="#">' + d + '</a></li>');
                        this.selectElements.daySelect.append(dayOption);
                    }
                    for(var h = 0; h < 24 / this.settings.hoursStep; h++) {
                        var hour = h * this.settings.hoursStep;
                        if(h >= this.settings.minHours && h <= this.settings.maxHours) {
                            var hoursOption = $('<li value="' + hour + '"><a href="#">' + hour + '</a></li>');
                            this.selectElements.hoursSelect.append(hoursOption);
                        }
                    }
                    for(var m = 0; m < 60 / this.settings.minutesStep; m++) {
                        var minute = m * this.settings.minutesStep;
                        if(m >= this.settings.minMinutes && m <= this.settings.maxMinutes) {
                            var minutesOption = $('<li value="' + minute + '"><a href="#">' + minute + '</a></li>');
                            this.selectElements.minutesSelect.append(minutesOption);
                        }
                    }
                    for(var s = 0; s < 60 / this.settings.secondsStep; s++) {
                        var second = s * this.settings.secondsStep;
                        if(s >= this.settings.minSeconds && s <= this.settings.maxSeconds) {
                            var secondsOption = $('<li value="' + second + '"><a href="#">' + second + '</a></li>');
                            this.selectElements.secondsSelect.append(secondsOption);
                        }
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
                    for(var h = 0; h < 24 / this.settings.hoursStep; h++) {
                        var hour = h * this.settings.hoursStep;
                        if(h >= this.settings.minHours && h <= this.settings.maxHours) {
                            var hoursOption = $('<option value="' + hour + '">' + hour + '</option>');
                            this.selectElements.hoursSelect.append(hoursOption);
                        }
                    }
                    for(var m = 0; m < 60 / this.settings.minutesStep; m++) {
                        var minute = m * this.settings.minutesStep;
                        if(m >= this.settings.minMinutes && m <= this.settings.maxMinutes) {
                            var minutesOption = $('<option value="' + minute + '">' + minute + '</option>');
                            this.selectElements.minutesSelect.append(minutesOption);
                        }
                    }
                    for(var s = 0; s < 60 / this.settings.secondsStep; s++) {
                        var second = s * this.settings.secondsStep;
                        if(s >= this.settings.minSeconds && s <= this.settings.maxSeconds) {
                            var secondsOption = $('<option value="' + second + '">' + second + '</option>');
                            this.selectElements.secondsSelect.append(secondsOption);
                        }
                    }
                    break;
            }
            
            // Add dropdown button when it's required
            switch(this.settings.cssFramework) {
                case 'bootstrap':
                    var dropdownTemplate = $(
                        '<div class="dropdown">' +
                            '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
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
                case 'foundation':
                    var dropdownTemplate = $(
                        '<div>' +
                            '<button class="button dropdown">' +
                                'Dropdown' +
                            '</button>' +
                        '</div>'
                    );
                    this.selectElements.yearSelect      = dropdownTemplate.clone().addClass('dateselector-year').append(this.selectElements.yearSelect);
                    this.selectElements.yearSelect.find('.button.dropdown').attr('data-dropdown', 'dateselector-year-' + this.instanceId);
                    this.selectElements.monthSelect     = dropdownTemplate.clone().addClass('dateselector-month').append(this.selectElements.monthSelect); 
                    this.selectElements.monthSelect.find('.button.dropdown').attr('data-dropdown', 'dateselector-month-' + this.instanceId);
                    this.selectElements.daySelect       = dropdownTemplate.clone().addClass('dateselector-day').append(this.selectElements.daySelect);
                    this.selectElements.daySelect.find('.button.dropdown').attr('data-dropdown', 'dateselector-day-' + this.instanceId);
                    this.selectElements.hoursSelect     = dropdownTemplate.clone().addClass('dateselector-hours').append(this.selectElements.hoursSelect); 
                    this.selectElements.hoursSelect.find('.button.dropdown').attr('data-dropdown', 'dateselector-hours-' + this.instanceId);
                    this.selectElements.minutesSelect   = dropdownTemplate.clone().addClass('dateselector-minutes').append(this.selectElements.minutesSelect); 
                    this.selectElements.minutesSelect.find('.button.dropdown').attr('data-dropdown', 'dateselector-minutes-' + this.instanceId);
                    this.selectElements.secondsSelect   = dropdownTemplate.clone().addClass('dateselector-seconds').append(this.selectElements.secondsSelect);
                    this.selectElements.secondsSelect.find('.button.dropdown').attr('data-dropdown', 'dateselector-seconds-' + this.instanceId);
                    dropdownTemplate.remove();
                    break;
                default: 
                    break;
            }

            // Set selectsClass option if necessary
            if(this.settings.selectsClass && this.settings.selectsClass != '') {
                this.selectElements.yearSelect.addClass(this.settings.selectsClass);
                this.selectElements.monthSelect.addClass(this.settings.selectsClass);
                this.selectElements.daySelect.addClass(this.settings.selectsClass);
                this.selectElements.hoursSelect.addClass(this.settings.selectsClass);
                this.selectElements.minutesSelect.addClass(this.settings.selectsClass);
                this.selectElements.secondsSelect.addClass(this.settings.selectsClass);
            }
            
            // Set default date
            if(this.settings.defaultValue instanceof Date) {
                this._setDateSelectorValue(this.currentValue);
                this._disableNonAvailableDays();
            }

            // Handle dateSelector changes
            switch(this.settings.cssFramework) {
                case 'bootstrap': case 'foundation':
                    var that = this;
                    this.selectElements.yearSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                        if(that.settings.cssFramework === 'foundation') Foundation.libs.dropdown.close(that.selectElements.yearSelect.find('.f-dropdown'));
                    });
                    this.selectElements.monthSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                        if(that.settings.cssFramework === 'foundation') Foundation.libs.dropdown.close(that.selectElements.monthSelect.find('.f-dropdown'));
                    });
                    this.selectElements.daySelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                        if(that.settings.cssFramework === 'foundation') Foundation.libs.dropdown.close(that.selectElements.daySelect.find('.f-dropdown'));
                    });
                    this.selectElements.hoursSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                        if(that.settings.cssFramework === 'foundation') Foundation.libs.dropdown.close(that.selectElements.hoursSelect.find('.f-dropdown'));
                    });
                    this.selectElements.minutesSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                        if(that.settings.cssFramework === 'foundation') Foundation.libs.dropdown.close(that.selectElements.minutesSelect.find('.f-dropdown'));
                    });
                    this.selectElements.secondsSelect.find('li a').on('click', function(event) {
                        event.preventDefault();
                        $this = $(event.target);
                        if(!$this.hasClass('disabled')) {
                            $this.parent().addClass('selected').siblings().removeClass('selected');
                            that._updateDateSelector();
                        }
                        if(that.settings.cssFramework === 'foundation') Foundation.libs.dropdown.close(that.selectElements.secondsSelect.find('.f-dropdown'));
                    });
                    break;
                default:
                    var that = this;
                    this.selectElements.yearSelect.on('change', function() {
                        that._updateDateSelector();
                    });
                    this.selectElements.monthSelect.on('change', function() {
                        that._updateDateSelector();
                    });
                    this.selectElements.daySelect.on('change', function() {
                        that._updateDateSelector();
                    });
                    this.selectElements.hoursSelect.on('change', function() {
                        that._updateDateSelector();
                    });
                    this.selectElements.minutesSelect.on('change', function() {
                        that._updateDateSelector();
                    });
                    this.selectElements.secondsSelect.on('change', function() {
                        that._updateDateSelector();
                    });
                    break;
            }
            
            // Append the dateSelector right after the source element
            if(this.settings.showDate)
                this.container.append(this.selectElements.daySelect).append(this.selectElements.monthSelect).append(this.selectElements.yearSelect);
            if(this.settings.showTime)
                this.container.append(this.selectElements.hoursSelect).append(this.selectElements.minutesSelect).append(this.selectElements.secondsSelect);
            if(this.settings.cssFramework === 'bootstrap')
                this.container.find('.dropdown-toggle').dropdown();
            if(this.settings.cssFramework === 'foundation')
                this.container.foundation('dropdown', 'reflow');

            $.event.trigger({
                type: "selectorInitialized.dateselector",
                message: "end dateSelector initialization",
                time: new Date()
            });
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


        // To call a call a pseudo private method: 
        //this._pseudoPrivateMethod();

        // To call a real private method from those public methods, you need to use 'call' or 'apply': 
        //privateMethod.call(this);

        /**
         * getDate method
         *
         * @example
         * $('#element').pluginName('getDate');
         * 
         * @return {date} current selector's value
         */
        getDate: function() {
            return this.currentValue;
        },

        /**
         * setDate method
         *
         * @example
         * $('#element').pluginName('setDate', dateObject);
         * 
         * @param  {date} date [the date to set for selector]
         */
        setDate: function(date) {
            this._setDateSelectorValue(date);
        },
        
        /**
         * getDateString method
         *
         * @example
         * $('#element').pluginName('getDateString');
         * 
         * @return {string} current selector's value
         */
        getDateString: function() {
            return moment(this.currentValue).format(this.settings.dateFormat);
        },

        /**
         * setDateString method
         *
         * @example
         * $('#element').pluginName('setDateString', dateString);
         * 
         * @param  {string} dateString [the date to set for selector]
         */
        setDateString: function(dateString) {
            if(moment(dateString).isValid())
                this._setDateSelectorValue(moment(dateString));
        },

        /**
         * getDateStringWithFormat method
         *
         * @example
         * $('#element').pluginName('getDateStringWithFormat', 'DD/MM/YYYY HH:mm:ss');
         * 
         * @param  {string} format [the format to use to parse the selector's date value]
         * @return {string} current selector's value
         */
        getDateStringWithFormat: function(format) {
            return moment(this.currentValue).format(format);
        },

        /**
         * setDateStringWithFormat method
         *
         * @example
         * $('#element').pluginName('setDateStringWithFormat', dateString, 'DD/MM/YYYY HH:mm:ss');
         * 
         * @param  {string} dateString [the date to set for selector]
         * @param  {string} format [the format to use to parse the selector's date value]
         * @return {string} current selector's value
         */
        setDateStringWithFormat: function(dateString, format) {
            if(moment(dateString, format, true).isValid())
                this._setDateSelectorValue(moment(dateString, format, true));
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
                case 'bootstrap': case 'foundation':
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
            $.event.trigger({
                type: "gettingDate.dateselector",
                message: "start getDateSelectorValue method",
                time: new Date()
            });

            var selector;
            switch(this.settings.cssFramework) {
                case 'bootstrap': case 'foundation':
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

            $.event.trigger({
                type: "dateGot.dateselector",
                message: "end getDateSelectorValue method",
                time: new Date()
            });
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
            $.event.trigger({
                type: "settingDate.dateselector",
                message: "start setDateSelectorValue method",
                time: new Date()
            });

            switch(this.settings.cssFramework) {
                case 'bootstrap': case 'foundation':
                    this.selectElements.yearSelect.find('li[value="' + date.getFullYear() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.monthSelect.find('li[value="' + date.getMonth() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.daySelect.find('li[value="' + date.getDate() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.hoursSelect.find('li[value="' + date.getHours() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.minutesSelect.find('li[value="' + date.getMinutes() + '"]').addClass('selected').siblings().removeClass('selected');
                    this.selectElements.secondsSelect.find('li[value="' + date.getSeconds() + '"]').addClass('selected').siblings().removeClass('selected');

                    var toggleButton = (this.settings.cssFramework === 'bootstrap') ? '.dropdown-toggle' : '.dropdown.button';
                    var caretString = (this.settings.cssFramework === 'bootstrap') ? '<span class="caret"></span>' : '';
                    this.selectElements.yearSelect.find(toggleButton).text(this.selectElements.yearSelect.find('li.selected a').text()).append($(caretString));
                    this.selectElements.monthSelect.find(toggleButton).text(this.selectElements.monthSelect.find('li.selected a').text()).append($(caretString));
                    this.selectElements.daySelect.find(toggleButton).text(this.selectElements.daySelect.find('li.selected a').text()).append($(caretString));
                    this.selectElements.hoursSelect.find(toggleButton).text(this.selectElements.hoursSelect.find('li.selected a').text()).append($(caretString));
                    this.selectElements.minutesSelect.find(toggleButton).text(this.selectElements.minutesSelect.find('li.selected a').text()).append($(caretString));
                    this.selectElements.secondsSelect.find(toggleButton).text(this.selectElements.secondsSelect.find('li.selected a').text()).append($(caretString));
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

            $.event.trigger({
                type: "dateSet.dateselector",
                message: "end setDateSelectorValue method",
                time: new Date()
            });
        },
        //
        _updateDateSelector: function() {
            $.event.trigger({
                type: "updatingSelector.dateselector",
                message: "start updateDateSelector method",
                time: new Date()
            });

            this.currentValue = this._getDateSelectorValue();
            this._setDateSelectorValue(this.currentValue);
            this._disableNonAvailableDays();   
            this._updateSourceInputValue();
            this.settings.onDateChange.call(this);

            $.event.trigger({
                type: "selectorUpdated.dateselector",
                message: "end updateDateSelector method",
                time: new Date()
            });
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
        hoursStep       : 1,
        minutesStep     : 1,
        secondsStep     : 1,
        cssFramework    : undefined, // could be 'bootstrap', 'foundation'
        container       : undefined,
        onDateChange    : function() {},
        hideSourceNode  : true,
        containerClass  : undefined,
        selectsClass    : undefined,
        lang            : window.navigator.userLanguage || window.navigator.language
    };
 
}(jQuery));
