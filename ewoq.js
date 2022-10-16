window.onload = () => {

    console.log("Imported extension script")

    // Global variable
    var headerContainer = document.getElementsByClassName("dense-header")[0];
    var audioElement = document.createElement('audio');
    var taskTimeCounter = 1;
    var isNotiSoundPlaying = false;
    var isNotiShowing = false;
    var notiCountdown = 0;
    var isInteract = false;
    var autoReloadCounter = 0;
    var isAutoReloadCounting = false;
    var isCanceledAutoReload = false;
    var isAlertNetworkErrBoxShowing = false;
    var isSubmitBtnEnabled = false;
    var isVpnConnected = false;
    var currentIp = null;
    var checkVpnMessage = "First Fetch";

    // Body click event
    document.body.addEventListener("click", () => {
        let tans = document.getElementsByClassName("task-avail-noti-click-sound-box")[0];
        if (tans != null) {
            tans.remove();
        }
        isInteract = true;
    })

    /********** FUCNTION **********/
    // Function convert time
    const convertSecondToMinute = (second) => {
        if (second < 60) {
            return second;
        }
        else {
            if ((second % 60) < 10) {
                return parseInt(second / 60).toString() + ":0" + second % 60;
            }
            else {
                return parseInt(second / 60).toString() + ":" + second % 60;
            }
        }
    }

    /********** MODE **********/

    // ======= Auto count Submit button =======
    // Check if submit button is enabled or not
    setInterval(() => {
        let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
        if (btnSubmit != null) {
            if (!btnSubmit.classList.contains("is-disabled")) {
                isSubmitBtnEnabled = true;
            }
            else {
                isSubmitBtnEnabled = false;
            }
        }
        else {
            isSubmitBtnEnabled = false;
        }
    }, 20)

    // Submit button click event
    const submitButtonClick = () => {
        if (isSubmitBtnEnabled) {
            chrome.runtime.sendMessage({ "autoCount": "true" }, (response) => {

                if (response != "Not auto") {
                    let alertClick = document.createElement("div");
                    let alertClickContent = '<div id="al"><p style="margin: 0; display: inline; color: white;">' + response + '</p></div>';
                    alertClick.innerHTML = alertClickContent;
                    headerContainer.appendChild(alertClick);
                    setTimeout(() => {
                        headerContainer.removeChild(alertClick);
                    }, 1000);

                    console.log(response);
                }
            });

            // Check new task on submit and show time counter if is enabled
            removeTaskTimeCounter();
            setTimeout(() => {
                let submitButton = document.getElementsByClassName("submitTaskButton")[0];
                let continueButton = document.getElementsByClassName("continue-button")[0];
                if (submitButton != null || continueButton != null) {
                    showTaskTimeCounter();
                    // Check and show auto submit
                    checkAndShowAutoSubmit();
                    let time = 1;
                    let checkSubmitButtonInterval = setInterval(() => {
                        let submitButton = document.getElementsByClassName("submitTaskButton")[0];
                        if (time <= 10) {
                            if (submitButton == null && continueButton == null) {
                                removeTaskTimeCounter();
                                clearInterval(checkSubmitButtonInterval);
                            }
                        }
                        else {
                            clearInterval(checkSubmitButtonInterval);
                        }
                        // console.log("check submit: " + time);
                        time++;
                    }, 1000);
                }
            }, 1000)

        }

    }

    // Set click listener for submit button
    const setClickListener = () => {
        let submitButton = document.getElementsByClassName("submitTaskButton")[0];
        if (submitButton != undefined) {
            submitButton.removeEventListener("click", submitButtonClick);
            submitButton.addEventListener("click", submitButtonClick);
        }

    }
    //
    setInterval(setClickListener, 2000);


    // =============== Function show time counter ==============
    const showTaskTimeCounter = () => {
        removeTaskTimeCounter();
        chrome.runtime.sendMessage({ "getCountTaskTimeMode": "true" }, (response) => {
            if (response == true) {
                let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
                let continueButton = document.getElementsByClassName("continue-button")[0];
                if (document.body.contains(btnSubmit) || document.body.contains(continueButton)) {

                    chrome.storage.local.get(["countTimeBoxPos"], (items) => {
                        let pos = items.countTimeBoxPos;
                        let taskTime = document.createElement("div");
                        let taskTimeContent = '<div id="task-time" style="left: ' + pos + 'vw">'
                            + '<p id="txt-task-time" style="margin: 0; display: inline;color: white;">0</p><span style="color: white">s</span> </div>';
                        taskTime.innerHTML = taskTimeContent;
                        headerContainer.appendChild(taskTime)

                        let taskTimeCounterInterval = setInterval(() => {
                            let taskTime = document.getElementById("task-time");
                            if (taskTime != undefined) {
                                // console.log(taskTimeCounter);
                                document.getElementById("txt-task-time").innerText = convertSecondToMinute(taskTimeCounter);
                                taskTimeCounter++;
                            }
                            else {
                                clearInterval(taskTimeCounterInterval);
                            }

                        }, 1000);
                    })




                }
            }
        })

    }

    // Remove Time counter
    const removeTaskTimeCounter = () => {
        let taskTime = document.getElementById("task-time");
        if (taskTime != undefined) {
            taskTime.remove();
        }
        taskTimeCounter = 1;
    }


    // ==== Count time when start new task =======
    // On click START NEXT TASK button
    const startButtonClick = () => {

        let startButton = document.getElementsByClassName("start-button")[0];
        let submitButton = document.getElementsByClassName("submitTaskButton")[0];
        let continueButton = document.getElementsByClassName("continue-button")[0];

        if (submitButton != null || continueButton != null) {
            showTaskTimeCounter();
            // Check and show auto submit
            checkAndShowAutoSubmit();
        }
        else {
            let time = 1;
            let checkSubmitContinueButtonIntv = setInterval(() => {
                let startButton = document.getElementsByClassName("start-button")[0];
                let submitButton = document.getElementsByClassName("submitTaskButton")[0];
                let continueButton = document.getElementsByClassName("continue-button")[0];
                if (time <= 10) {
                    if (submitButton != null || continueButton != null) {
                        showTaskTimeCounter();
                        // Check and show auto submit
                        checkAndShowAutoSubmit();
                        clearInterval(checkSubmitContinueButtonIntv);
                    }
                }
                else {
                    clearInterval(checkSubmitContinueButtonIntv);
                }
                console.log(time);
                time++;
            }, 1000);
        }



    }

    // Set click event listener for START NEXT TASK button
    setInterval(() => {
        let startButton = document.getElementsByClassName("start-button")[0];
        if (startButton != undefined) {
            startButton.removeEventListener("click", startButtonClick);
            startButton.addEventListener("click", startButtonClick);
        }
    }, 2000)

    // On click Continue button
    const continueButtonClick = () => {

        removeTaskTimeCounter();

        setTimeout(() => {
            let btnContinue = document.getElementsByClassName("continue-button")[0];
            let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];

            if (btnSubmit != null) {
                showTaskTimeCounter();
                // Check and show auto submit
                checkAndShowAutoSubmit();
            }
            else {
                let time = 1;
                let checkSubmitButtonInterval = setInterval(() => {
                    let btnContinue = document.getElementsByClassName("continue-button")[0];
                    let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
                    if (time <= 15) {
                        if (btnSubmit != null) {
                            showTaskTimeCounter();
                            // Check and show auto submit
                            checkAndShowAutoSubmit();
                            clearInterval(checkSubmitButtonInterval);
                        }
                    }
                    else {
                        clearInterval(checkSubmitButtonInterval);
                    }
                    // console.log(time);
                    time++;
                }, 1000);
            }
        }, 1000)

    }

    // Set click event listener for Continue button
    setInterval(() => {
        let continueButton = document.getElementsByClassName("continue-button")[0];
        if (continueButton != undefined) {
            continueButton.removeEventListener("click", continueButtonClick);
            continueButton.addEventListener("click", continueButtonClick);
        }
    }, 2000)

    // On Skip task button
    const skipTaskButtonClick = () => {

        removeTaskTimeCounter();
        setTimeout(() => {
            let skipTaskButton = document.getElementsByClassName("cancel-button")[0];
            let submitButton = document.getElementsByClassName("submitTaskButton")[0];
            let continueButton = document.getElementsByClassName("continue-button")[0];

            if (submitButton != null || continueButton != null) {
                showTaskTimeCounter();
                // Check and show auto submit
                checkAndShowAutoSubmit();
            }
            else {
                let time = 1;
                let checkSubmitButtonInterval = setInterval(() => {
                    let skipTaskButton = document.getElementsByClassName("cancel-button")[0];
                    let submitButton = document.getElementsByClassName("submitTaskButton")[0];
                    if (time <= 5) {
                        if (submitButton != null || continueButton != null) {
                            showTaskTimeCounter();
                            // Check and show auto submit
                            checkAndShowAutoSubmit();
                            clearInterval(checkSubmitButtonInterval);
                        }
                    }
                    else {
                        clearInterval(checkSubmitButtonInterval);
                    }
                    // console.log(time);
                    time++;
                }, 1000);
            }
        }, 1000)

    }

    // Set click event listener for Skip button
    setInterval(() => {
        let skipTaskButton = document.getElementsByClassName("skip-button")[0];
        if (skipTaskButton != undefined) {
            skipTaskButton.removeEventListener("click", skipTaskButtonClick);
            skipTaskButton.addEventListener("click", skipTaskButtonClick);
        }
    }, 2000)


    // ================== AUTO SUBMIT mode ===============
    const checkAndShowAutoSubmit = () => {
        let submitButton = document.getElementsByClassName("submitTaskButton")[0];
        let box = document.getElementById("auto-submit-box");
        if (box != null) {
            box.remove();
        }
        setTimeout(() => {
            if (submitButton != null) {
                chrome.runtime.sendMessage({ "getAutoSubmitMode": "true" }, (response) => {
                    if (response == true) {
                        chrome.runtime.sendMessage({ "getAutoSubmitAfter": "true" }, (response) => {
                            let timeAutoSubmit = parseInt(response);
                            chrome.runtime.sendMessage({ "getShowAutoSubmitWhileRemaining": "true" }, (response) => {
                                let showWhileRemainning = parseInt(response);
                                let timeShow = timeAutoSubmit - showWhileRemainning + 1;
                                let a = setInterval(() => {
                                    if (taskTimeCounter >= timeShow) {
                                        //
                                        let autoSubmitBox = document.createElement("div");
                                        let autoSubmitBoxContent = '<div id="auto-submit-box"> <p style="margin: 0; display: inline; color: white;">Tự động submit sau '
                                            + '<strong style="color: red;margin-right: 5px;" id="txt-time-count-submit">' + convertSecondToMinute(timeAutoSubmit - taskTimeCounter + 1) + 's</strong></p> '
                                            + '<button id="btn-cancel-auto-submit">Hủy</button> </div>';
                                        let box = document.getElementById("auto-submit-box");
                                        autoSubmitBox.innerHTML = autoSubmitBoxContent;

                                        headerContainer.appendChild(autoSubmitBox);
                                        // autoSubmitBox.style.display = "none";

                                        let btnCancelAutoSubmit = document.getElementById("btn-cancel-auto-submit");
                                        if (btnCancelAutoSubmit != null) {
                                            document.getElementById("btn-cancel-auto-submit").addEventListener("click", () => {
                                                console.log("Canceled asuto submit")
                                                clearInterval(b);
                                                headerContainer.removeChild(autoSubmitBox);
                                            })
                                        }


                                        let b = setInterval(() => {
                                            let autoSubmitCountDown = timeAutoSubmit - taskTimeCounter + 1;
                                            let txtTimeCountAutoSubmit = document.getElementById("txt-time-count-submit");
                                            if (txtTimeCountAutoSubmit != null) {
                                                txtTimeCountAutoSubmit.innerText = convertSecondToMinute(autoSubmitCountDown) + "s";
                                            }
                                            else {
                                                clearInterval(b);
                                            }

                                            if (autoSubmitCountDown == 0) {
                                                if (isSubmitBtnEnabled) {
                                                    // Click
                                                    document.getElementsByClassName("submitTaskButton")[0].click();
                                                    console.log("Had trigged click in auto submit mode")
                                                    //
                                                    chrome.runtime.sendMessage({ "autoSubmitCount": "true" }, (response) => {
                                                        if (response != "Auto submit false") {
                                                            let alertClick = document.createElement("div");
                                                            let alertClickContent = '<div id="al"><p style="margin: 0; display: inline; color: white;">' + response + '</p></div>';
                                                            alertClick.innerHTML = alertClickContent;
                                                            headerContainer.appendChild(alertClick);
                                                            setTimeout(() => {
                                                                headerContainer.removeChild(alertClick);
                                                            }, 1000);

                                                            console.log(response);
                                                        }
                                                    })
                                                    let box = document.getElementById("auto-submit-box");
                                                    if (box != null) {
                                                        box.remove();
                                                    }
                                                    clearInterval(b);
                                                }
                                                else {
                                                    let box = document.getElementById("auto-submit-box");
                                                    if (box != null) {
                                                        box.remove();
                                                    }
                                                    clearInterval(b);
                                                }
                                            }
                                            // console.log(autoSubmitCountDown)
                                        }, 1000)

                                        clearInterval(a);
                                    }


                                }, 1000)

                            });

                        });


                    }

                });
            }
        }, 3000)
    }

    // On load/reload page
    const checkNewTaskOnReload = () => {

        let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
        let continueButton = document.getElementsByClassName("continue-button")[0];
        if (btnSubmit != null || continueButton != null) {
            showTaskTimeCounter();
            // Check and show auto submit
            checkAndShowAutoSubmit();
        }
        else {
            let time = 1;
            let checkSubmitButtonInterval = setInterval(() => {
                let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
                if (time <= 7) {
                    if (btnSubmit != null || continueButton != null) {
                        showTaskTimeCounter();
                        // Check and show auto submit
                        checkAndShowAutoSubmit();
                        clearInterval(checkSubmitButtonInterval);
                    }
                }
                else {
                    clearInterval(checkSubmitButtonInterval);
                }
                console.log(time);
                time++;
            }, 1000);
        }
    }
    checkNewTaskOnReload();


    // ======================= Task available notification ==============
    setInterval(() => {
        let btnStart = document.getElementsByClassName("start-button")[0];
        if (btnStart != null) {
            chrome.runtime.sendMessage({ "taskAvailableNoti": "true" }, (response) => {
                if (response == true) {
                    if (btnStart.classList.contains("enabled") && isNotiShowing == false && notiCountdown == 0) {
                        // Send noti to system
                        chrome.runtime.sendMessage({ "createAvalableTaskNoiti": "true" }, (response) => { })

                        let notiBox = document.createElement("div");
                        notiBox.innerHTML = '<div class="dismiss-task-avail-noti-box">'
                            + '<div>'
                            + '<p style="margin: 5px; display: inline;color: white; font-size: large;font-weight: 900;">Attention</p>'
                            + '<br>'
                            + '<p style="margin: 5px; display: inline;color: white;">Task available</p>'
                            + '<br>'
                            + '<button id="btn-dismiss-task-avail-noti-box">'
                            + '<span class="bfirst"></span>'
                            + '<span class="blast"></span>'
                            + '</button>'
                            + '</div>'
                            + '</div>';

                        headerContainer.appendChild(notiBox);

                        // Button dissmis
                        let btnCancel = document.getElementById("btn-dismiss-task-avail-noti-box");
                        btnCancel.addEventListener("click", () => {
                            headerContainer.removeChild(notiBox);
                            isNotiShowing = false;
                            isNotiSoundPlaying = false;
                            audioElement.pause();
                            notiCountdown = 120; // Stop
                            let a = setInterval(() => {
                                notiCountdown = notiCountdown - 1;
                                if (notiCountdown == 0) {
                                    clearInterval(a);
                                }

                            }, 1000)
                        })

                        //

                        // Play sound
                        chrome.runtime.sendMessage({ "taskAvailableNotiSound": "true" }, (response) => {
                            if (response == true) {
                                if (!isNotiSoundPlaying) {
                                    chrome.runtime.sendMessage({ "getResFile": "taskAvailableNotiSound" }, (response) => {
                                        let soundUrl = response;
                                        audioElement.innerHTML = '<source src="' + soundUrl + '" type="audio/mpeg" />'
                                        audioElement.play().then(() => {
                                            isNotiSoundPlaying = true;
                                        })
                                            .catch(function (error) {
                                                let playErrMsg = "play() failed because the user didn't interact with the document first";
                                                if (error.toString().includes(playErrMsg)) {
                                                    chrome.runtime.sendMessage({ "setIsAllowedEwoqAutoPlaySound": false }, (response) => { })
                                                }
                                                isNotiSoundPlaying = false;
                                            });


                                        chrome.runtime.sendMessage({ "getTaskAvailableLoopNoti": "true" }, (response) => {
                                            let loopMode = response;
                                            if (loopMode) {
                                                audioElement.loop = true;
                                            }
                                            else {
                                                audioElement.loop = false;
                                            }
                                        })
                                        //
                                    })


                                }

                            }
                        })

                        isNotiShowing = true;
                    }
                }
            })


        }
        if (btnStart == undefined || !btnStart.classList.contains("enabled")) {
            let notiBox = document.getElementsByClassName("dismiss-task-avail-noti-box")[0];
            if (notiBox != null) {
                notiBox.remove();
                audioElement.pause();
                isNotiShowing = false;
                isNotiSoundPlaying = false;
            }
        }
    }, 2000)


    // ======================== Auto reload mode ====================
    const autoReload = () => {
        let btnStart = document.getElementsByClassName("start-button")[0];
        if (btnStart != null && isAutoReloadCounting == false && isCanceledAutoReload == false && !btnStart.classList.contains("enabled")) {
            chrome.runtime.sendMessage({ "taskAvailableNoti": "true" }, (response) => {
                if (response == true) {
                    chrome.runtime.sendMessage({ "checkAutoReload": true }, (response) => {
                        if (response[0] == true) {
                            autoReloadCounter = response[1];
                            let autoReloadBox = document.createElement("div");
                            let autoReloadBoxContent = '<div id="auto-reload-box"> <div> <p style="display: inline; color: white;">Tự động reload sau '
                                + '<strong style="color: red;margin-right: 5px;" id="txt-time-count-reload">' + convertSecondToMinute(autoReloadCounter) + 's</strong></p></div>'
                                + '<div><p style="margin: 0; color: white; font-size: 12px;">(Tự động reload cũng sẽ bị hủy khi có task <br> Refresh lại trang để kích hoạt lại)</p></div>'
                                + '<div><button id="btn-cancel-auto-reload" style="margin-top: 5px; cursor: pointer;">Hủy</button></div>'
                                + '</div>';
                            autoReloadBox.innerHTML = autoReloadBoxContent;
                            headerContainer.appendChild(autoReloadBox);

                            let btnCancelAutoReload = document.getElementById("btn-cancel-auto-reload");
                            if (btnCancelAutoReload != null) {
                                btnCancelAutoReload.addEventListener("click", () => {
                                    console.log("Canceled auto reload")
                                    clearInterval(a);
                                    headerContainer.removeChild(autoReloadBox);
                                    isCanceledAutoReload = true;
                                })
                            }

                            let a = setInterval(() => {
                                autoReloadCounter--;
                                let txt = document.getElementById("txt-time-count-reload");
                                if (txt != null) {
                                    txt.innerText = convertSecondToMinute(autoReloadCounter) + "s";
                                }
                                else {
                                    clearInterval(a);
                                }

                                if (autoReloadCounter == 0) {
                                    window.location.reload();
                                    clearInterval(a);
                                }

                                let btnStart = document.getElementsByClassName("start-button")[0];
                                if (btnStart != null) {
                                    if (btnStart.classList.contains("enabled")) {
                                        clearInterval(a);
                                        headerContainer.removeChild(autoReloadBox);
                                        isAutoReloadCounting = false;
                                    }

                                }

                            }, 1000)

                            //
                            isAutoReloadCounting = true;
                        }
                    })
                }
            })
        }
    }
    //
    autoReload();
    setInterval(autoReload, 1000)

    // Check is allowd Ewoq auto play sound without interact or not
    const checkIsAllowedEwoqAutoPlay = () => {
        chrome.runtime.sendMessage({ "getResFile": "taskAvailableNotiSound" }, (response) => {
            let testAudioElement = document.createElement("audio");
            let testSoundUrl = response;
            testAudioElement.innerHTML = '<source muted src="' + testSoundUrl + '" type="audio/mpeg" />'

            testAudioElement.volume = 0.00001;
            testAudioElement.play().then(() => {
                chrome.runtime.sendMessage({ "setIsAllowedEwoqAutoPlaySound": true }, (response) => { })
                setTimeout(() => {
                    testAudioElement.pause();
                }, 500)
            })
                .catch((error) => {
                    let playErrMsg = "play() failed because the user didn't interact with the document first";
                    if (error.toString().includes(playErrMsg)) {
                        chrome.runtime.sendMessage({ "setIsAllowedEwoqAutoPlaySound": false }, (response) => { });
                        let headerContainer = document.getElementsByClassName("dense-header")[0];
                        let bx = document.createElement("div");
                        bx.innerHTML = '<div class="task-avail-noti-click-sound-box">'
                            + '<p><strong style="color: red;">Chú ý: </strong>Cảnh báo âm thanh đang bật ! <br></p>'
                            + '<p>Trang web sẽ không tự động phát âm thanh nếu bạn không tương tác ít nhất 1 lần trên website.</p>'
                            + '<p> <span style="color: orange;"> >> </span> Nhấn 1 lần vào bất cứ nơi nào trên trang để có thể phát âm thanh</p>'
                            + '<p> <span style="color: orange;"> >> </span> Hoặc làm theo '
                            + '<a target="_blank" id="linkAlowAutoPlayInstruction" href="#" style="color: orange">Hướng dẫn này </a>'
                            + 'để luôn cho phép trang web tự động phát âm thanh mà không cần tương tác trước.</p>'
                            + '</div>';


                        //
                        chrome.runtime.sendMessage({ "getExtensionUrl": "true" }, (response) => {
                            let a = document.getElementById("linkAlowAutoPlayInstruction");
                            a.href = response + "USERGUIDE.html#allowEwoqAutoPlaySoundInstructions";
                        })

                        //
                        chrome.runtime.sendMessage({ "checkAutoReload": true }, (response) => {
                            if (response[0] == true) {
                                let box = document.getElementsByClassName("task-avail-noti-click-sound-box")[0];
                                box.style.top = "110px";
                            }
                        })

                        headerContainer.appendChild(bx);
                    }
                });
        })

    }
    // Check
    chrome.runtime.sendMessage({ "taskAvailableNoti": "true" }, (response) => {
        if (response == true) {
            chrome.runtime.sendMessage({ "taskAvailableNotiSound": "true" }, (response) => {
                if (response == true) {
                    checkIsAllowedEwoqAutoPlay()
                }
            })

        }
    })

    // ============ Check VPN / Network when waiting task =========
    const checkVPNWhenWaitingTask = () => {
        setInterval(() => {
            chrome.runtime.sendMessage({ "checkAutoCloseTabWhenNetErr": true }, (response) => {
                let autoCloseTabWhenNetErrMode = response[0];
                let autoCloseTabAfterNetErr = response[1];
                if (autoCloseTabWhenNetErrMode == true) {
                    let startButton = document.getElementsByClassName("start-button")[0];
                    if (startButton != null) {
                        chrome.runtime.sendMessage({ "checkVPN": [currentIp, checkVpnMessage] }, (response) => {
                            if (typeof (response) == "object") {
                                let newIp = response[0];
                                let data = response[1];

                                let tags = [];
                                let error = "";
                                let domains = [];
                                let hostnames = [];

                                if (data.error != undefined) {
                                    error = data.error;
                                }
                                // Tags
                                if (data.tags != undefined) {
                                    tags = data.tags;
                                }
                                // Domains
                                if (data.domains != undefined) {
                                    domains = data.domains
                                }
                                // Hostnames
                                if (data.hostnames != undefined) {
                                    hostnames = data.hostnames;
                                }

                                // Check
                                if (error == "No information available for that IP.") {
                                    if (!isAlertNetworkErrBoxShowing) {
                                        let bx = document.createElement("div");
                                        bx.innerHTML = '<div class="warning-network-error-box">'
                                            + '<p><strong style="color: red;">Cảnh báo: đã mất kết nối VPN! </strong><br></p>'
                                            + '<p>Tự động đóng tab trong: <strong id="txt-time-close-tab-net-err" style="color: red">' + autoCloseTabAfterNetErr + 's</strong> </p>'
                                            + '<button id="btn-cancel-auto-close-tab-on-net-err" style="cursor: pointer;">Hủy</button> </div>';
                                        headerContainer.appendChild(bx);

                                        let timeCount = autoCloseTabAfterNetErr;
                                        let autoCloseInterval = setInterval(() => {
                                            timeCount--;
                                            let txtTime = document.getElementById("txt-time-close-tab-net-err");
                                            if (txtTime != null) {
                                                txtTime.innerText = timeCount + "s";
                                            }
                                            else {
                                                clearInterval(autoCloseInterval);
                                            }

                                            //
                                            if (timeCount == 0) {
                                                chrome.runtime.sendMessage({ "closeEwoqTab": true })
                                                clearInterval(autoCloseInterval);
                                            }
                                        }, 1000)

                                        document.getElementById("btn-cancel-auto-close-tab-on-net-err").addEventListener("click", () => {
                                            let box = document.getElementsByClassName("warning-network-error-box")[0];
                                            if (box != null) {
                                                box.remove();
                                                isAlertNetworkErrBoxShowing = false;
                                            }
                                        })
                                        isAlertNetworkErrBoxShowing = true;
                                    }

                                    console.log("VPN Disconnected");
                                    isVpnConnected = false;
                                    checkVpnMessage = "No VPN connect";
                                    currentIp = newIp;

                                } else {
                                    console.log("VPN Connected");
                                    isVpnConnected = true;
                                    checkVpnMessage = "VPN connecting";
                                    currentIp = newIp;
                                    let box = document.getElementsByClassName("warning-network-error-box")[0];
                                    if (box != null) {
                                        box.remove();
                                        isAlertNetworkErrBoxShowing = false;
                                    }
                                }



                            }
                            else if (typeof (response) == "string") {
                                if (response == "TypeError: Failed to fetch") {
                                    console.log("Network Error");
                                    currentIp = null;
                                    checkVpnMessage = "Network Error"
                                }
                                else if (response == "Don't need check") {
                                    console.log("VPN Connected don't need check");
                                    let box = document.getElementsByClassName("warning-network-error-box")[0];
                                    if (box != null) {
                                        box.remove();
                                        isAlertNetworkErrBoxShowing = false;
                                    }
                                }
                            }

                        })
                    }

                }
                else {
                    let box = document.getElementsByClassName("warning-network-error-box")[0];
                    if (box != null) {
                        box.remove();
                        isAlertNetworkErrBoxShowing = false;
                    }
                }

            })
        }, 60000)
    }

    chrome.runtime.sendMessage({ "taskAvailableNoti": "true" }, (response) => {
        if (response == true) {
            checkVPNWhenWaitingTask();
        }
    })


    // ======== Take a break button ========
    const takeABreakClickEvent = () => {
        removeTaskTimeCounter();
        let box = document.getElementById("auto-submit-box");
        if (box != null) {
            box.remove();
        }
    }
    setInterval(() => {
        let btn = document.getElementsByClassName("skip-and-take-a-break-button")[0];
        if (btn != null) {
            btn.removeEventListener("click", takeABreakClickEvent);
            btn.addEventListener("click", takeABreakClickEvent);
        }
    }, 2000)

}


// ================= TEST =====================
// Start next task
// start-button _ngcontent-fiz-23 _nghost-fiz-8 is-disabled
// document.getElementsByClassName("start-button")[0]

// Continue button
// continue-button _ngcontent-ejj-34 _nghost-ejj-8 emphasize
// document.getElementsByClassName("continue-button")[0]

// Skip task button
// cancel-button _ngcontent-enm-26 _nghost-enm-8
// document.getElementsByClassName("cancel-button")[0]

// Take a break buttom
// skip-and-take-a-break-button _ngcontent-eyd-36 _nghost-eyd-8
// document.getElementsByClassName("skip-and-take-a-break-button")[0]

// Submit button
// submitTaskButton
// document.getElementsByClassName("submitTaskButton")[0]



