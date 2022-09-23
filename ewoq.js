
console.log("Included")

window.onload = function () {

    var taskTimeCounter = 1;

    let headerContainer = document.getElementsByClassName("dense-header")[0];

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
            // let container = document.getElementsByClassName("dense-header")[0];

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


    // Function show time counter
    // console.log(document.body.contains(btnSubmit));
    // btnSubmit.remove();
    const showTaskTimeCounter = () => {
        chrome.runtime.sendMessage({ "getCountTaskTimeMode": "true" }, (response) => {
            if (response == "ON") {
                let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
                if (document.body.contains(btnSubmit)) {

                    // let oldTaskTime = document.getElementById("task-time");


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


    // ======== Check new task ===========

    // On click START NEXT TASK button
    const startButtonClick = () => {

        let startButton = document.getElementsByClassName("start-button")[0];
        let submitButton = document.getElementsByClassName("submitTaskButton")[0];

        if (submitButton != null && startButton == null) {
            showTaskTimeCounter();
        }
        else {
            let time = 1;
            let checkSubmitButtonInterval = setInterval(() => {
                let startButton = document.getElementsByClassName("start-button")[0];
                let submitButton = document.getElementsByClassName("submitTaskButton")[0];
                if (time <= 15) {
                    if (submitButton != null && startButton == null) {
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

        if (btnSubmit != null && btnContinue == null) {
            showTaskTimeCounter();
        }
        else {
            let time = 1;
            let checkSubmitButtonInterval = setInterval(() => {
                let btnContinue = document.getElementsByClassName("continue-button")[0];
                let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
                if (time <= 10) {
                    if (btnSubmit != null && btnContinue == null) {
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

        document.getElementsByClassName("cancel-button")[0].remove();

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
                if (time <= 5) {
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



