import gulp from "gulp"
import zip from "gulp-zip"
import jsonTranform from "gulp-json-transform"
import yargs from "yargs"

const argv = yargs(process.argv.slice(2)).parse();
const ver = (argv.ver).substring(1)

function updateManifest(browser) {
    const path = "./src/"+browser+"/manifest.json"
    const newVer = ver
    
    return gulp.src(path)
        .pipe(jsonTranform(manifest => {
            manifest.version = newVer
            return manifest
        }, 2))
        .pipe(gulp.dest("./src/"+browser))
        .pipe(gulp.dest("./build/"+browser))
}

function copyFiles(browser) {
    return gulp.src("./src/shared/**/*")
    .pipe(gulp.dest("./build/"+browser))
}

function copyManifest(browser) {
    return gulp.src("./src/"+browser+"/manifest.json")
    .pipe(gulp.dest("./build/"+browser))
}

function zipFiles(browser) {
    return gulp.src("./build/"+browser+"/**/*")
    .pipe(zip("cobaltextension_"+browser+"_v"+ver+".zip"))
    .pipe(gulp.dest("dist/"))
}

gulp.task("build-firefox", gulp.series(
    () => updateManifest("firefox"),
    () => copyFiles("firefox"),
    () => copyManifest("firefox"),
    () => zipFiles("firefox")
))

gulp.task("build-chrome", gulp.series(
    () => updateManifest("chrome"),
    () => copyFiles("chrome"),
    () => copyManifest("chrome"),
    () => zipFiles("chrome")
))

gulp.task("build", gulp.parallel("build-firefox", "build-chrome"))