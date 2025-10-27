const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { title } = require('process');

const app = express();
const port = 5000;

const DATA_FOLDER = path.join(__dirname, 'data');

app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync(DATA_FOLDER)){
    fs.mkdirSync(DATA_FOLDER);
}

const getArticles = () => { 
  return fs.readdirSync(DATA_FOLDER).map(file => {
    const filePath = path.join(DATA_FOLDER, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return { id: file.replace('.json', ''), title: data.title, birthYear: data.birthYear, nationality: data.nationality, occupation: data.occupation, knownFor: data.knownFor, content: data.content};
  });
}


app.get('/articles', (req, res) => {
  try {
    const articles = getArticles();
    res.json(articles);

  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ error: 'Error fetching articles' });
  }
})

app.get('/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const filePath = path.join(DATA_FOLDER, `${articleId}.json`);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (err) {
    console.error('No article found:', err);
    res.status(404).json({ error: 'No article found' });
  }
});


app.post('/articles', (req, res) => {
  const { id, title, birthYear, nationality, occupation, knownFor, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const articleId = Date.now().toString();
  const filePath = path.join(DATA_FOLDER, `${articleId}.json`);
  const articleData = { id: articleId, title, birthYear, nationality, occupation, knownFor, content };

  fs.writeFileSync(filePath, JSON.stringify(articleData));
  res.status(201).json({ id: articleId, message: 'Article created' });
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});