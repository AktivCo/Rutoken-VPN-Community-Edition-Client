var gulp = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    argv = require('yargs').argv;



// create the gulp task


// create the gulp task
gulp.task('copyexec', () => {
    gulp.src(['./executables/*']).pipe(gulp.dest('./win/rutokenvpnclient-win32-ia32/executables'));
    gulp.src(['./config/*']).pipe(gulp.dest('./win/rutokenvpnclient-win32-ia32/config'));
});

gulp.task('setNsis', () => {
    var filePath = path.join(__dirname, './assets/win/installer.nsi.tpl');
    var bmpPath = path.join(__dirname, './assets/win/a.bmp');
    var result = fs.readFileSync(filePath, 'utf8');
    var ar = result.split('\n');

    for (var i = 0, len = ar.length; i < len; i++) {
        if (ar[i].indexOf("!define BITMAP_FILE") !== -1)
            ar[i] = "!define BITMAP_FILE " + bmpPath;
    }
    var str = ar.join("\n");

    fs.writeFile(filePath, str, (err) => console.log(err));
});

//usage : gulp setPkgJsonVersion  -v 1.0.0 
gulp.task('setPkgJsonVersion', () => {

    var version = argv.v;
    if (version === undefined) 
        throw new Error('Version is undefined');



    var filePath = path.join(__dirname, './config.json');
    var result = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    result.win.version = version;

    fs.writeFile(filePath, JSON.stringify(result, null, 4), (err) => console.log(err));

});


//!define BITMAP_FILE "E:\gt\rutokenvpnclient\assets\win\a.bmp"

// var result = fs.readFileSync(path.join(__dirname, './assets/win/installer.nsi.tpl'), 'utf8');
// var ar = result.split('\n');for(var i = 0, len = ar.length; i < len; i++){   if(ar[i].indexOf("!define BITMAP_FILE") !== -1)    ar[i] = "!define BITMAP_FILE \"E:\gt\rutokenvpnclient\assets\win\1.bmp\""; }var str = ar.join("\n");  