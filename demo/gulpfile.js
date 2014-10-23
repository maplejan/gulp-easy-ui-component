var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var easyUIComponent = require('gulp-easy-ui-component');

function eachComponents(callback) {
    var path = 'component/';
    var components = fs.readdirSync(path);

    components.forEach(function (value) {
        var cName = value;

        // 非文件夹直接忽略
        var stat = fs.statSync(path + cName);
        if (!stat.isDirectory()) {
            return ;
        }

        var cPath = path + cName + '/';
        var cVersions = fs.readdirSync(cPath);

        // 遍历各个版本
        cVersions.forEach(function (value) {
            var cVersionPath = cPath + value + '/';
            var opt = {
                cName: cName,
                cVersionPath: cVersionPath,
                fileArr: [
                    cVersionPath + 'template.html',
                    cVersionPath + 'style.css',
                    cVersionPath + 'script.js'
                ]
            };

            callback(opt);
        });

    });
}

function initComponent(opt) {
    var cName = opt.cName;
    var cVersionPath = opt.cVersionPath;
    var fileArr = opt.fileArr;

    gulp.src(fileArr)
        .pipe(easyUIComponent())
        .pipe(rename(cName + '.js'))
        .pipe(gulp.dest(cVersionPath));
}

gulp.task('init-component', function () {
    eachComponents(initComponent);
});

gulp.task('watch-component', function () {
    eachComponents(function (opt) {
        gulp.watch([opt.fileArr], function () {
            initComponent(opt);
            console.log(opt.cVersionPath + opt.cName + ' is update. [' + new Date() + ']');
        });
    });
});

gulp.task('default', ['init-component']);