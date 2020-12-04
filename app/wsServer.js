const ws = require("ws");
const wsServer = new ws.Server({ noServer: true });

class WsServer {
  constructor() {
    wsServer.on("connection", (socket) => {
      socket.on("message", (message) => console.log(message));
    });
  }

  sendToAll(messages) {
    wsServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(messages));
      }
    });
  }

  handleUpgrade(request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit("connection", socket, request);
    });
  }
}

module.exports = new WsServer();
