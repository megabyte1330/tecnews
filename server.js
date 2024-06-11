const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Endpoint para obter todas as notícias
app.get('/news', async (req, res) => {
  const news = await prisma.news.findMany();
  res.json(news);
});

// Endpoint para obter uma notícia por ID
app.get('/news/:id', async (req, res) => {
  const { id } = req.params;
  const news = await prisma.news.findUnique({
    where: { id: id }
  });
  res.json(news);
});

// Endpoint para adicionar uma nova notícia
app.post('/news', async (req, res) => {
  const { title, summary, content, image } = req.body;
  const newNews = await prisma.news.create({
    data: { title, summary, content, image }
  });
  res.json(newNews);
});

// Endpoint para atualizar uma notícia
app.put('/news/:id', async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, image } = req.body;
  const updatedNews = await prisma.news.update({
    where: { id: id },
    data: { title, summary, content, image }
  });
  res.json(updatedNews);
});

// Endpoint para excluir uma notícia
app.delete('/news/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.news.delete({
    where: { id: id }
  });
  res.sendStatus(204);
});
// Dados de usuários para o protótipo
const users = [
  { username: 'admin', password: '1234', level: 'admin' },
  { username: 'user1', password: 'password', level: 'user' },
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
      res.json({ success: true, level: user.level });
  } else {
      res.json({ success: false });
  }
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
