const express = require("express");

const wsServer = require("./wsServer");
const { getPath } = require("./utils");
const { scrapePages } = require("./scrape");
const { resizeImagesInBin } = require("./resize");

const port = 3000;
const app = express();
const server = app.listen(port);

app.disable("etag");
app.use(express.static(getPath("public")));

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head);
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/scrape-it", (req, res) => {
  console.log("scrape-it start");
  scrapePages();
  res.status(200).send(data);
  console.log("scrape-it complete");
});

app.get("/resize-it", async (req, res) => {
  console.log("resize-it start");
  resizeImagesInBin();
  res.status(200).send("Confirmed");
  console.log("resize-it end");
});
