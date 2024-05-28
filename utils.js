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

/**
 * Dato il nome di un file json, sovrascrive il file con i dati passati come array
 * @param {string} fileName
 * @param {array} data
 */
const writeJSON = (fileName, data) => {
  const filePath = path.join(__dirname, `${fileName}.json`);
  const json = JSON.stringify(data);
  fs.writeFileSync(filePath, json);
};

/**
 * Dato il nome di un file json, elimina dal file il dato con lo slug passato
 * @param {string} fileName
 * @param {string} slug
 */
const removePost = (fileName, slug) => {
  const data = readJSON(fileName);
  const updatedData = data.filter((post) => post.slug !== slug);
  writeJSON(fileName, updatedData);
};

module.exports = {
  generateSlug,
  writeJSON,
  removePost,
};
