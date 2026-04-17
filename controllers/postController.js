const express = require('express');
const router = express.Router();
const archive = require('../data/archive')

/* Index */
const index = router.get('/', (req, res) => {
  const requestedTag = req.query?.tags;

  //0️⃣ se non è applicato alcun filtro
  if (requestedTag == undefined) {
    return res.json(archive);
    //altrimenti...
  } else {
    //1️⃣ preparo un contenitorre per i risultati
    let filteredPosts = [];
    //2️⃣ trasformo i filtri in un formato utilizzabile perchè 👇
    //                           👇 questo è un'unica stringa e mi servono i singoli tag
    const requestedTagsArray = requestedTag.split(' ');
    //console.log(requestedTagsArray);

    archive.filter((post) => {

      //3️⃣ cerco i post che contengono almeno uno dei tag
      requestedTagsArray.map((tag) => {

        //ma SOLO SE il post non è già selezionato
        if (!(filteredPosts.includes(post))) {

          //SE contiene un tag...
          if (post.tags.includes(tag)) {
            //... aggiungo il post ai risultati
            filteredPosts = [...filteredPosts, post]
          }
        }
      })
    })

    //4️⃣ risposta
    // SE NON ci sono risultati (array vuoto)
    if (filteredPosts.length === 0) {
      return res.json('0 risultati')
      //ALTRIMENTI restituisco i post filtrati
    } else {
      return res.json(filteredPosts);
    }
  }
});

/* Show */
const show = router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = archive.find(post => post.id === id);

  if (!post) {
    return res.status(404).json({
      error: 'Not found',
      message: 'Post non trovato'
    })
  }

  res.json(post);
});

/* Store */
const store = router.post('/', (req, res) => {

  /* genero id */
  const newId = Date.now();

  /* destrutturo i dati */
  const { title, content, image, tags } = req.body;

  /* validazione dei dati ...*/

  /* unicità del titolo */
  if (archive.find(post => post.title === title)) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Esiste già un post con questo titolo'
      })
    )

    /* lunghezza del titolo */
  } else if (title.length === 0 || title.length > 50) {
    //console.log(title.length);
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Il titolo deve essere compreso tra 1 e 50 caratteri'
      })
    )

    /* lunghezza del post */
  } else if (content.length === 0 || content.length > 5000) {
    console.log(content.length);
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Il post deve essere compreso tra 1 e 5000 caratteri'
      })
    )

  } else {
    /* definisco il nuovo post */
    const newPost = {
      id: newId,
      title,
      content,
      image,
      tags
    }

    /* 'salvo' il nuovo post nell'archivio */
    archive.push(newPost);

    /* invio la risposta */
    res.status(201).json(newPost);
  }
});

/* Update */
const update = router.put('/:id', (req, res) => {

  /* recupero l'id + parsing numero*/
  const postId = parseInt(req.params.id);

  /* cerco il post dall'archive... */
  const reqPost = archive.find(post => post.id === postId);

  /* destrutturo i dati della req */
  const { title, content, image, tags } = req.body;

  /* controllo che i parametri esistano nella req */
  if (!title) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: '* title mancante'
      })
    )
  };
  if (!content) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: '* content (parametro mancante)'
      })
    )
  };
  if (!image) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: '* image (parametro mancante)'
      })
    )
  };
  if (!tags) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: '* tags (parametro mancante)'
      })
    )
  };

  /* - SE esiste un post con quell'id */
  if (reqPost) {

    /* validazione dei dati ...*/
    /* unicità del titolo */
    if (reqPost.title !== title) {
      if (archive.find(post => post.title === title)) {
        return (
          res.status(400).json({
            error: 'Bad request',
            message: 'Esiste già un altro post con questo titolo'
          })
        )
      }
      /* lunghezza del titolo */
      if (title.length === 0 || title.length > 50) {
        return (
          res.status(400).json({
            error: 'Bad request',
            message: 'Il titolo deve essere compreso tra 1 e 50 caratteri'
          })
        )
      }
    }
    /* lunghezza del post */
    if (content.length === 0 || content.length > 5000) {
      return (
        res.status(400).json({
          error: 'Bad request',
          message: 'Il post deve essere compreso tra 1 e 5000 caratteri'
        })
      )
    }

    /* aggiorno il post */
    if (title) { reqPost.title = title };
    if (content) { reqPost.content = content };
    if (image) { reqPost.image = image };
    if (tags) { reqPost.tags = tags };

    /* restituisco il post modificato */
    return res.json(reqPost);

  } else {
    /* - SE non esiste restituisco errore */
    return (
      res.status(404).json({
        error: 'Not found',
        message: 'Post non trovato'
      })
    )
  }

});

/* Modify */
const modify = router.patch('/:id', (req, res) => {
  res.send(`Post ${req.params.id} aggiornato (minor updates)`);
});

/* Destroy */
const destroy = router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = archive.find(post => post.id == id);

  if (!post) {
    res.status(404).json({
      error: 'Not found',
      message: 'Post non trovato'
    })
  }

  archive.splice(archive.indexOf(post), 1);
  console.log(archive)

  res.sendStatus(204)
});

module.exports = {
  index,
  show,
  store,
  update,
  modify,
  destroy
}