console.log("hello wanker")

browser.menus.create({
        id: "download",
        title: "Download media on page",
        contexts: ["selection"]
});

browser.menus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case "download":
        console.log("I downloa,d")
        break
    }
})

