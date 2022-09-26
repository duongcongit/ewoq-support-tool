$(document).ready(function () {

    
    // Switch mode
    $(document).on("click", "#autoModeSwitch", function () {
        if ($("#autoModeSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchAutoCountMode": "turn on" }, function (response) {
                console.log(response)
            });
        }
        else {
            chrome.runtime.sendMessage({ "switchAutoCountMode": "turn off" }, function (response) {
                console.log(response)
            });
        }
    })

    // Count time
    $(document).on("click", "#countTimeSwitch", function () {
        if ($("#countTimeSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchCountTimeMode": "turn on" }, function (response) {
                console.log(response)
            });
        }
        else {
            chrome.runtime.sendMessage({ "switchCountTimeMode": "turn off" }, function (response) {
                console.log(response)
            });
        }
    })

    // Auto submit mode
    $(document).on("click", "#autoSubmitSwitch", function () {
        if ($("#autoSubmitSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchAutoSubmitMode": "turn on" }, function (response) {
                console.log(response)
            });
        }
        else {
            chrome.runtime.sendMessage({ "switchAutoSubmitMode": "turn off" }, function (response) {
                console.log(response)
            });
        }
    })

    // Task avail notif mode
    $(document).on("click", "#taskAvailableNotiSwitch", function () {
        if ($("#taskAvailableNotiSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchTaskAvailableNoti": "turn on" }, function (response) {
                console.log(response)
            });
            $(".custom-task-avail-noti").css("display", "block");
        }
        else {
            chrome.runtime.sendMessage({ "switchTaskAvailableNoti": "turn off" }, function (response) {
                console.log(response)
            });
            $(".custom-task-avail-noti").css("display", "none");
        }
    })

    // Check mode
    chrome.storage.local.get([
        "autoCount",
        "countTime",
        "autoSubmit",
        "taskAvailableNoti"
    ], function (items) {
        if (items.autoCount == true) {
            document.getElementById("autoModeSwitch").checked = true;
        }
        //
        if (items.countTime == true) {
            document.getElementById("countTimeSwitch").checked = true;
        }
        //
        if (items.autoSubmit == true) {
            document.getElementById("autoSubmitSwitch").checked = true;
        }
        //
        if (items.taskAvailableNoti == true) {
            document.getElementById("taskAvailableNotiSwitch").checked = true;   
            $(".custom-task-avail-noti").css("display", "block");
        }
        else{
            $(".custom-task-avail-noti").css("display", "none");
        }
    })

    // Set new total click
    $(document).on("click", "#btnSetTotalClick", function () {
        var newTotalClick = parseInt($("#inputSetTotalClick").val());
        if (newTotalClick >= 0) {
            chrome.runtime.sendMessage({ "setTotalClick": newTotalClick.toString() }, function (response) {
                console.log(response)
            });
        }
    })

    // Reset counter
    $(document).on("click", "#btnResetCounter", function () {
        chrome.runtime.sendMessage({ "resetCounter": "true" }, function (response) {
            console.log(response)
        });
    })

    // Get history click
    // chrome.storage.local.get(["historyClick"], function (items) {
    //     if (items.historyClick != undefined) {
    //         console.log("co")
    //         let table = document.getElementById("tableBodyHistory");
    //         let tableData = "";
    //         let historyClick = items.historyClick;
    //         for (let i = historyClick.length - 1; i >= 0; i--) {
    //             tableData += '<tr> <th>' + (i + 1) + '</th> <td>' + historyClick[i] + '</td> </tr>';
    //         }
    //         table.innerHTML = tableData;
    //     }
    // })


    chrome.storage.local.get([
        "taskAvailableNotiTitle",
        "taskAvailableNotiContent"
    ], function (items) {
        $("#inputTitleNoti").val(items.taskAvailableNotiTitle)
        $("#inputContentNoti").val(items.taskAvailableNotiContent)
    })

    $(document).on("click", "#btn-save-custom-noti", ()=>{
        let title = $("#inputTitleNoti").val();
        let content = $("#inputContentNoti").val();
        chrome.storage.local.set({ 
            "taskAvailableNotiTitle": title,
            "taskAvailableNotiContent": content
        });
    })



})



