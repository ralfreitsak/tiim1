const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/:comment/:user', (req, res) => {
  res.send('Kommentaar: ' + req.params.comment + ' Nimi: ' + req.params.user);
})

app.listen(port, () => {
  console.log('Example app listening on port ${port}')
})