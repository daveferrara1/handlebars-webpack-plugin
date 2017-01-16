# Webpack plugin for Hapi + Vision + Handlebars

## Why?

Running 'webpack-dev-server' couldn't handle a {{{content}}}. ALso, i couldn't name things {{folder/filename}} and have it work eigther. This makes the two uniform. 

> Server-side template rendering using [Handlebars](http://handlebarsjs.com/).

`use this repo`
OR 
`npm install handlebars-webpack-plugin --save-dev`
And
`patch partials.js`

## Whats Different?

This will make it so you don't have to use somthing like {{folder/file}}. This if you are using Hapi + Vision + handlebars. Just keep partial file names unique and list each partial directory. Once for Vision and Once for the plugin:

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

    {{> header title="page title"}}

    {{> partialNamet}}
</body>
```
