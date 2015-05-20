## DateSelector

Datepickers are great, that's right. But in some cases it's not intuitive at all.
For example when you want to get a user's birthday, online selects or dropdowns are a lot much better.

The aim of this plugin is to easily build that kind of form fields for date input.

## Installation

For now, the plugin has dependencies with jQuery and Moment. You can include it like following.
The css file isn't required if you don't want to use the plugin style. 
Bootstrap & Foundation aren't required at all, they're in the repo only for demo purpose.

## Usage

**HTML**
```html
    <head>
        <link href="path/to/plugin/dateselector.css" rel="stylesheet">
    </head>
    <body>
        <div id="element"></div>
        <script src="path/to/jquery/jquery.js"></script>
        <script src="path/to/moment/moment.js"></script>
        <script src="path/to/plugin/jquery.dateselector.js"></script>
    </body>
```

**JAVASCRIPT**
```javascript
    $(document).ready(function() {
        $('#element').dateSelector();
    });
```

## Demo

See [demo project page](http://mickaelr.github.io/dateSelector/)

## License

The plugin is under MIT License


## TODO

Unit testing
Build a "light version" of the plugin
...
