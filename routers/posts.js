const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');

/* Lista Post (Index) */
router.get('/', postController.index);

/* Mostro un post (Show) */
router.get('/:id', postController.show);

/* Creo un nuovo post (Store) */
router.post('/', postController.store);

/* Aggiorno tutto un post (Update) */
router.put('/:id', postController.update);

/* Aggiorno parte di un post (Modify) */
router.patch('/:id', postController.modify);

/* Elimino un post (Destroy) */
router.delete('/:id', postController.destroy);

module.exports = router;