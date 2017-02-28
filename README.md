[![ISC License](https://img.shields.io/npm/l/handlebars-webpack-plugin-simple.svg)](https://opensource.org/licenses/ISC)
[![NPM](https://nodei.co/npm/handlebars-webpack-plugin-simple.png?downloads=true)](https://npmjs.org/package/handlebars-webpack-plugin-simple)

Updates Include:

* Output a hash partial {{> hash}} of value [hash].
* Multiple files option instead of just SPA single file.
* Simplified naming to aide with Hapi Vision Templates. 


See this WIP Boilerplate for webpack 2 config.  https://github.com/Devmonic/Hapi

To install use NPM: `npm install handlebars-webpack-plugin-simple --save-dev`


# Webpack plugin for Hapi + Handlebars

## Why?

When running "webpack-dev-server" I couldn't use handlebars simply like so: {{{content}}} or {{filename}}. This simplifies the process. Originally implemented to support "webpack2 + Handlebars + Vision + Hapi." 
I now prefer this even without Vision so my fork has been added to NPM. 


## Whats Different?

This will make it so you don't have to use something like {{ folder/file }}. If you are using Hapi + Handlebars this example may not work with Vision Templates. So instead use use this plugin and just keep partial file names unique and list each partial directory. Now you get {{ file }}. I ran into this naming convention issue using Vision. You will still list the partial directories once for Vision configuration,  and again for webpack in `webpack.config.js'. See the examples below.

Should note, currently support for context like: {{> header title="page title"}} is not tested. Use "data:" with JSON instead.

<br /><br /><br />

### General Usage
--------

webpack.config.js include:

```javascript
var path = require("path");
var HandlebarsPlugin = require("handlebars-webpack-plugin");

var webpackConfig = {

    plugins: [

        new HandlebarsPlugin({
            // HASH example.
            // Useful if you have names with [hash].
            // Works great with CommonChunksPlugin.
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

##### Additions specific to Vision Templates

Vision include:
```
...
partialsPath: [__dirname + '/src/partials', __dirname + '/src/partials/example'],
...
```



<br /><br />
###Handlebars Examples:
----------


####Partials & Helpers

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
    // partial
    {{> partialName}}

    // helper
    {{HelperFileName}}
</body>
```

<br /><br />

####Passing JSON data to templates:


JSON FILE:
```
{
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
}
```

WEBPACK (webpack.config.js):

```
new HandlebarsPlugin({
  ...
  data: require(path.join(process.cwd(), "src", "views", "helpers", "data.json")),
  ...
}),
```

TEMPLATE FILE (someFile.hbs):

```
{{title}}
{{app.title}}
```

<br />

####Using JSON data with a helper:

HELPER FILE:

```
const data = require("./path/to/data.json");

in helper:

data.title
data.app.title
```
