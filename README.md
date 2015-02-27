## DateSelector

Datepickers are great, that's right. But in some cases it's not intuitive at all.
For example when you want to get a user's birthday, online selects or dropdowns are a lot much better.

The aim of this plugin is to easily build that kind of form fields for date input.

## Code Example

**HTML**
```html
    <head>
        <link href="path/to/plugin/dateselector.css" rel="stylesheet">
    </head>
    <body>
        <div id="element"></div>
        <script src="path/to/plugin/dateselector.js"></script>
    </body>
```

**JAVASCRIPT**
```javascript
    $(document).ready(function() {
        $('#element').dateSelector();
    });
```

## Installation

It's a jquery-based plugin, so the only thing you have to import in your project are a jQuery version and dateselector.js (and dateselector.css if you want to use the plugin style).
Bootstrap & Foundation aren't required at all, they're in the repo only for demo purpose.

## License

The plugin will be under MIT License