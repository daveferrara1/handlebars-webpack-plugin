# Webpack plugin for Hapi + Handlebars

## Why?

When running "webpack-dev-server" I couldn't use handlebars like so: {{{content}}} or {{filename}}. This simplifies the process. Originally implemented to support "webpack2 + vision + hapi." I also found even without Vision this was helpful for "webpack2 + hapi" so this has been added to NPM. 

To install use NPM: `npm install handlebars-webpack-plugin-simple --save-dev`

## Whats Different?

This will make it so you don't have to use something like {{ folder/file }}. If you are using Hapi + handlebars this may not work of you also use Vision. Just keep partial file names unique and list each partial directory. I ran into this using Vision. So you'll list the partial directories once for Vision configuration and again for webpack in `webpack.config.js'.

Currently support for context like: {{> header title="page title"}} is non-working.

## Usage

With Vision include:

`partialsPath: [__dirname + '/src/partials', __dirname + '/src/partials/example'], // and so on`


With webpack2 include "webpack.config.js":

```javascript
var path = require("path");
var HandlebarsPlugin = require("handlebars-webpack-plugin");

var webpackConfig = {

    plugins: [

        new HandlebarsPlugin({
            // path to main hbs template
            entry: path.join(process.cwd(), "app", "src", "index.hbs"),
            // filepath to result
            output: path.join(process.cwd(), "build", "index.html"),
            // data passed to main hbs template: `main-template(data)`
            data: require("./app/data/project.json"),

            // Matching your vision partials
            // Use globbed path to partials, where folder/filename is unique
            partials: [
                path.join(process.cwd(), "src", "partials", "*.hbs"),
                path.join(process.cwd(), "src", "partials", "example", "*.hbs"),
            ],

            // register custom helpers. May be either a function or a glob-pattern
            helpers: {
                nameOfHbsHelper: Function.prototype,
                projectHelpers: path.join(process.cwd(), "app", "helpers", "*.helper.js")
            },

            // hooks
            onBeforeSetup: function (Handlebars) {},
            onBeforeAddPartials: function (Handlebars, partialsMap) {},
            onBeforeCompile: function (Handlebars, templateContent) {},
            onBeforeRender: function (Handlebars, data) {},
            onBeforeSave: function (Handlebars, resultHtml) {},
            onDone: function (Handlebars) {}
        })
    ]
};
```

Partial ids are registered by `parentFolder/filename` (without file extensions)

Use handlebars in your main and partials like, i.e.

BEFORE
```hbs
<body>
    {{> partialFolder/partialName}}

    {{> header/header title="page title"}}

    {{> partial/content}}
</body>
```
NOW
```hbs
<body>
    {{> partialName}}   

    {{> partialNamet}}

    Currently not correctly supporting this implementation:  {{> header title="page title"}}
</body>
```
