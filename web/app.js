const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Main route: Fetch names from API and render the view
app.get('/', (req, res) => {
  console.log('[INFO] [GET] / called'); // Log GET request
  fetch('http://localhost:3001/api/names')
    .then(response => response.json())
    .then(names => {
      console.log(`[INFO] Fetched ${names.length} names from API`);
      res.render('index', { names });
    })
    .catch(err => {
      console.error('[ERROR] Error fetching names from API:', err);
      res.status(500).json(err);
    });
});

// Add name route: POST request to the API
app.post('/add-name', (req, res) => {
  console.log(`[INFO] [POST] /add-name called with body: ${JSON.stringify(req.body)}`);
  fetch('http://localhost:3001/api/names', {
    method: 'POST',
    body: JSON.stringify({ name: req.body.name }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => {
    console.log(`[INFO] Name "${req.body.name}" added successfully`);
    res.redirect('/');
  })
  .catch(err => {
    console.error('[ERROR] Error adding name to API:', err);
    res.status(500).json(err);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`[INFO] Web server listening on port ${port}`);
});
