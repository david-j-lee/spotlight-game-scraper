const dataEle = document.getElementById("data");

document.addEventListener("DOMContentLoaded", function () {
  const ws = new WebSocket("ws://localhost:3000");
  ws.onopen = (client) => {
    console.log("Now connected");
  };
  ws.onmessage = (event) => {
    const messages = JSON.parse(event.data);
    let innerHtml = "";
    messages.forEach((message) => {
      innerHtml += message + "\n";
    });
    dataEle.innerHTML += innerHtml;
    dataEle.scrollTop = dataEle.scrollHeight;
  };
});

const scrapeIt = () => {
  dataEle.innerHTML = "";
  fetch("/scrape-it")
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const resizeIt = () => {
  dataEle.innerHTML = "";
  fetch("/resize-it")
    .then((res) => res.text())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
