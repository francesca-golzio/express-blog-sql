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

  const sql = 'SELECT * FROM posts WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching post from the database:', err);
      return res.status(500).json({
        err: true,
        message: 'Error retrieving post from database'
      })
    };
    if (results.length === 0) {
      return res.status(404).json({
        err: true,
        message: 'Post not found'
      })
    }
    res.json(results[0]);
  });
});

/* Store */
const store = router.post('/', (req, res) => {
  const newId = Date.now();
  const { title, content, image, tags } = req.body;
  if (archive.find(post => post.title === title)) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Another post with this title already exists'
      })
    )
  } else if (title.length === 0 || title.length > 50) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Title must be between 1 and 50 characters'
      })
    )
  } else if (content.length === 0 || content.length > 5000) {
    console.log(content.length);
    return (
      res.status(400).json({
        error: 'Bad request',
        message: 'Post must be between 1 and 5000 characters'
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
        message: '* Missing title (required parameter)'
      })
    )
  };
  if (!content) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: '* Missing content (required parameter)'
      })
    )
  };
  if (!image) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: '* Missing image (required parameter)'
      })
    )
  };
  if (!tags) {
    return (
      res.status(400).json({
        error: 'Bad request',
        message: '* Missing tags (required parameter)'
      })
    )
  };
  if (reqPost) {
    if (reqPost.title !== title) {
      if (archive.find(post => post.title === title)) {
        return (
          res.status(400).json({
            error: 'Bad request',
            message: 'Another post with this title already exists'
          })
        )
      }
      if (title.length === 0 || title.length > 50) {
        return (
          res.status(400).json({
            error: 'Bad request',
            message: 'Title must be between 1 and 50 characters'
          })
        )
      }
    }
    if (content.length === 0 || content.length > 5000) {
      return (
        res.status(400).json({
          error: 'Bad request',
          message: 'Content must be between 1 and 5000 characters'
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
        message: 'Post not found'
      })
    )
  }
});

/* Modify */
const modify = router.patch('/:id', (req, res) => {
  res.send(`Post ${req.params.id} updated (minor updates)`);
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