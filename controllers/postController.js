//Importo path e filesystem
const path = require("path");
const fs = require("fs");

//raccolgo i posts dal db
const posts = require("../db");

//Metodo Index per la lista dei posts
const index = (req, res) => {
  //Controllo il tipo di risposta
  res.format({
    //HTML
    html: () => {
      let html = "<h1>Lista dei Posts - Index</h1> <ul>";

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
        let html = `<h1>Richiesta fatta per post ${slug}</h1>`;
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

//Create
const create = (req, res) => {
  //Controllo il tipo di richiesta
  res.format({
    //HTML
    html: () => {
      res.send("<h1>Creazione nuovo Post</h1>");
    },

    //Le altre richieste danno status 406 con relativo errore
    default: () => {
      res.status(406).json({
        message: `Richiesta ${req.headers.accept} non supportata`,
        status: 406,
      });
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
  create,
  download,
};
