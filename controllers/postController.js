const express = require('express');
const router = express.Router();
const connection = require('../database/blog-db')

/* Index */
const index = router.get('/', (req, res) => {
  const sql = 'SELECT * FROM posts';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching posts from the database:', err);
      return res.status(500).json({
        err: true,
        message: 'Error retrieving posts from database'
      })
    };
    //console.log(results);    
    res.json(results);
  });
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
  const newId = Date.now();
  const { title, content, image, tags } = req.body;
  if (archive.find(post => post.title === title)) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Esiste già un post con questo titolo'
      })
    )
  } else if (title.length === 0 || title.length > 50) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Il titolo deve essere compreso tra 1 e 50 caratteri'
      })
    )
  } else if (content.length === 0 || content.length > 5000) {
    console.log(content.length);
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Il post deve essere compreso tra 1 e 5000 caratteri'
      })
    )
  } else {
    const newPost = {
      id: newId,
      title,
      content,
      image,
      tags
    }
    archive.push(newPost);
    res.status(201).json(newPost);
  }
});

/* Update */
const update = router.put('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const reqPost = archive.find(post => post.id === postId);
  const { title, content, image, tags } = req.body;
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
  if (reqPost) {
    if (reqPost.title !== title) {
      if (archive.find(post => post.title === title)) {
        return (
          res.status(400).json({
            error: 'Bad request',
            message: 'Esiste già un altro post con questo titolo'
          })
        )
      }
      if (title.length === 0 || title.length > 50) {
        return (
          res.status(400).json({
            error: 'Bad request',
            message: 'Il titolo deve essere compreso tra 1 e 50 caratteri'
          })
        )
      }
    }
    if (content.length === 0 || content.length > 5000) {
      return (
        res.status(400).json({
          error: 'Bad request',
          message: 'Il post deve essere compreso tra 1 e 5000 caratteri'
        })
      )
    }
    if (title) { reqPost.title = title };
    if (content) { reqPost.content = content };
    if (image) { reqPost.image = image };
    if (tags) { reqPost.tags = tags };
    return res.json(reqPost);
  } else {
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
  const sql = 'DELETE FROM posts WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting post from the database:', err);
      return res.status(500).json({
        err: true,
        message: 'Error deleting post from database'
      })
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        err: true,
        message: 'Post not found, nothing deleted'
      })
    }
    res.sendStatus(204)
  });

});

  module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy
  }