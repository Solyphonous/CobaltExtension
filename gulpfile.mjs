import gulp from "gulp"
import zip from "gulp-zip"
import jsonTranform from "gulp-json-transform"
import fs from "fs"
import semver from "semver"

function getCurrentVersion(browser) {
    const path = "./src/"+browser+"/manifest.json"
    const manifest = JSON.parse(fs.readFileSync(path));
    return manifest.version;
}

function incrementVersion(version) {
    return semver.inc(version, "minor")
}

function updateManifest(browser) {
    const path = "./src/"+browser+"/manifest.json"
    const curVer = getCurrentVersion(browser)
    const newVer = incrementVersion(curVer)

    return gulp.src(path)
        .pipe(jsonTranform(manifest => {
            manifest.version = newVer
            return manifest
        }, 2))
        .pipe(gulp.dest("./src/"+browser))
        .pipe(gulp.dest("./build"))
}

function copyFiles(browser) {
    return gulp.src("./src/shared/**/*")
    .pipe(gulp.dest("./build"))
    .pipe(gulp.src("./src/"+browser+"/manifest.json"))
    .pipe(gulp.dest("./build"))
}

function zipFiles(browser) {
    const ver = getCurrentVersion(browser)
    return gulp.src("./build/**/*")
    .pipe(zip("cobaltextension_"+browser+".zip"))
    .pipe(gulp.dest("dist/"))
}

gulp.task("build-firefox", gulp.series(
    () => updateManifest("firefox"),
    () => copyFiles("firefox"),
    () => zipFiles("firefox")
))

gulp.task("build-chrome", gulp.series(
    () => updateManifest("chrome"),
    () => copyFiles("chrome"),
    () => zipFiles("chrome")
))

gulp.task("build", gulp.parallel("build-firefox", "build-chrome"))