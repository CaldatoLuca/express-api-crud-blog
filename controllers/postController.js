//Importo path e filesystem
const path = require("path");
const fs = require("fs");

//Funzioni utility
const { generateSlug } = require("../utils");

//raccolgo i posts dal db
const posts = require("../db");
const { json } = require("express");

//Metodo Index per la lista dei posts
const index = (req, res) => {
  //Controllo il tipo di risposta
  res.format({
    //HTML
    html: () => {
      let html = "<h1>Lista dei Posts - Index</h1> <a href='/'>Home</a> <ul>";

      posts.map(
        (p) =>
          (html += `<li>
        <div>
        <h3>${p.title}</h3>
        <a href="/posts/${p.slug}">Show</a>
        </div>
        <img src="/imgs/posts/${p.image}" alt="${p.title}" width="100">
        <div>${p.content}</div>
        <h5>${p.tags.map((t) => `#${t}`).join(" ")}</h5>
        </li>`)
      );

      html += "</ul>";

      res.send(html);
    },

    //JSON
    json: () => {
      res.json({
        posts: posts,
        number: posts.length,
      });
    },
  });
};

//Metodo Show per mostrare il singolo post per :slug
const show = (req, res) => {
  //raccolgo lo slug inserito, come parametro e ottengo l'oggetto post corrispoindente
  const slug = req.params.slug;
  const requestedPost = posts.find((p) => p.slug === slug);

  //Controllo se requstedPost esiste e incluso nel mio array
  if (posts.includes(requestedPost)) {
    //genero i url da dare in risposta al json
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/imgs/posts/${requestedPost.image}`;
    const downloadUrl = `${baseUrl}/posts/${slug}/download`;

    //Controllo il tipo di risposta
    res.format({
      //HTML
      html: () => {
        let html = `<h1>Richiesta fatta per post ${slug}</h1> <a href='/posts'>Back</a>`;
        html += `
        <div>
        <h3>${requestedPost.title}</h3>
        <a href="/posts/${requestedPost.slug}/download">Download Image</a>
        </div>
          <img src="/imgs/posts/${requestedPost.image}" alt="${
          requestedPost.title
        }" width="100">
          <div>${requestedPost.content}</div>
          <h5>${requestedPost.tags.map((t) => `#${t}`).join(" ")}</h5>`;
        res.send(html);
      },

      //JSON
      json: () => {
        res.json({
          status: `succes`,
          post: requestedPost,
          image_url: imageUrl,
          image_download_url: downloadUrl,
        });
      },
    });
  } else {
    res.status(404).send(`Post ${slug} non trovato`);
  }
};

//Metodo Store per creazione di un nuovo post
const store = (req, res) => {
  const { title, content, tags, image } = req.body;

  // Verifica che tutti i campi necessari siano presenti e non vuoti
  if (!title || !content || !tags || !image) {
    return res.status(400).json({
      status: "error",
      message: "Titolo, contenuto, tag e immagine sono tutti obbligatori",
    });
  }

  const slugs = posts.map((p) => p.slug);
  const slug = generateSlug(req.body.title, slugs);

  const newPost = {
    title: req.body.title,
    slug: slug,
    content: req.body.content,
    tags: req.body.tags,
    image: req.body.image,
  };

  posts.push(newPost);

  res.format({
    html: () => {
      res.redirect(`/posts/${slug}`);
    },
    json: () => {
      res.json({
        status: `succes`,
        post: newPost,
      });
    },
    default: () => {
      res.status(406).send(`Formato non supportato`);
    },
  });
};

const destroy = (req, res) => {
  //raccolgo lo slug inserito, come parametro e ottengo l'oggetto post corrispoindente
  const slug = req.params.slug;
  const requestedPost = posts.find((p) => p.slug === slug);
  const index = posts.indexOf(requestedPost);
  posts.splice(index, 1);

  res.format({
    html: () => {
      res.redirect(`/posts`);
    },
    json: () => {
      res.json({
        status: `succes`,
        message: `Post ${slug} cancellato`,
      });
    },
    default: () => {
      res.status(406).send(`Formato non supportato`);
    },
  });
};

//Download
const download = (req, res) => {
  //raccolgo lo slug inserito, come parametro e ottengo l'oggetto post corrispoindente
  const slug = req.params.slug;
  const requestedPost = posts.find((p) => p.slug === slug);

  //Controllo se requstedPost esiste e incluso nel mio array
  if (posts.includes(requestedPost)) {
    //creo la path assoluta del file
    const fileName = requestedPost.image;
    const filePath = path.join(__dirname, `../public/imgs/posts/${fileName}`);

    //controllo se il file esiste nella mia directory
    if (fs.existsSync(filePath)) {
      //scarico il file
      res.download(filePath);
    } else {
      res.status(404).send("File non trovato");
    }
  } else {
    res
      .status(404)
      .send(`Post ${slug} non trovato, impossibile effetuare il download`);
  }
};

module.exports = {
  index,
  show,
  download,
  store,
  destroy,
};
