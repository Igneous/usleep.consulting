// "online", "idle", "dnd", "offline"

function checkChatStatus() {
  sreq = new XMLHttpRequest();
  sreq.open('GET', 'https://usleep-chat.herokuapp.com/status', true);
  sreq.send();
  sreq.onreadystatechange = updateChatStatus;
}

function updateChatStatus() {
  if (sreq.readyState == 4 && sreq.status == 200) {
    response = sreq.responseText;
    switch(response) {
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

    if (response != "offline") {
      document.getElementById('status').innerHTML =
        "Status: <font color='" + color + "'>" + response + "</font> " +
        "[<a href='#' onclick='showChat()'>Chat</a>]";
    } else {
      document.getElementById('status').innerHTML =
        "Status: <font color='" + color + "'>" + response + "</font>";
    }
  }
}
