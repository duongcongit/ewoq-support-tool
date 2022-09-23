chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({ "mode": "manual" });
    chrome.storage.local.set({ "countTaskTime": "OFF" });
    chrome.storage.local.set({ "autoSubmit": "OFF" });
    chrome.storage.local.set({ "autoSubmitAfter": "30" });
    chrome.storage.local.set({ "showAutoSubmitAlertWhileRemaining": "25" });
})

chrome.runtime.onStartup.addListener(function () {
    chrome.storage.local.set({ "mode": "manual" });
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Auto mode count
    if (Object.getOwnPropertyNames(request) == "autoCount") {
        if (request.autoCount == "true") {
            chrome.storage.local.get(["mode"], function (items) {
                if (items.mode == "auto") {
                    chrome.storage.local.get(["current"], function (items) {
                        let current = 0;
                        if (items.current != undefined) {
                            current = parseInt(items.current);
                        }
                        current++;
                        chrome.action.setBadgeText({ text: current.toString() });
                        chrome.storage.local.set({ current: current.toString() });
                        sendResponse(current);

                    });
                    sendResponse(current);
                }
                else {
                    chrome.storage.local.get(["autoSubmit"], function (items) {
                        if (items.autoSubmit == "ON") {
                            chrome.storage.local.get(["current"], function (items) {
                                let current = 0;
                                if (items.current != undefined) {
                                    current = parseInt(items.current);
                                }
                                current++;
                                chrome.action.setBadgeText({ text: current.toString() });
                                chrome.storage.local.set({ current: current.toString() });
                                sendResponse(current);

                            });
                            sendResponse(current);
                        }
                        else {
                            sendResponse("Not auto");
                        }
                    });
                }
            });

            updateLastClick();
            return true;
        }

    }

    // Get count task time mode
    if (Object.getOwnPropertyNames(request) == "getCountTaskTimeMode") {
        if (request.getCountTaskTimeMode == "true") {

            chrome.storage.local.get(["countTaskTime"], function (items) {
                sendResponse(items.countTaskTime);
            });
        }
        return true;

    }

    // Get auto submit mode
    if (Object.getOwnPropertyNames(request) == "getAutoSubmitMode") {
        if (request.getAutoSubmitMode == "true") {

            chrome.storage.local.get(["autoSubmit"], function (items) {
                sendResponse(items.autoSubmit);
            });
        }
        return true;

    }

    // Get time auto submit after
    if (Object.getOwnPropertyNames(request) == "getAutoSubmitAfter") {
        if (request.getAutoSubmitAfter == "true") {

            chrome.storage.local.get(["autoSubmitAfter"], function (items) {
                sendResponse(items.autoSubmitAfter);
            });
        }
        return true;

    }

    // Get show auto submit alert while remaining
    if (Object.getOwnPropertyNames(request) == "showAutoSubmitAlertWhileRemaining") {
        if (request.showAutoSubmitAlertWhileRemaining == "true") {

            chrome.storage.local.get(["showAutoSubmitAlertWhileRemaining"], function (items) {
                sendResponse(items.showAutoSubmitAlertWhileRemaining);
            });
        }
        return true;

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
        let current = parseInt(request.setTotalClick);
        chrome.storage.local.set({ current: current.toString() });
        chrome.action.setBadgeText({ text: current.toString() });
        sendResponse("Set new total click to " + current + " successfully");
    }

});

//


// Get current time
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

