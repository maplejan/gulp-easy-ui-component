var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var htmlMinify = require('html-minifier');
var cleanCSS = new (require('clean-css'))();
var through = require('through');

function gulpEasyUiComponent(file, opt) {
    var fileBuffer = null;
    var htmlFileData = '';
    var cssFileData = '';
    var jsFileData = '';

    function initComponent(file, callback) {
        if (file.isNull()) {
            return ;
        }

        if (file.isStream()) {
            return this.emit('error', new PluginError('gulp-easy-ui-component',  'Streaming not supported'));
        }

        if (/.html$/.test(file.path)) {
            htmlFileData = htmlMinify.minify(file.contents.toString('utf-8'), {
                collapseWhitespace: true,
                removeComments: true,
                removeAttributeQuotes: true,
                minifyCSS: true
            });
        } else if (/.css/.test(file.path)) {
            cssFileData = '<style type="text/css">'
                + cleanCSS.minify(file.contents.toString('utf-8'))
                + '</style>';
        } else if (/.js/.test(file.path)) {
            jsFileData = file.contents.toString('utf-8');
        }

        if (!fileBuffer) {
            fileBuffer = file;
        } else {
            fileBuffer.contents = new Buffer(jsFileData
                .replace(/{{template}}/, htmlFileData)
                .replace(/{{style}}/, cssFileData));
        }
    }

    function endStream() {
        if (fileBuffer) {
            this.emit('data', fileBuffer);
        }
        this.emit('end');
    }

    return through(initComponent, endStream);
}

module.exports = gulpEasyUiComponent;