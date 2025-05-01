const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3001;

// Schema for the Name
const nameSchema = new mongoose.Schema({
  name: String
});
const Name = mongoose.model('Name', nameSchema);

// POST endpoint to add a new name
app.post('/api/names', (req, res) => {
  console.log(`[POST] /api/names called with body: ${JSON.stringify(req.body)}`);
  const newName = new Name({ name: req.body.name });
  newName.save()
    .then(() => {
      console.log(`Name "${req.body.name}" added to database`);
      res.status(201).send('Name added');
    })
    .catch(err => {
      console.error('Error adding name:', err);
      res.status(400).json(err);
    });
});

// GET endpoint to fetch all names
app.get('/api/names', (req, res) => {
  console.log('[GET] /api/names called');
  Name.find()
    .then(names => {
      console.log(`Returned ${names.length} names`);
      res.json(names);
    })
    .catch(err => {
      console.error('Error fetching names:', err);
      res.status(500).json(err);
    });
});

// Health check endpoint
app.get('/api/hello', (req, res) => {
  console.log('[GET] /api/hello called');
  res.status(200).send("Hello, World!");
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(port, () => {
  console.log(`🚀 API server listening on port ${port}`);
});
