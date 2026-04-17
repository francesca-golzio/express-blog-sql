const express = require('express');
const app = express();
const port = 3000;
const postsRouter = require('./routers/posts');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorsHandler');

/* Rendo accessibili gli assets static */
app.use(express.static('public'));

/* Attivo il body parser indicando quale formato voglio usare */
app.use(express.json());

/* Server Index */
app.get('/', (req, res) => {

  res.send('Sono il server del blog');
});

app.use('/posts', postsRouter);

/* Il Server sta in ascolto alla port 3000 */
app.listen(port, () => {
  console.log('Il Server gira qui http://localhost:3000');
});

/* Registro le middlewares */
app.use(notFound)
app.use(errorHandler);