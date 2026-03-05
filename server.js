const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Para imagens e CSS futuro

// Rotas do VerdeVida
app.get('/', (req, res) => res.render('index'));
app.get('/produto', (req, res) => res.render('produto'));
app.get('/fotos', (req, res) => res.render('fotos'));
app.get('/contato', (req, res) => res.render('contato'));
app.get('/detalhes', (req, res) => res.render('detalhes'));
app.get('/detalhes2', (req, res) => res.render('detalhes2'));
app.get('/detalhes3', (req, res) => res.render('detalhes3'));

// Rota para processar o formulário de contato
app.post('/enviar', (req, res) => {
    const novoContato = req.body;
    const caminhoArquivo = path.join(__dirname, 'data', 'mensagens.json');

    // Cria a pasta 'data' se não existir
    if (!fs.existsSync(path.join(__dirname, 'data'))) {
        fs.mkdirSync(path.join(__dirname, 'data'));
    }

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) { lista = JSON.parse(data); }
        lista.push({ ...novoContato, data: new Date() });

        fs.writeFile(caminhoArquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.send("Erro ao salvar mensagem.");
            res.render('sucesso', { nome: novoContato.nome });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`VerdeVida rodando em http://localhost:${PORT}`));