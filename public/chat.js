// Make connection to the server
var socket = io.connect("http://localhost:9080");

// Query the DOM
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var sendButton = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");

// Send a message
sendButton.addEventListener("click", function () {
  // Validate
  if (!validaInput()) {
    return;
  }

  // Get time
  var currentDate = new Date();
  var timeNow;
  if (currentDate.getMinutes() < 10) {
    timeNow = currentDate.getHours() + ":0" + currentDate.getMinutes();
  } else {
    timeNow = currentDate.getHours() + ":" + currentDate.getMinutes();
  }
  if (currentDate.getHours() < 10) {
    timeNow = "0" + timeNow;
  }

  // Emit event
  socket.emit("messageSent", {
    message: message.value,
    handle: handle.value,
    time: timeNow,
  });

  // Clear input field
  message.value = "";
});

// Click "Send" on enter keyup
message.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

// Emit event when user is typing
message.addEventListener("keypress", function () {
  socket.emit("typing", handle.value);
});

// Listen for new messages
socket.on("newMessage", function (data) {
  feedback.innerHTML = "";

  output.innerHTML +=
    "<p><strong>" +
    data.handle +
    ": </strong>" +
    data.message +
    "<br><br><em id='time'>" +
    data.time +
    "</em></p>";

  var element = document.getElementById("chat-window");
  element.scrollTop = element.scrollHeight;
});

// Listen for a user typing
socket.on("newTyping", function (data) {
  feedback.innerHTML = "<p><em>" + data + " is typing a message...</em></p>";

  var element = document.getElementById("chat-window");
  element.scrollTop = element.scrollHeight;
});

// Validate the input fields
function validaInput() {
  var messageValue = message.value;
  var handleValue = handle.value;

  if (handleValue.trim() === "" || messageValue.trim() === "") {
    document.getElementById("validation").style.visibility = "visible";
    return false;
  } else {
    document.getElementById("validation").style.visibility = "hidden";
    return true;
  }
}
