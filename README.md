# Webpack plugin for Hapi + Handlebars

## Why?

Running 'webpack-dev-server' couldn't handle a {{{content}}}. Also, i couldn't name things a simple name like {{filename}} and have it work either. This simplifies the process.

> Server-side template rendering using [Handlebars](http://handlebarsjs.com/).

`use this repo`
`npm install handlebars-webpack-plugin-simple --save-dev`

## Whats Different?

This will make it so you don't have to use something like {{ folder/file }}. If you are using Hapi + handlebars this may not work of you also use Vision. Just keep partial file names unique and list each partial directory. I ran into this using Vision. So you'll list the partial directories once for Vision configuration and again for webpack in `webpack.config.js'.

Currently support for  {{> header title="page title"}} is non working.

## Usage

For vision include:
`partialsPath: [__dirname + '/src/partials', __dirname + '/src/partials/example'], // and so on`


In your webpack config register and setup the handlebars plugin

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

    Currently not supporting this implementation:  {{> header title="page title"}}
</body>
```
