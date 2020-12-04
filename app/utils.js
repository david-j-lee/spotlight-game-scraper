const getPath = (path) => {
  return `${__dirname}/../${path}`;
};

const getExtension = (fileName) => {
  const fileParts = fileName.split(".");
  if (fileParts.length > 1) {
    return fileParts[fileParts.length - 1];
  }
  return "";
};

module.exports = {
  getPath,
  getExtension,
};
