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

module.exports = {
  generateSlug,
};
