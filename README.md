# Version 1.2.0.

Now can output a hash partial {{> hash}} of value [hash], and will output multiple files option instead of just SPA single file.

See this WIP Boilerplate for webpack 2 config.  https://github.com/Devmonic/Hapi


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
            // HASH example.
            // Useful if you have names with [hash].
            // Path to output a partial file containing [hash].
            // Use {{> hash}} or /app-{{> hash}}.js.
            hash: path.join(process.cwd(), "src", "views", "partials", "hash.hbs"),

            // MPA example
            // Create Handlebars Entry Points & compiled Output files.
            entries: {
              app: {
                  entry: path.join(__dirname, "src/views/templates/app.hbs"),
                  output: path.join(__dirname, "public/build/index.html"),
                },
              app2: {
                  entry: path.join(__dirname, "src/views/templates/app2.hbs"),
                  output: path.join(__dirname, "public/build/app2.html"),
              },
            },

            // SPA example
            // Just Use One exports entry:{} point.
            // entry: path.join(__dirname, "src/views/templates/index.hbs"),
            // output: path.join(__dirname, "public/index.html"),

            // This data: implementation will pass file data to all templates.
            // Use data passed to hbs templates: "{{ val }}" or "{{ val.more }}"
            data: require(path.join(process.cwd(), "src", "views", "helpers", "data.json")),

            // Add globbed path to partials, where folder/filename is unique
            partials: [
              path.join(process.cwd(), "src", "views", "partials", "*.hbs"),
              path.join(process.cwd(), "src", "views", "partials", "example", "*.hbs"),
            ],

            // Add custom helpers. May be either a function or a glob-pattern,
            // where folder/filename is unique if file.
            // Can add a function directly.
            helpers: {
              // nameOfHbsHelper: Function.prototype,
              projectHelpers: path.join(process.cwd(), "src", "views", "helpers", "*.js")
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

###Passing JSON data to templates:

This will make the each .json file available to all templates.

JSON FILE:
`{
  "title": "Json File Title",
  "meta": "Json File Meta ",
  "app": {
    "title": "app title",
    "meta": "app meta"
  }
  "app2": {
    "title": "app2 title",
    "meta": "app2 meta"
  }
}`

webpack.config.js:
```
new HandlebarsPlugin({
  ...
  data: require(path.join(process.cwd(), "src", "views", "helpers", "data.json")),
  ...
}),
```

Template File (someFile.hbs):
```
{{title}}
{{app.title}}

```




###Passing JSON data to a helper:

```
const data = require("./public/build/manifest.json");

in helper:

data.title
data.app.title
```
