var current = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Count
    if (Object.getOwnPropertyNames(request) == "count") {
        if (request.count == "true") {
            current++;
            chrome.storage.local.set({ current: current.toString() });
            chrome.action.setBadgeText({ text: current.toString() });
            updateLastClick();
            sendResponse("Have counted");
        }
    }

    // Switch auto mode
    if (Object.getOwnPropertyNames(request) == "switchAutoMode") {
        // Turm on Auto mode
        if (request.switchAutoMode == "turn on") {
            chrome.storage.local.set({ "mode": "auto" });
            chrome.action.setIcon({ path: "/icon/icon_auto.png" });
            chrome.contextMenus.update("1", {
                title: "Switch to Manual mode"
            });
            sendResponse("Turn on Auto mode");
        }
        // Turn off Auto mode
        else {
            chrome.storage.local.set({ "mode": "manual" });
            chrome.contextMenus.update("1", {
                title: "Switch to Auto mode (only available for EWOQ page)"
            });
            chrome.action.setIcon({ path: "./icon/icon_manual.png" });
            sendResponse("Turn off Auto mode");
        }

    }

    // Reset counter
    if (Object.getOwnPropertyNames(request) == "resetCounter") {
        if (request.resetCounter == "true") {
            current = 0;
            chrome.storage.local.set({ current: current.toString() });
            chrome.action.setBadgeText({ text: current.toString() });
            sendResponse("Counter reset successfully");
        }
    }

    // Set total click
    if (Object.getOwnPropertyNames(request) == "setTotalClick") {
        current = parseInt(request.setTotalClick);
        chrome.storage.local.set({ current: current.toString() });
        chrome.action.setBadgeText({ text: current.toString() });
        sendResponse("Set new total click successfully");
    }

});


function getCurrentTime() {
    let currentdate = new Date();
    let currentTime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        ", " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

    return currentTime;
}

function updateLastClick() {
    let lastClickTime = getCurrentTime();
    chrome.storage.local.set({ lastClick: lastClickTime });
    chrome.contextMenus.update("4", {
        title: "Last click: " + lastClickTime,
    });
    //
    chrome.storage.local.get(["historyClick"], function (items) {
        if (items.historyClick == undefined) {
            let his = [];
            his.push(lastClickTime);
            chrome.storage.local.set({ historyClick: his });
        } else {
            let his = items.historyClick;
            if (his.length < 3) {
                his.push(lastClickTime);
            } else {
                for (let i = 0; i < his.length; i++) {
                    if (i == his.length - 1) {
                        his[i] = lastClickTime;
                    } else {
                        his[i] = his[i + 1];
                    }
                }
            }
            chrome.storage.local.set({ historyClick: his });
        }
    });

}

// Load current when restart extension/browser
setTimeout(function () {
    chrome.storage.local.get(["current"], function (items) {
        if (items.current != undefined) {
            current = parseInt(items.current);
            chrome.action.setBadgeText({ text: items.current });
        }
        else {
            current = 0;
            chrome.action.setBadgeText({ text: current.toString() });
        }
    });

    // Update last click
    chrome.storage.local.get(["lastClick"], function (items) {
        chrome.contextMenus.update("4", {
            title: ("Last click: " + items.lastClick)
        });
    });

}, 500)



// Context menu click
chrome.contextMenus.removeAll(function () {
    // 1
    chrome.contextMenus.create({
        id: "1",
        title: "Switch to Auto mode (only available for EWOQ page)",
        contexts: ["all"],
    });

    // 2
    chrome.contextMenus.create({
        id: "2",
        title: "-1",
        contexts: ["all"],
    });

    // 3
    chrome.contextMenus.create({
        id: "3",
        title: "Reset counter",
        contexts: ["all"],
    });

    // 4
    chrome.storage.local.get(["lastClick"], function (items) {
        chrome.contextMenus.create({
            id: "4",
            title: "Last click: " + items.lastClick,
            contexts: ["all"],
        });

    });



    // 5
    chrome.contextMenus.create({
        id: "5",
        title: "Options",
        contexts: ["all"],
    });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    // console.log(activeInfo.tabId);
});

//
chrome.contextMenus.onClicked.addListener(function (id, tab) {
    //
    if (id.menuItemId == 1) {
        chrome.storage.local.get(["mode"], function (items) {
            if (items.mode == "null" || items.mode == "manual") {
                chrome.action.setIcon({ path: "/icon/icon_auto.png" });
                // mode = "auto";
                chrome.storage.local.set({ "mode": "auto" });
                chrome.contextMenus.update("1", {
                    title: "Switch to Manual mode"
                });
            }
            else if (items.mode == "auto") {
                // mode = "manual";
                chrome.storage.local.set({ "mode": "manual" });
                chrome.contextMenus.update("1", {
                    title: "Switch to Auto mode (only available for EWOQ page)"
                });
                chrome.action.setIcon({ path: "./icon/icon_manual.png" });
            }
        });

    }
    if (id.menuItemId == 2) {
        // current--;
        // chrome.storage.local.set({ current: current.toString() });
        // chrome.action.setBadgeText({ text: current.toString() });
        chrome.storage.local.get(["mode"], function (items) {
            console.log(items.mode)
        });
    }
    if (id.menuItemId == 3) {
        current = 0;
        chrome.storage.local.set({ current: current.toString() });
        chrome.action.setBadgeText({ text: current.toString() });
    }
    if (id.menuItemId == 5) {
        chrome.tabs.create({ url: "/options.html" });
    }
});

chrome.action.onClicked.addListener((tab) => {
    current = current + 1;
    chrome.action.setBadgeText({ text: current.toString() });
    chrome.storage.local.set({ current: current.toString() });
    updateLastClick();
});
