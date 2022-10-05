$(document).ready(() => {

    /*************** GEENERAL SETTINGS ***************/
    // Set new total click
    $(document).on("click", "#btnSetTotalClick", () => {
        var newTotalClick = parseInt($("#inputSetTotalClick").val());
        if (newTotalClick >= 0) {
            chrome.runtime.sendMessage({ "setTotalClick": newTotalClick.toString() }, (response) => {
                console.log(response)
            });
        }
    })

    // Reset counter
    $(document).on("click", "#btnResetCounter", () => {
        chrome.runtime.sendMessage({ "resetCounter": "true" }, (response) => {
            console.log(response)
        });
    })

    /*************** EWOQ SETTINGS ***************/
    // ======= Check mode on load =======
    chrome.storage.local.get([
        "autoCount",
        "countTime",
        "countTimeBoxPos",
        "autoSubmit",
        "autoSubmitAfter",
        "showAutoSubmitWhileRemaining",
        "alertVPNDisconnected",
        "taskAvailableNoti",
        "taskAvailableNotiTitle",
        "taskAvailableNotiContent",
        "autoReload",
        "autoReloadEvery",
        "taskAvailableLoopNoti",
        "taskAvailableNotiSound",
        "taskAvailNotiSoundCustom",
        "soundExists",
        "soundCustoms",
        "taskAvailableNotiSoundFileName"
    ], (items) => {
        // === Auto count mode
        if (items.autoCount == true) {
            $("#autoModeSwitch").attr("checked", true);
        }

        // === Count time mode
        if (items.countTime == true) {
            $("#countTimeSwitch").attr("checked", true);
            $("#set-count-time-content").removeClass("d-none");
            $("#autoSubmitConainer").css("opacity", "1");
            $("#autoSubmitSwitch").prop("disabled", false);
        }
        // Box pos
        let pos = items.countTimeBoxPos;
        $('input[name="grRadioCountTimePos"][value="' + pos + '"]').attr("checked", true);
        let countTimeImgCont = document.getElementById("countTimeImgCont");
        countTimeImgCont.innerHTML = '<img src="/assets/imgs/options/count-time/' + pos + '%.png" alt="">';

        // === Auto submit mode
        if (items.autoSubmit == true) {
            $("#autoSubmitSwitch").attr("checked", true);
            if (items.countTime == true) {
                $("#autoSubmitOptions").removeClass("d-none");
            }
        }
        // Auto submit after
        let time = items.autoSubmitAfter;
        $('#autoSubmitAfterSelect option[value="' + time + '"]').attr("selected", true);
        // Show auto submit box while remainning
        let showAutoSubmitBoxWhileRemainning = items.showAutoSubmitWhileRemaining;
        $("#inputShowAutoSubmitWhileRemain").val(showAutoSubmitBoxWhileRemainning);
        $("#inputShowAutoSubmitWhileRemain").prop("max", time - 10);

        // === Alert VPN disconnected
        if (items.alertVPNDisconnected == true) {
            $("#alertVPNDisSwitch").attr("checked", true);
        }


        // ============= TASK AVAILABLE NOTIFICATION =============
        if (items.taskAvailableNoti == true) {
            $("#taskAvailableNotiSwitch").attr("checked", true);
            $(".custom-task-avail-noti").css("display", "block");
        }
        else {
            $(".custom-task-avail-noti").css("display", "none");
        }

        // Noti title and content
        $("#inputTitleNoti").val(items.taskAvailableNotiTitle)
        $("#inputContentNoti").val(items.taskAvailableNotiContent)

        // == Auto reload
        if (items.autoReload == true) {
            $("#autoReloadSwitch").attr("checked", true);
            $("#autoReloadSelect").prop("disabled", false);
            if (items.taskAvailableNotiSound == true) {
                $("#txtWarningTurnOnAutoPlayOnReload").removeClass("d-none");
            }
        }
        else {
            $("#autoReloadSwitch").attr("checked", false);
            $("#autoReloadSelect").prop("disabled", true);
            $("#txtWarningTurnOnAutoPlayOnReload").addClass("d-none");
        }
        // Set auto reload select
        let autoReloadSelect = document.getElementById("autoReloadSelect");
        let inHtml = "";
        for (let i = 1; i <= 15; i++) {
            if (items.autoReloadEvery == i * 60) {
                inHtml += '<option value="' + i * 60 + '" selected>' + i + ' phút</option>';
            }
            else {
                inHtml += '<option value="' + i * 60 + '">' + i + ' phút</option>';
            }

        }
        autoReloadSelect.innerHTML = inHtml;


        // == Task available noti sound
        if (items.taskAvailableNotiSound == true) {
            $("#taskAvailableNotiSoundSwitch").attr("checked", true);
            $("#taskAvailableNotiSoundOptions").removeClass("d-none");
        }
        else {

            $("#taskAvailableNotiSoundOptions").addClass("d-none");
        }
        // Task available noti sound loop
        if (items.taskAvailableLoopNoti == true) {
            $("#radioLoopSound").attr("checked", true);
        }
        else {
            $("#radioBtnOneTimeSound").attr("checked", true);
        }
        // Sound custom mode
        if (items.taskAvailNotiSoundCustom == true) {
            $("#radioSoundCustom").attr("checked", true);
            $("#addCustomSoundContent").removeClass("d-none");
            getSoundList("customs");
        }
        else {
            $("#radioSoundExist").attr("checked", true);
            $("#addCustomSoundContent").addClass("d-none");
            getSoundList("exists");
        }




    })

    // ======= Mode =======
    // 1. Switch mode
    $(document).on("click", "#autoModeSwitch", () => {
        if ($("#autoModeSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchAutoCountMode": "turn on" }, (response) => {
                console.log(response)
            });
        }
        else {
            chrome.runtime.sendMessage({ "switchAutoCountMode": "turn off" }, (response) => {
                console.log(response)
            });
        }
    })


    // 2. Count time
    $(document).on("click", "#countTimeSwitch", () => {
        if ($("#countTimeSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchCountTimeMode": "turn on" }, (response) => {
                console.log(response)
            });
            $("#set-count-time-content").removeClass("d-none");
            $("#autoSubmitConainer").css("opacity", "1");
            $("#autoSubmitSwitch").prop("disabled", false);
            chrome.storage.local.get(["autoSubmit"], (items) => {
                if (items.autoSubmit == true) {
                    $("#autoSubmitOptions").removeClass("d-none");
                }
                else {
                    $("#autoSubmitOptions").addClass("d-none");
                }
            })

        }
        else {
            chrome.runtime.sendMessage({ "switchCountTimeMode": "turn off" }, (response) => {
                console.log(response)
            });
            $("#set-count-time-content").addClass("d-none");
            $("#autoSubmitConainer").css("opacity", "0.5");
            $("#autoSubmitSwitch").prop("disabled", true);
            $("#autoSubmitOptions").addClass("d-none");
        }
    })
    // 2.1. Box pos
    $('input[name="grRadioCountTimePos"]').on("click", () => {
        let pos = parseInt(this.value);
        chrome.storage.local.set({ "countTimeBoxPos": pos });
        let countTimeImgCont = document.getElementById("countTimeImgCont");
        countTimeImgCont.innerHTML = '<img src="/assets/imgs/options/count-time/' + pos + '%.png" alt="">';
    });


    // 3. Auto submit mode
    $(document).on("click", "#autoSubmitSwitch", () => {
        if ($("#autoSubmitSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchAutoSubmitMode": "turn on" }, (response) => {
                console.log(response)
            });
            $("#autoSubmitOptions").removeClass("d-none");
        }
        else {
            chrome.runtime.sendMessage({ "switchAutoSubmitMode": "turn off" }, (response) => {
                console.log(response)
            });
            $("#autoSubmitOptions").addClass("d-none");
        }
    })
    // 3.1. Time auto submit
    $(document).on("change", "#autoSubmitAfterSelect", () => {
        let time = parseInt($("#autoSubmitAfterSelect option:selected").val());
        chrome.storage.local.set({ "autoSubmitAfter": time });
        chrome.storage.local.get(["showAutoSubmitWhileRemaining"], (items) => {
            let remaining = items.showAutoSubmitWhileRemaining;
            if ((time - 10) < remaining) {
                chrome.storage.local.set({ "showAutoSubmitWhileRemaining": (time - 10) });
                $("#inputShowAutoSubmitWhileRemain").val((time - 10).toString());
                $("#inputShowAutoSubmitWhileRemain").prop("max", time - 10);
            }
        })
        console.log("Changed auto submit after: " + time)
    })
    // 3.2. Show box
    $("#inputShowAutoSubmitWhileRemain").on("change", () => {
        let time = parseInt($("#inputShowAutoSubmitWhileRemain").val());
        chrome.storage.local.get(["autoSubmitAfter"], (items) => {
            if (time > (items.autoSubmitAfter - 10)) {
                time = items.autoSubmitAfter - 10;
                $("#inputShowAutoSubmitWhileRemain").val(time)
            }
            chrome.storage.local.set({ "showAutoSubmitWhileRemaining": time });
        })

    })


    // 4. Alert VPN disconnect
    $(document).on("click", "#alertVPNDisSwitch", () => {
        if ($("#alertVPNDisSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchAlertVPNDisMode": "turn on" }, (response) => {
                console.log(response)
            });
        }
        else {
            chrome.runtime.sendMessage({ "switchAlertVPNDisMode": "turn off" }, (response) => {
                console.log(response)
            });
        }
    })


    // 5. Task avail notif mode
    $(document).on("click", "#taskAvailableNotiSwitch", () => {
        if ($("#taskAvailableNotiSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchTaskAvailableNoti": "turn on" }, (response) => {
                console.log(response)
            });
            $(".custom-task-avail-noti").css("display", "block");
        }
        else {
            chrome.runtime.sendMessage({ "switchTaskAvailableNoti": "turn off" }, (response) => {
                console.log(response)
            });
            $(".custom-task-avail-noti").css("display", "none");
        }
    })

    // 5.1 Auto reload switch
    $(document).on("click", "#autoReloadSwitch", () => {
        if ($("#autoReloadSwitch").is(":checked")) {
            chrome.storage.local.set({ "autoReload": true });
            $("#autoReloadSelect").prop("disabled", false);
            chrome.storage.local.get(["taskAvailableNotiSound"], (items) => {
                if (items.taskAvailableNotiSound == true) {
                    $("#txtWarningTurnOnAutoPlayOnReload").removeClass("d-none");
                }
            })

            console.log("Turn on reload")
        }
        else {
            chrome.storage.local.set({ "autoReload": false });
            $("#autoReloadSelect").prop("disabled", true);
            $("#txtWarningTurnOnAutoPlayOnReload").addClass("d-none");
            console.log("Turn off auto reload")
        }

        // Reload EWOQ page when switch auto reload mode
        (async () => {
            let url = "https://rating.ewoq.google.com/";
            var tabs = await chrome.tabs.query({});
            tabs.forEach((tab) => {
                if (tab.url.includes(url)) {
                    console.log(tab.id);
                    chrome.tabs.reload(tab.id, () => { });
                }
            });
        })();

    })

    // 5.1.1 Get and set select time reload to local
    $(document).on("change", "#autoReloadSelect", () => {
        let autoReloadEvery = parseInt($("#autoReloadSelect option:selected").val());
        chrome.storage.local.set({ "autoReloadEvery": autoReloadEvery });
    })

    // 5.2. Save change custom noti
    $(document).on("click", "#btn-save-custom-noti", () => {
        let title = $("#inputTitleNoti").val();
        let content = $("#inputContentNoti").val();
        chrome.storage.local.set({
            "taskAvailableNotiTitle": title,
            "taskAvailableNotiContent": content
        });
    })

    // 5.3. Task avail notif sound
    $(document).on("click", "#taskAvailableNotiSoundSwitch", () => {
        if ($("#taskAvailableNotiSoundSwitch").is(":checked")) {
            chrome.storage.local.set({ "taskAvailableNotiSound": true });
            $("#taskAvailableNotiSoundOptions").removeClass("d-none");
            chrome.storage.local.get(["autoReload"], (items) => {
                if (items.autoReload == true) {
                    $("#txtWarningTurnOnAutoPlayOnReload").removeClass("d-none");
                }
            })
            console.log("Turn on sound")
        }
        else {
            chrome.storage.local.set({ "taskAvailableNotiSound": false });
            $("#taskAvailableNotiSoundOptions").addClass("d-none");
            $("#txtWarningTurnOnAutoPlayOnReload").addClass("d-none");
            console.log("Turn off sound")
        }

    })

    // 5.3.1. Loop mode
    $(document).on("click", "#radioBtnOneTimeSound", () => {
        chrome.storage.local.set({ "taskAvailableLoopNoti": false });
        console.log("Turn off loop noti")
    })
    $(document).on("click", "#radioLoopSound", () => {
        chrome.storage.local.set({ "taskAvailableLoopNoti": true });
        console.log("Turn on loop noti")
    })

    // 5.3.2. Sound
    $(document).on("click", "#radioSoundExist", () => {
        chrome.storage.local.set({ "taskAvailNotiSoundCustom": false });
        chrome.storage.local.get([
            "soundExists",
            "soundCustoms"
        ], (items) => {
            chrome.storage.local.set({ "taskAvailableNotiSoundFileName": items.soundExists[0][1] });
            getSoundList("exists");
        })
        $("#addCustomSoundContent").addClass("d-none");
        console.log("Use exists sound")
        //
        $("#btnDemoSound").addClass("bi-volume-mute-fill")
        $("#btnDemoSound").removeClass("bi-volume-up-fill")
        demoSound.pause();
        demoSound.currentTime = 0;
        demoSoundPlaying = false;
    })
    $(document).on("click", "#radioSoundCustom", () => {
        chrome.storage.local.set({ "taskAvailNotiSoundCustom": true });
        chrome.storage.local.get([
            "soundExists",
            "soundCustoms"
        ], (items) => {
            if (items.soundCustoms.length > 0) {
                chrome.storage.local.set({ "taskAvailableNotiSoundFileName": items.soundCustoms[0][1] });
            }
            else {
                chrome.storage.local.set({ "taskAvailableNotiSoundFileName": items.soundExists[0][1] });
                chrome.storage.local.set({ "taskAvailNotiSoundCustom": false });
            }
            getSoundList("customs");
        })
        $("#addCustomSoundContent").removeClass("d-none");
        console.log("Use custom sound")
        //
        $("#btnDemoSound").addClass("bi-volume-mute-fill")
        $("#btnDemoSound").removeClass("bi-volume-up-fill")
        demoSound.pause();
        demoSound.currentTime = 0;
        demoSoundPlaying = false;
    })

    // 5.3.2.1. Select sound
    $(document).on("change", "#taskAvailNotiSoundSelect", () => {
        let soundFileName = $("#taskAvailNotiSoundSelect option:selected").val();
        chrome.storage.local.set({ "taskAvailableNotiSoundFileName": soundFileName });
        let isUseCustomSound = $("#radioSoundCustom").is(":checked");
        if (isUseCustomSound) {
            chrome.storage.local.set({ "taskAvailNotiSoundCustom": true });
        } else {
            chrome.storage.local.set({ "taskAvailNotiSoundCustom": false });
        }
        $("#btnDemoSound").addClass("bi-volume-mute-fill")
        $("#btnDemoSound").removeClass("bi-volume-up-fill")
        demoSound.pause();
        demoSound.currentTime = 0;
        demoSoundPlaying = false;
        console.log("Changed sound name to: " + soundFileName);
    })

    // 5.3.2.2. Play demo sound
    var demoSoundPlaying = false;
    var demoSound = document.createElement("audio");
    $(document).on("click", "#btnDemoSound", () => {
        if (demoSoundPlaying == false) {
            $("#btnDemoSound").removeClass("bi-volume-mute-fill")
            $("#btnDemoSound").addClass("bi-volume-up-fill")
            //
            chrome.runtime.sendMessage({ "getResFile": "taskAvailableNotiSound" }, (response) => {
                demoSound.innerHTML = '<source src="' + response + '" type="audio/mpeg" />'
                demoSound.load()
                demoSound.play();
                demoSound.onended = () => {
                    $("#btnDemoSound").addClass("bi-volume-mute-fill")
                    $("#btnDemoSound").removeClass("bi-volume-up-fill")
                    demoSound.pause();
                    demoSound.currentTime = 0;
                    demoSoundPlaying = false;
                };
            })

            demoSoundPlaying = true;
        }
        else {
            $("#btnDemoSound").addClass("bi-volume-mute-fill")
            $("#btnDemoSound").removeClass("bi-volume-up-fill")
            demoSound.pause();
            demoSound.currentTime = 0;
            demoSoundPlaying = false;
        }
    })

    // 5.3.2.3. Get sound list
    const getSoundList = (type) => {

        chrome.storage.local.get([
            "taskAvailNotiSoundCustom",
            "soundExists",
            "soundCustoms",
            "taskAvailableNotiSoundFileName"
        ], (items) => {
            let soundList = [];
            if (type == "exists") {
                soundList = items.soundExists;
            }
            else {
                soundList = items.soundCustoms;
            }
            let soundSelect = document.getElementById("taskAvailNotiSoundSelect");
            let soundSelectData = "";
            for (let i = 0; i < soundList.length; i++) {
                soundSelectData += '<option value="' + soundList[i][1] + '" ';
                if (items.taskAvailableNotiSoundFileName == soundList[i][1]) {
                    soundSelectData += 'selected';
                }
                soundSelectData += '>' + soundList[i][0] + '</option>';
            }
            soundSelect.innerHTML = soundSelectData;

        })


    }

    // 5.3.2.4. Add custom sound
    $(document).on("click", "#btnAddCustomSound", async () => {
        let fileName = $("#imputCustomSound").val();
        chrome.runtime.sendMessage({ "checkCustomSoundFile": fileName.toString() }, (response) => {
            if (response) {
                let customSoundsList = [];
                chrome.storage.local.get(["soundCustoms"], (items) => {
                    customSoundsList = items.soundCustoms;
                    let isAdded = false;
                    for (let i = 0; i < customSoundsList.length; i++) {
                        if (customSoundsList[i][1] == fileName) {
                            isAdded = true;
                        }
                    }
                    if (isAdded) {
                        $("#addCusSoundErrHelper").text("File này đã được thêm trước đó! Không cần phải thêm lại!")
                        $("#addCusSoundHelperErrContent").removeClass("d-none");
                        $("#addCusSoundHelperSuccContent").addClass("d-none");
                    }
                    else {
                        customSoundsList.push([fileName, fileName]);
                        for (let i = 0; i < customSoundsList.length - 1; i++) {
                            if (customSoundsList[i][1].localeCompare(customSoundsList[i + 1][1]) == 1) {
                                let temp0 = customSoundsList[i][0];
                                let temp1 = customSoundsList[i][1];
                                customSoundsList[i][0] = customSoundsList[i + 1][0];
                                customSoundsList[i][1] = customSoundsList[i + 1][1];
                                customSoundsList[i + 1][0] = temp0;
                                customSoundsList[i + 1][1] = temp1;
                            }
                        }
                        chrome.storage.local.set({ "soundCustoms": customSoundsList });
                        chrome.storage.local.set({ "taskAvailableNotiSoundFileName": fileName });
                        chrome.storage.local.set({ "taskAvailNotiSoundCustom": true });
                        $("#addCusSoundHelperSuccContent").removeClass("d-none");
                        $("#addCusSoundHelperErrContent").addClass("d-none");
                        console.log("Thêm thành công");
                        getSoundList("customs");
                    }
                })
            }
            else {
                $("#addCusSoundErrHelper").text("Không tìm thấy file trong thư mục /customs, hãy chắc chắn bạn đã điền đúng tên file và làm theo hướng dẫn!")
                $("#addCusSoundHelperErrContent").removeClass("d-none");
                $("#addCusSoundHelperSuccContent").addClass("d-none");
            }
        });
    })



    /*************** HISTORIES ***************/
    // Get history click
    chrome.storage.local.get(["clickHistory"], (items) => {
        if (items.clickHistory != undefined) {
            console.log("co")
            let table = document.getElementById("tableBodyHistory");
            let tableData = "";
            let clickHistory = items.clickHistory;
            for (let i = clickHistory.length - 1; i >= 0; i--) {
                tableData += '<tr> <th>' + (i + 1) + '</th> <td>' + clickHistory[i] + '</td> </tr>';
            }
            table.innerHTML = tableData;
        }
    })


})



