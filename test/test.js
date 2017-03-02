var chai = require('chai');
var should = chai.should();
var HandlebarsPlugin = require('../');

describe('handlebars-webpack-plugin-simple', function() {
  describe('check options', function() {
    it('all options should accept values', function() {
      var test = new HandlebarsPlugin({
        hash: 'test-path',
        entries: {
          spa: {
            entry: 'test-path',
            output: 'test-path',
          },
          app: {
            entry: 'test-path-app',
            output: 'test-path-app',
          },
          app2: {
            entry: 'test-path-app2',
            output: 'test-path-app2',
          },
        },
        entry: 'test-path',
        output: 'test-path',
        data: 'test-path',
        partials: [
          'test-path',
          'test-path-two',
        ],
        helpers: {
          projectHelpers: 'test-path'
        },
        onBeforeSetup: function (Handlebars) {},
        onBeforeAddPartials: function (Handlebars, partialsMap) {},
        onBeforeCompile: function (Handlebars, templateContent) {},
        onBeforeRender: function (Handlebars, data) {},
        onBeforeSave: function (Handlebars, resultHtml) {},
        onDone: function (Handlebars) {}
      });

      should.equal('test-path', test.options.hash);
      should.equal(3, Object.keys(test.options.entries).length);
      should.equal('test-path', test.options.data);

    });
  });
});