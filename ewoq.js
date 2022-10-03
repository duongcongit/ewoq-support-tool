


window.onload = function () {

    console.log("Imported extension script")

    var headerContainer = document.getElementsByClassName("dense-header")[0];
    var taskTimeCounter = 1;

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


    // AUTO SUBMIT mode
    const checkAndShowAutoSubmit = () => {
        let submitButton = document.getElementsByClassName("submitTaskButton")[0];
        let box = document.getElementById("autot-submit-box");
        if (box != null) {
            box.remove();
        }
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
                                    let autoSubmitBoxContent = '<div id="autot-submit-box"> <p style="margin: 0; display: inline; color: white;">Tự động submit sau '
                                        + '<strong style="color: red;margin-right: 5px;" id="txt-time-count-submit">' + convertSecondToMinute(timeAutoSubmit - taskTimeCounter + 1) + 's</strong></p> '
                                        + '<button id="btn-cancel-auto-submit">Hủy</button> </div>';
                                    let box = document.getElementById("autot-submit-box");
                                    autoSubmitBox.innerHTML = autoSubmitBoxContent;
                                    if (box != null) {

                                    }
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

                                        if (autoSubmitCountDown == 0) {
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
                                            let box = document.getElementById("autot-submit-box");
                                            if (box != null) {
                                                box.remove();
                                            }
                                            clearInterval(b);
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
    }

    // Submit button click event
    const submitButtonClick = () => {
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


    // ======== Count time when start new task ===========
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
    var isNotiSoundPlaying = false;
    var isNotiShowing = false;
    var notiCountdown = 0;
    var isInteract = false;
    var audioElement = document.createElement('audio');
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
                                        if(isInteract){
                                            audioElement.play();
                                            isNotiSoundPlaying = true;
                                        }

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


    document.body.addEventListener("click", () => {
        let tans = document.getElementsByClassName("task-avail-noti-click-sound-box")[0];
        if (tans != null) {
            tans.remove();
        }
        isInteract = true;
    })

    chrome.runtime.sendMessage({ "taskAvailableNoti": "true" }, (response) => {
        if (response == true) {
            chrome.runtime.sendMessage({ "taskAvailableNotiSound": "true" }, (response) => {
                if (response == true) {
                    let bx = document.createElement("div");
                    bx.innerHTML = '<div class="task-avail-noti-click-sound-box">'
                        + '<div>'
                        + '<p style="margin: 5px; display: inline;color: white; font-size: large;font-weight: 900;">Cảnh báo âm thanh đang bật !!!! <br>Nhấn 1 lần vào bất cứ nơi nào <br> trên trang để có thể phát âm thanh</p>'
                        + '</div>'
                        + '</div>';

                    headerContainer.appendChild(bx);
                }
            })

        }
    })

    // Take a break button
    const takeABreakClickEvent = () => {
        removeTaskTimeCounter();
            let box = document.getElementById("autot-submit-box");
            if (box != null) {
                box.remove();
            }
    }
    setInterval(() => {
        let btn = document.getElementsByClassName("skip-and-take-a-break-button")[0];
        if(btn != null){
            btn.removeEventListener("click", takeABreakClickEvent);
            btn.addEventListener("click", takeABreakClickEvent);
        }
    }, 2000)


    // Check VPN/Network
    // let time = 0;
    // setInterval(() => {
    //     chrome.runtime.sendMessage({ "getAlertVPNDisMode": "true" }, (response) => {
    //         if (response == true) {
    //             chrome.runtime.sendMessage({ "checkVPN": "true" },(response) => {
    //                 if(response == "vpn"){
    //                     console.log(time/5 + ": VPN working")
    //                 }
    //                 else{
    //                     console.log(time/5 + ": VPN not working")
    //                 }
    //             })
    //         }

    //     })
    //     time += 5;
    // }, 5000)


}



// document.getElementsByClassName("btn-switch-submit")[0].addEventListener("click",() => {
//     let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];

//     if (btnSubmit.disabled) {
//         btnSubmit.removeAttribute("disabled")
//     }
//     else {
//         btnSubmit.setAttribute('disabled', '');
//     }
// })


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



