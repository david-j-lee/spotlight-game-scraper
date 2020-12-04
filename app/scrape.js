const axios = require("axios");
const cheerio = require("cheerio");

const wsServer = require("./wsServer");

const scrapePages = async () => {
  let run = true;
  let pageNumber = 1;
  const data = [];
  while (run) {
    await axios
      .get(`https://windows10spotlight.com/page/${pageNumber}`)
      .then(async (res) => {
        if (res.status !== 200) {
          throw new Error("Unable to find this page");
        }
        const $ = cheerio.load(res.data);
        const urls = getHrefs($);
        for (const url of urls) {
          const values = await scrapeUrl(url);
          if (values) {
            console.log(`${url} has been scraped`);
            data.push(values);
            wsServer.sendToAll(["FOUND " + JSON.stringify(values)]);
          } else {
            console.log(`${url} has no valid values`);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        run = false;
        wsServer.sendToAll(["FAILED " + error]);
      });
    pageNumber++;
  }
  saveData(data);
  return data;
};

const getHrefs = ($) => {
  let links = [];
  $("a.anons-thumbnail").each((index, element) => {
    links.push($(element).attr("href"));
  });
  return links;
};

const scrapeUrl = async (url) => {
  return await axios
    .get(url)
    .then(async (res) => {
      if (res.status === 200) {
        const $ = cheerio.load(res.data);

        const urlSegments = url.split("/");
        const id = urlSegments[urlSegments.length - 1];

        const imageUrl = $("figure a").attr("href");
        const imageUrlSegments = source.split("/");
        const source = imageUrlSegments[imageUrlSegments.length - 1];

        const caption = $(".wp-caption-text").text();
        const source = $("figure a").attr("href");

        await saveImages(source);

        return {
          id,
          source,
          caption,
        };
      }
    })
    .catch((err) => console.log(err));
};

const saveImages = async (url) => {
  const dir = getPath("bin");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const urlSegments = url.split("/");
  const fileName = urlSegments[urlSegments.length - 1];
  return await axios
    .request({ url, method: "GET", responseType: "stream" })
    .then((res) => {
      if (res.status === 200) {
        res.data.pipe(fs.createWriteStream(`${dir}/${fileName}`));
      }
    });
};

const saveData = (data) => {
  const dir = getPath("bin");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFile(`${dir}/data.json`, JSON.stringify(data), (callback) => {
    console.log("Callback for save data");
  });
};

module.exports = {
  scrapePages,
};
