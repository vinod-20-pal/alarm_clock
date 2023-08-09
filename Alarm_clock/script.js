const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const submitButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector('#alarms-container');

window.addEventListener("DOMContentLoaded", (event) => {
  
    dropDownMenu(1, 12, setHours);
   
    dropDownMenu(0, 59, setMinutes);
  
    dropDownMenu(0, 59, setSeconds);
  
    setInterval(getCurrentTime, 1000);
    fetchAlarm();
  });

submitButton.addEventListener('click', getInput);


function dropDownMenu(start, end, element) {
    for (let i = start; i <= end; i++) {
      const dropDown = document.createElement("option");
      dropDown.value = i < 10 ? "0" + i : i;
      dropDown.innerHTML = i < 10 ? "0" + i : i;
      element.appendChild(dropDown);
    }
  }


  function getCurrentTime() {
    let time = new Date();
    time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
  }

  function getInput(e){
    e.preventDefault();
    var hour = setHours.value;
    var minute = setMinutes.value;
    var second = setSeconds.value;
    var amPm = setAmPm.value;
    const alarmTime = convertToTime(
      hour,
      minute,
      second,
      amPm
    );
    setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

function fetchAlarm(){
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

function setAlarm(alarmTime,fetching = false){
    const alarm = setInterval(() => {
        if(alarmTime === getCurrentTime()){
            alert('Alarm Ringing');
        }
        console.log("running");
    },500);
    addAlaramToDom(alarmTime,alarm);
    if(!fetching){
        saveAlarm(alarmTime);
    }
}

function addAlaramToDom(time, intervalId){
    console.log("intervalId"+ intervalId);
    const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

  function deleteAlarm(event, time, intervalId) {
    const self = event.target;
  
    clearInterval(intervalId);
  
    const alarm = self.parentElement;
  
    deleteAlarmFromLocal(time);
    alarm.remove();
  }

  function deleteAlarmFromLocal(time){
    let alarm = checkAlarams();
    let index = alarm.indexOf(time);
    alarm.splice(index,1);
    localStorage.setItem("alarm", JSON.stringify(alarm));
  }

  function saveAlarm(alarmTime){
    let alarms = checkAlarams();

    alarms.push(alarmTime);
    localStorage.setItem('alarm', JSON.stringify(alarms));
  }

  function checkAlarams(){
    let alarms = [];
    const isPresent = localStorage.getItem("alarm");
    if (isPresent) alarms = JSON.parse(isPresent);
    return alarms;
  }