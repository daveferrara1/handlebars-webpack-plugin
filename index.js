"use strict";


var fs = require("fs-extra");
var chalk = require("chalk");
var Handlebars = require("handlebars");
var glob = require("glob");
var partialUtils = require("./utils/partials");
var log = require("./utils/log");

// Export Handlebars for easy access in helpers.
HandlebarsPlugin.Handlebars = Handlebars;


function getHelperId(filepath) {
  var id = filepath.match(/\/([^\/]*).js$/).pop();
  return id.replace(/\.?helper\.?/, "");
}


function addHelper(Handlebars, id, fun) {
  log(chalk.gray("Helper: {{" + id + "}}"));
  Handlebars.registerHelper(id, fun);
}

function HandlebarsPlugin(options) {
  if (options.onBeforeSetup) {
    options.onBeforeSetup(Handlebars);
  }
  this.options = options;
  this.outputFile = options.output;
  this.entryFile = options.entry;
  this.data = options.data || {};
  this.fileDependencies = [];

  // Register helpers.
  var self = this;
  var helperQueries = options.helpers || {};
  Object.keys(helperQueries).forEach(function (helperId) {
    var foundHelpers;

    // Globbed paths.
    if (typeof helperQueries[helperId] === "string") {
      foundHelpers = glob.sync(helperQueries[helperId]);
      foundHelpers.forEach(function (pathToHelper) {
        addHelper(Handlebars, getHelperId(pathToHelper), require(pathToHelper));
        self.addDependency(pathToHelper);
      });

      // Functions.
    } else {
      addHelper(Handlebars, helperId, helperQueries[helperId]);
    }
  });
}

HandlebarsPlugin.prototype.readFile = function (filepath) {
  this.fileDependencies.push(filepath);
  return fs.readFileSync(filepath, "utf-8");
};

HandlebarsPlugin.prototype.addDependency = function () {
  this.fileDependencies.push.apply(this.fileDependencies, arguments);
};

HandlebarsPlugin.prototype.apply = function (compiler) {

  var self = this;
  var options = this.options;
  var data = this.data;
  var entryFileSPA = options.entry;
  var outputFileSPA = options.output;
  // Options entries.
  var entries = options.entries;


  compiler.plugin("emit", function (compilation, done) {

    var templateContent;
    var template;
    var result;
    var partials;

    // Fetch paths to partials.
    partials = partialUtils.loadMap(Handlebars, options.partials);
    // Possibly add to partials.

    if (options.onBeforeAddPartials) {
      options.onBeforeAddPartials(Handlebars, partials);
    }

    // Possibly add [hash] partial.
    if (options.hash) {
      var hashKey = partialUtils.getPartialId(options.hash);
      partials[hashKey] = options.hash;
      fs.outputFileSync(options.hash, compilation.hash, "utf-8");
    }

    // Register all partials.
    partialUtils.addMap(Handlebars, partials);
     // Remove hash before add to watch to prevent HMR loop.
    var hashRemove = (options.hash) ? delete partials[hashKey] : false;
    // Watch all partials for changes.
    self.addDependency.apply(self, Object.keys(partials).map(function (key) {
      return partials[key];
    }));


    // Log where we created [hash] file.
    if (options.hash) {
      console.log(chalk.green(options.hash + " created"));
    }

    // Create each output file.
    if (entries) {
      for (var key in entries) {
        if (entries.hasOwnProperty(key)) {
          var entry = entries[key];
          for (var prop in entry) {
            if (entry.hasOwnProperty(prop)) {
              if (prop = 'entry') {
                var entryFile = entry[prop];
              }
              if (prop = 'output') {
                var outputFile = entry[prop];
              }

            }
          }

          templateContent = self.readFile(entryFile, "utf-8");

          if (options.onBeforeCompile) {
            templateContent = options.onBeforeCompile(Handlebars, templateContent) || templateContent;
          }
          template = Handlebars.compile(templateContent);

          if (options.onBeforeRender) {
            data = options.onBeforeRender(Handlebars, data) || data;
          }
          result = template(data);

          if (options.onBeforeSave) {
            result = options.onBeforeSave(Handlebars, result) || result;
          }
          fs.outputFileSync(outputFile, result, "utf-8");
          // Log where we created file.
          console.log(chalk.green(outputFile + " created"));

          if (options.onDone) {
            options.onDone(Handlebars);
          }
        }
      }
    }
    else {
      templateContent = self.readFile(entryFileSPA, "utf-8");

          if (options.onBeforeCompile) {
            templateContent = options.onBeforeCompile(Handlebars, templateContent) || templateContent;
          }
          template = Handlebars.compile(templateContent);

          if (options.onBeforeRender) {
            data = options.onBeforeRender(Handlebars, data) || data;
          }
          result = template(data);

          if (options.onBeforeSave) {
            result = options.onBeforeSave(Handlebars, result) || result;
          }
          fs.outputFileSync(outputFileSPA, result, "utf-8");
          // Log where we created file.
          console.log(chalk.green(outputFileSPA + " created"));

          if (options.onDone) {
            options.onDone(Handlebars);
          }
    }
    // Add dependencies to watch. This might not be the correct place
    // for that - but it works.
    // webpack filters duplicates...
    compilation.fileDependencies = compilation.fileDependencies.concat(self.fileDependencies);
    done();
  });
};


module.exports = HandlebarsPlugin;
