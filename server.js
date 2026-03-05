const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// --- CONFIGURAÇÕES ---
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Para CSS e imagens na pasta public

// --- ROTAS DE NAVEGAÇÃO (GET) ---
app.get('/', (req, res) => res.render('index'));
app.get('/produto', (req, res) => res.render('produto'));
app.get('/fotos', (req, res) => res.render('fotos'));
app.get('/contato', (req, res) => res.render('contato'));
app.get('/detalhes', (req, res) => res.render('detalhes'));
app.get('/detalhes2', (req, res) => res.render('detalhes2'));
app.get('/detalhes3', (req, res) => res.render('detalhes3'));

// --- NOVA ROTA: EXIBIR MENSAGENS (Requisito da Aula) ---
app.get('/mensagens', (req, res) => {
    const caminhoArquivo = path.join(__dirname, 'data', 'mensagens.json');

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) {
            try {
                lista = JSON.parse(data);
            } catch (e) {
                lista = [];
            }
        }
        // Envia o vetor 'lista' para o EJS com o nome 'mensagens'
        res.render('exibirMensagens', { mensagens: lista });
    });
});

// --- ROTA POST: SALVAR MENSAGEM ---
app.post('/enviar', (req, res) => {
    const novoContato = req.body;
    const pastaData = path.join(__dirname, 'data');
    const caminhoArquivo = path.join(pastaData, 'mensagens.json');

    // Cria a pasta 'data' se ela não existir (evita erro no servidor)
    if (!fs.existsSync(pastaData)) {
        fs.mkdirSync(pastaData);
    }

    // Lendo o arquivo para adicionar à lista existente
    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) {
            try {
                lista = JSON.parse(data);
            } catch (e) {
                lista = [];
            }
        }

        // Adiciona o novo contato com a data atual
        lista.push({ ...novoContato, dataEnvio: new Date() });

        // Gravando de forma ASSÍNCRONA (Desafio)
        fs.writeFile(caminhoArquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) {
                console.error("Erro ao salvar:", err);
                return res.status(500).send("Erro ao salvar mensagem.");
            }
            // Renderiza a página de sucesso
            res.render('sucesso', { nome: novoContato.nome });
        });
    });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
// O uso do process.env.PORT é obrigatório para o Render funcionar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`VerdeVida rodando em: http://localhost:${PORT}`);
});
