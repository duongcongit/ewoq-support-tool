
console.log("Included")

window.onload = function () {
    console.log("OJIsvd");


    var taskTimeCounter = 1;

    var headerContainer = document.getElementsByClassName("dense-header")[0];

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
            if (submitButton != null) {
                showTaskTimeCounter();
                let time = 1;
                let checkSubmitButtonInterval = setInterval(() => {
                    let submitButton = document.getElementsByClassName("submitTaskButton")[0];
                    if (time <= 10) {
                        if (submitButton == null) {
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


    // 
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
    // console.log(document.body.contains(btnSubmit));
    // btnSubmit.remove();
    const showTaskTimeCounter = () => {
        removeTaskTimeCounter();
        chrome.runtime.sendMessage({ "getCountTaskTimeMode": "true" }, (response) => {
            if (response == true) {
                let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
                let continueButton = document.getElementsByClassName("continue-button")[0];
                if (document.body.contains(btnSubmit) || document.body.contains(continueButton)) {

                    let taskTime = document.createElement("div");
                    let taskTimeContent = '<div id="task-time">'
                        + '<p id="txt-task-time" style="margin: 0; display: inline;color: white;">0</p><span style="color: white">s</span> </div>';
                    taskTime.innerHTML = taskTimeContent;
                    headerContainer.appendChild(taskTime)

                    let taskTimeCounterInterval = setInterval(() => {
                        let taskTime = document.getElementById("task-time");
                        if (taskTime != undefined) {
                            console.log(taskTimeCounter);
                            document.getElementById("txt-task-time").innerText = convertSecondToMinute(taskTimeCounter);
                            taskTimeCounter++;
                        }
                        else {
                            clearInterval(taskTimeCounterInterval);
                        }

                    }, 1000);


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
        }
        else {
            let time = 1;
            let checkSubmitContinueButtonIntv = setInterval(() => {
                let startButton = document.getElementsByClassName("start-button")[0];
                let submitButton = document.getElementsByClassName("submitTaskButton")[0];
                let continueButton = document.getElementsByClassName("continue-button")[0];
                if (time <= 15) {
                    if (submitButton != null || continueButton != null) {
                        showTaskTimeCounter();
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

        let btnContinue = document.getElementsByClassName("continue-button")[0];
        let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];

        if (btnSubmit != null) {
            showTaskTimeCounter();
        }
        else {
            let time = 1;
            let checkSubmitButtonInterval = setInterval(() => {
                let btnContinue = document.getElementsByClassName("continue-button")[0];
                let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
                if (time <= 15) {
                    if (btnSubmit != null) {
                        showTaskTimeCounter();
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

            if (submitButton != null && skipTaskButton == null) {
                showTaskTimeCounter();
            }
            else {
                let time = 1;
                let checkSubmitButtonInterval = setInterval(() => {
                    let skipTaskButton = document.getElementsByClassName("cancel-button")[0];
                    let submitButton = document.getElementsByClassName("submitTaskButton")[0];
                    if (time <= 15) {
                        if (submitButton != null && skipTaskButton == null) {
                            showTaskTimeCounter();
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
        let skipTaskButton = document.getElementsByClassName("cancel-button")[0];
        if (skipTaskButton != undefined) {
            skipTaskButton.removeEventListener("click", skipTaskButtonClick);
            skipTaskButton.addEventListener("click", skipTaskButtonClick);
        }
    }, 2000)


    // On load/reload page
    const checkNewTaskOnReload = () => {
        let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
        if (btnSubmit != null) {
            showTaskTimeCounter();
        }
        else {
            let time = 1;
            let checkSubmitButtonInterval = setInterval(() => {
                let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
                if (time <= 7) {
                    if (btnSubmit != null) {
                        showTaskTimeCounter();
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
    setInterval(() => {
        let btnstart = document.getElementsByClassName("start-button")[0];
        if (btnstart != null) {
            if (!btnstart.disabled && isNotiShowing == false && notiCountdown == 0) {
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

                let btnCancel = document.getElementById("btn-dismiss-task-avail-noti-box");
                btnCancel.addEventListener("click", () => {
                    headerContainer.removeChild(notiBox);
                    isNotiShowing = false;
                    isNotiSoundPlaying = false;
                    audioElement.pause();
                    notiCountdown = 120; // Stop
                    setInterval(() => {
                        notiCountdown--;
                    }, 1000)
                })

                //

                chrome.runtime.sendMessage({ "taskAvailableNotiSound": "true" }, (response) => {
                    if (response == true) {
                        if (!isNotiSoundPlaying) {
                            chrome.runtime.sendMessage({ "getResFile": "taskAvailableNotiSound" }, (response) => {
                                let soundUrl = response;
                                audioElement = document.createElement('audio');
                                audioElement.innerHTML = '<source src="' + soundUrl + '" type="audio/mpeg" />'
                                audioElement.play();

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
                            isNotiSoundPlaying = true;

                        }

                    }
                })

                isNotiShowing = true;


            }
        }
        if(btnstart.disabled) {
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
    })

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






    // AUTO SUBMIT mode
    /* chrome.runtime.sendMessage({ "getAutoSubmitMode": "true" }, (response) => {
        if (response == "ON") {
            chrome.runtime.sendMessage({ "getAutoSubmitAfter": "true" }, (response) => {
                let timeCount = parseInt(response);

                let autoSubmit = document.createElement("div");
                let autoSubmitContent = '<div id="autot-submit-box"> <p style="margin: 0; display: inline; color: white;">Tự động submit sau '
                    + '<strong style="color: red;" id="txt-time-count-submit">' + convertSecondToMinute(timeCount) + '</strong></p> '
                    + '<button id="btn-cancel-auto-submit">Hủy</button> </div>';
                autoSubmit.innerHTML = autoSubmitContent;
                headerContainer.appendChild(autoSubmit);
                autoSubmit.style.display = "none";

                document.getElementById("btn-cancel-auto-submit").addEventListener("click", () => {
                    console.log("canceled")
                    clearInterval(autoSubmitsetInterval);
                    headerContainer.removeChild(autoSubmit);
                })

                var autoSubmitsetInterval = setInterval( () => {
                    let a = document.getElementById("txt-time-count-submit");

                    a.innerText = convertSecondToMinute(timeCount)
                    console.log(timeCount)
                    chrome.runtime.sendMessage({ "showAutoSubmitAlertWhileRemaining": "true" }, (response) => {
                        if (timeCount < parseInt(response)) {
                            autoSubmit.style.display = "block";

                        }
                    });
                    if (timeCount == 20) {
                        clearInterval(autoSubmitsetInterval);
                        document.getElementById("btnResetCounter").click();
                    }
                    timeCount = timeCount - 1;

                }, 1000)


            });


        }

    }); */






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

// Submit button
// submitTaskButton
// document.getElementsByClassName("submitTaskButton")[0]



