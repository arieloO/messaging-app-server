const app = require("express")();

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

// get
app.get("/", (req, res) => {
  // sends html file as response
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  let username = null;
  // user connects
  console.log("a user connected");

  // broadcast userX is connected);
  socket.on("user connection", (name) => {
    console.log("emit login : ", name);
    username = name;
    io.emit("user log", {
      type: "login",
      name: name,
      message: `welcome ${name} !`,
    });
  });

  // user disconnects
  socket.on("disconnect", () => {
    console.log("user disconnected : ", username);
    io.emit("user log", {
      type: "logout",
      name: username,
      message: `${username} left the conversation...`,
    });
  });

  // socket.on("user disconnect", (name) => {
  //   console.log("a user disconnected");
  //   console.log(name, " has logged out");
  //   io.emit("user log", {
  //     type: "logout",
  //     name: name,
  //     message: `${name} left the conversation...`,
  //   });
  // });

  // broadcast message
  socket.on("chat message", ({ type, name, message }) => {
    console.log(name + ": " + message);
    io.emit("chat message", { type, name, message });
  });

  // broadcast user is typing
  socket.on("isTyping", (name) => {
    console.log(name, " is typing");
    io.emit("user isTyping", name);
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