// Function update last click time
function updateLastClick() {
    let lastClickTime = getCurrentTime();
    chrome.storage.local.set({ lastClick: lastClickTime });
    chrome.contextMenus.update("6", {
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
            if (his.length < 201) {
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

//
function updateMode() {
    chrome.storage.local.get(["mode"], function (items) {
        if (items.mode == "auto") {
            chrome.action.setIcon({ path: "/icon/icon_auto.png" });
            chrome.contextMenus.update("1", {
                title: "Switch to Manual mode"
            });
        }
        else {
            chrome.contextMenus.update("1", {
                title: "Switch to Auto mode (only available for EWOQ page)"
            });
            chrome.action.setIcon({ path: "./icon/icon_manual.png" });
        }
    });
}

setInterval(updateMode, 2000);

// Load current when restart extension/browser
setTimeout(function () {
    chrome.storage.local.get(["current"], function (items) {
        if (items.current != undefined) {
            chrome.action.setBadgeText({ text: items.current });
        }
        else {
            chrome.action.setBadgeText({ text: "0" });
        }
    });

    // Update last click
    chrome.storage.local.get(["lastClick"], function (items) {
        chrome.contextMenus.update("6", {
            title: ("Last click: " + items.lastClick)
        });
    });

}, 500)

// Context menu create
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
    chrome.contextMenus.create({
        id: "4",
        title: "Count task time: OFF",
        contexts: ["all"],
    });

    // 5
    chrome.contextMenus.create({
        id: "5",
        title: "Auto submit: OFF",
        contexts: ["all"],
    });

    // 6
    chrome.contextMenus.create({
        id: "6",
        title: "Last click: ",
        contexts: ["all"],
    });

    //
    chrome.storage.local.get(["lastClick"], function (items) {
        chrome.contextMenus.update("6", {
            title: ("Last click: " + items.lastClick)
        });
    });

    // 7
    chrome.contextMenus.create({
        id: "7",
        title: "User guide",
        contexts: ["all"],
    });

    // 8
    chrome.contextMenus.create({
        id: "8",
        title: "Develop by: duongcongit",
        contexts: ["all"],
    });

});

// Context menu click event
chrome.contextMenus.onClicked.addListener(function (id, tab) {
    //
    if (id.menuItemId == 1) {

        chrome.storage.local.get(["mode"], function (items) {
            if (items.mode == "auto") {
                chrome.storage.local.set({ "mode": "manual" });
                chrome.contextMenus.update("1", {
                    title: "Switch to Auto mode (only available for EWOQ page)"
                });
                chrome.action.setIcon({ path: "./icon/icon_manual.png" });
            }
            else if (items.mode == "manual" || items.mode == undefined) {
                chrome.action.setIcon({ path: "/icon/icon_auto.png" });
                chrome.storage.local.set({ "mode": "auto" });
                chrome.contextMenus.update("1", {
                    title: "Switch to Manual mode"
                });
            }
        });

    }
    if (id.menuItemId == 2) {
        chrome.storage.local.get(["current"], function (items) {
            let current = parseInt(items.current);
            if (current > 0) {
                current = current - 1;
                chrome.storage.local.set({ current: current.toString() });
                chrome.action.setBadgeText({ text: current.toString() });
            }

        });

    }
    if (id.menuItemId == 3) {
        current = 0;
        chrome.storage.local.set({ current: "0" });
        chrome.action.setBadgeText({ text: "0" });
    }
    if (id.menuItemId == 4) {
        chrome.storage.local.get(["countTaskTime"], function (items) {
            if (items.countTaskTime == "OFF") {
                chrome.storage.local.set({ "countTaskTime": "ON" });
                chrome.contextMenus.update("4", {
                    title: ("Count task time: ON")
                });
            }
            else {
                chrome.storage.local.set({ "countTaskTime": "OFF" });
                chrome.contextMenus.update("4", {
                    title: ("Count task time: OFF")
                });
            }
        });

    }
    if (id.menuItemId == 5) {
        chrome.storage.local.get(["autoSubmit"], function (items) {
            if (items.autoSubmit == "OFF") {
                chrome.storage.local.set({ "autoSubmit": "ON" });
                chrome.contextMenus.update("5", {
                    title: ("Auto submit: ON")
                });
            }
            else {
                chrome.storage.local.set({ "autoSubmit": "OFF" });
                chrome.contextMenus.update("5", {
                    title: ("Auto submit: OFF")
                });
            }
        });

    }
    if (id.menuItemId == 7) {
        chrome.tabs.create({ url: "USERGUIDE.html" });
    }
});

// On change tabs
chrome.tabs.onActivated.addListener(function (activeInfo) {
    // console.log(activeInfo.tabId);
});

// Increase counter when click to extensions icon
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get(["current"], function (items) {
        let current = 0;
        if (items.current != undefined) {
            current = parseInt(items.current);
        }
        current++;
        chrome.action.setBadgeText({ text: current.toString() });
        chrome.storage.local.set({ current: current.toString() });

    });

    updateLastClick();
});
