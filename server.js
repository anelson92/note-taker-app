const express = require('express')
const fs = require('fs')
// const path = require('path')
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001; 

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'));

const readAndAppend = (content) => {
    fs.readFile('db.json', (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const parsedDataArray = JSON.parse(data);
      parsedDataArray.push(content);
      writeToFile('db.json', JSON.stringify(parsedDataArray));
      // maybe have this function return the updated notes
      return parsedDataArray;
    }
  })
};

// HTML routes
// GET route to retieve notes.html
app.get('/public/notes.html',function(req, res) {
    res.sendFile('__dirname, ../public, notes.html');
});
// GET * route to retrieve the index.html
app.get('*', (req, res) => {
    res.sendFile('__dirname, ../public, index.html')    
});

// GET /api/notes to read the db.json and return all saved notes as JSON
app.get('/api/notes/', (req, res) => {
  res.json(notes)
})

// POST /api/notes to save new notes on request body and save it to the JSON file "You'll need to find a way to give each note a unique id when it's saved"
app.post('/api/notes/', (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
  };

  const updatedNotesArray = readAndAppend(newNote);
  res.status(200).json( { updatedNotes: updatedNotesArray })
})

app.delete('/api/notes/:id', (req, res) => {
  notes.forEach((note, index) => {
    if(req.params.id === note.id) {
      notes.splice(index, 1)
    }
  })

  writeToFile('db.json', notes)
})

app.listen(PORT, () => 
  console.log(`Note taking app listening on ${PORT}!`)
)
