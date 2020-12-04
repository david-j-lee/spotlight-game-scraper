const fs = require("fs");
const probe = require("probe-image-size");
const sharp = require("sharp");

const wsServer = require("./wsServer");
const { getPath, getExtension } = require("./utils");

const resizeImagesInBin = () => {
  let messages = [];
  const VALID_EXTENSIONS = ["jpg", "png"];
  const NEW_WIDTHS = [1024, 640, 256];

  const dir = getPath("bin/sizes");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.readdir(getPath("bin"), (err, files) => {
    files.forEach(async (file) => {
      const extension = getExtension(file).toLowerCase();
      if (VALID_EXTENSIONS.includes(extension)) {
        const filePath = getPath("bin/") + file;
        const dimensions = await probe(fs.createReadStream(filePath));
        const aspectRatio = dimensions.width / dimensions.height;
        let message = `[${dimensions.width}, ${dimensions.height}] ->`;
        NEW_WIDTHS.forEach(async (newWidth) => {
          const newHeight = Math.round(newWidth / aspectRatio);
          message += ` [${newWidth}, ${newHeight}]`;
          const fileNameSegment = file.split(".");
          if (fileNameSegment.length > 1) {
            const newFileName = `${fileNameSegment[0]}-${newWidth}x${newHeight}.${fileNameSegment[1]}`;
            await sharp(filePath)
              .resize(newWidth, newHeight)
              .toFile(getPath("bin/sizes/") + newFileName);
          }
        });
        messages.push(wsServer.sendToAll([file + " " + message]));
      } else {
        messages.push(wsServer.sendToAll([file + " INVALID EXTENSION"]));
      }
      if (messages.length > 500) {
        wsServer.sendToAll([...messages]);
        messages = [];
      }
    });
    wsServer.sendToAll([...messages]);
  });
};

module.exports = {
  resizeImagesInBin,
};
