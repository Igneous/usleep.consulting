// "online", "idle", "dnd", "offline"

function checkLocation() {
  lreq = new XMLHttpRequest();
  lreq.open('GET', 'https://usleep-chat.herokuapp.com/loc.json', true);
  lreq.send();
  lreq.onreadystatechange = updateLocTime;
}

function updateLocTime() {
  if (lreq.readyState == 4 && lreq.status == 200) {
    loc = JSON.parse(lreq.responseText);
    document.getElementById('location').innerHTML = "Location: " + loc.location;
    var updateTime = function() {
      document.getElementById('time').innerHTML = luxon.DateTime.local().setZone(loc.timezone).toFormat("cccc LLL d, h:mm:ss a (ZZZ)");
    }
    setInterval(updateTime, 1000);
  }
}

function checkChatStatus() {
  sreq = new XMLHttpRequest();
  sreq.open('GET', 'https://usleep-chat.herokuapp.com/status.json', true);
  sreq.send();
  sreq.onreadystatechange = updateChatStatus;
}

function updateChatStatus() {
  if (sreq.readyState == 4 && sreq.status == 200) {
    response = JSON.parse(sreq.responseText);
    switch(response.chat_status) {
      case "online":
        color = "green";
        break;
      case "idle":
        color = "orange";
        break;
      case "dnd":
        color = "red";
        break;
      case "offline":
        color = "gray"
    }

    if (response.chat_status != "offline") {
      document.getElementById('status').innerHTML =
        "Status: <font color='" + color + "'>" + response.chat_status + "</font> " +
        "[<a href='#' onclick='showChat()'>Chat</a>]";
    } else {
      document.getElementById('status').innerHTML =
        "Status: <font color='" + color + "'>" + response.chat_status + "</font>";
    }
  }
}

function sendMessage(msg) {
}
