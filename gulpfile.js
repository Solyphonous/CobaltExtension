const gulp = require("gulp")
const zip = require("gulp-zip")
const jsonTranform = require("gulp-json-transform")
const file = require("gulp-file")
const fs = require("fs")
const semver = require("semver")

function getCurrentVersion(browser) {
    const manifest = JSON.parse(fs.readFileSync(`./src/${browser}/manifest.json`));
    return manifest.version;
}

function incrementVersion(version) {
    return semver.inc(version, "minor")
}

function updateManifest(browser) {
    const path = "./src/${browser}/manifest.json"
    const curVer = getCurrentVersion(browser)
    const newVer = incrementVersion(curVer)

    return gulp.src(path)
        .pipe(jsonTranform(manifest => {
            manifest.version = newVer
            return manifest
        }))
        .pipe(gulp.dest("./build"))
}

function copyFiles(browser) {
    return gulp.src("./src/shared/**/*")
    .pipe(gulp.dest("./build"))
    .pipe(gulp.src("./src/${browser}/manifest.json"))
    .pipe(gulp.dest("./build"))
}

function zipFiles(browser) {
    const ver = getCurrentVersion(browser)
    return gulp.src("./build/**/*")
    .pipe(zip("cobaltextension_${browser}_v${ver}.zip"))
    .pipe(gulp.dest(".dist/"))
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