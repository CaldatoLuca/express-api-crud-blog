const path = require("path");
const fs = require("fs");

const generateSlug = (str, arr) => {
  const baseSlug = str.replaceAll(" ", "-").toLowerCase().replaceAll("/", "");

  let count = 1;
  let slug = baseSlug;
  while (arr.includes(slug)) {
    slug = `${baseSlug}-${count}`;
    count++;
  }
  return slug;
};

const readJSON = (fileName) => {
  const filePath = path.join(__dirname, `${fileName}.json`);
  const json = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(json);
};

const writeJSON = (fileName, data) => {
  const filePath = path.join(__dirname, `${fileName}.json`);
  const json = JSON.stringify(data);
  fs.writeFileSync(filePath, json);
};

const removePost = (fileName, slug) => {
  const data = readJSON(fileName);
  const updatedData = data.filter((post) => post.slug !== slug);
  writeJSON(fileName, updatedData);
};

module.exports = {
  generateSlug,
  readJSON,
  writeJSON,
  removePost,
};
