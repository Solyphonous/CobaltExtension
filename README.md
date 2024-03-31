# Cobalt Browser Extension
An extension for Firefox and Chromium browsers that uses the [cobalt](https://cobalt.tools/) API.

### Installation
Firefox: Download from the Firefox Addons site [here](https://addons.mozilla.org/en-GB/firefox/addon/cobaltextension/)!

Chrome: There is no version build directly for chrome at this time, since it costs $5 to put an extension on the chrome store and I am poor. However, you can still build it from source as a developer extension with the instructions below. This will *not* automatically update, but it's the best you're gonna get!

From source (both firefox and chrome):
- Download the source code under code -> download ZIP at the top of this page
- Delete the firefox/chrome folder depending on whichever browser you aren't using
- Move manifest.json from browser folder to shared folder
- Go to chrome://extensions (CHROME) or about:debugging -> This Firefox (FIREFOX)
- Click developer mode in the top right (CHROME ONLY)
- Click "Load Unpacked" for chrome and "Load Temporary Add-on..." for firefox
- Select shared folder for chrome, or any file inside the folder for firefox
- Huzzah! Thy extension is ALIVE!!!
