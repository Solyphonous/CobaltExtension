# Cobalt Browser Extension
An extension for Firefox and Chromium browsers that uses the [cobalt](https://cobalt.tools/) API.

### Installation
Firefox: Download from the Firefox Addons site [here](https://addons.mozilla.org/en-GB/firefox/addon/cobaltextension/)! (Version 1.6) (Latest)

Chrome: Only available from source since youtube downloaders are not allowed on chrome.

From source (both firefox and chrome):
- Download the source code under code -> download ZIP (don't forget to unzip!) at the top of this page OR use `git clone https://github.com/Solyphonous/CobaltExtension.git` in git bash (windows) or bash (linux) to clone the repo
- Delete the firefox/chrome folder depending on whichever browser you aren't using
- Move manifest.json from browser folder to shared folder
- Go to chrome://extensions (CHROME) or about:debugging -> This Firefox (FIREFOX)
- Click developer mode in the top right (CHROME ONLY)
- Click "Load Unpacked" for chrome and "Load Temporary Add-on..." for firefox
- Select shared folder for chrome, or any file inside the folder for firefox
- Huzzah! Thy extension is ALIVE!!!
