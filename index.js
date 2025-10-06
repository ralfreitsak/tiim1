const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/:comment/:user', (req, res) => {
  res.send('Kommentaar: ' + req.params.comment + ' Nimi: ' + req.params.user);
})

app.post('/emotions', (req, res) => {
    console.log("arrived at /emotions");
    console.log("emotions: ", req.body);
    const emotions = req.body;
    const result = emotions.join(',');
    res.send("Emotions received: " + result);
})

app.listen(port, () => {
  console.log('Example app listening on port', port)
})
