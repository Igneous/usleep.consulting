// "online", "idle", "dnd", "offline"

function checkLocation() {
  var lreq = new XMLHttpRequest();
  lreq.open('GET', 'https://usleep-chat.herokuapp.com/loc.json', true);
  lreq.send();
  lreq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var loc = JSON.parse(this.responseText);
      document.getElementById('location').innerHTML = "Location: " + loc.location;
      var updateTime = function() {
        document.getElementById('time').innerHTML =
          luxon.DateTime.local().setZone(loc.timezone).toFormat("cccc LLL d, h:mm:ss a (ZZZ)");
      }
      setInterval(updateTime, 1000);
    }
  }
}

function checkChatStatus() {
  var sreq = new XMLHttpRequest();
  sreq.open('GET', 'https://usleep-chat.herokuapp.com/status.json', true);
  sreq.send();
  sreq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
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
          "Chat: <font color='" + color + "'>" + response.chat_status + "</font> " +
          "[<a href='#' onclick='showChat()'>open livechat</a>]";
      } else {
        document.getElementById('status').innerHTML =
          "Chat: <font color='" + color + "'>" + response.chat_status + "</font>";
      }
    }
  }
}

function sendMessage() {
  var postdata = {};
  postdata.time = new Date();
  postdata.user = getCookie("username");
  postdata.message = document.getElementById("chatmsg").value;
  var smreq = new XMLHttpRequest();
  smreq.open('POST', 'https://usleep-chat.herokuapp.com/message.json', true);
  smreq.setRequestHeader("Content-Type", "application/json");
  smreq.send(JSON.stringify(postdata));
  smreq.onreadystatechange = getMessages;
}

function getMessages() {
  checkCookie();
  var gmreq = new XMLHttpRequest();
  gmreq.open('GET', 'https://usleep-chat.herokuapp.com/messages.json?username=' + getCookie("username"), true);
  gmreq.setRequestHeader("Content-Type", "application/json");
  gmreq.send();
  gmreq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('chatcontent').value = renderChat(JSON.parse(this.responseText));
    }
  }
}

function renderChat(msgArr) {
  var msgstr = new String;
  for (var msg in msgArr) {
    msgstr += "<div class=\"chatmsg\">[" + msg['time'] + "] " + msg['author'] + " said...</div>" +
              "<p class=\"chatmsg\">" + msg['message'] + "</p>";
  }
  return msgstr;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var username = getCookie("username");
  if (username != "") {
  } else {
    username = prompt("Please enter your name:", "");
    if (username != "" && username != null) {
      setCookie("username", username, 7);
    }
  }
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function showChat() {
  checkCookie();
  document.getElementById('chat').style.display = "block";
  dragElement(document.getElementById('chat'));
  setInterval(getMessages, 10000);
}

function hideChat() {
  document.getElementById('chat').style.display = "none";
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
