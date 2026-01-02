const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO: Coloque aqui o comando que você usa no terminal para ligar/desligar
const COMANDO_CONECTAR = 'gcloud compute ssh --zone "Sua-Zona" "Sua-Instancia" -- -N -L 8080:localhost:80';
const COMANDO_DESCONECTAR = 'taskkill /IM "gcloud.exe" /F'; // Exemplo Windows para fechar o túnel

app.post('/vpn', (req, res) => {
    const { action } = req.body;
    const comando = action === 'connect' ? COMANDO_CONECTAR : COMANDO_DESCONECTAR;

    console.log(`Executando: ${action}`);

    // Executa o comando no sistema operacional
    const processo = exec(comando, (error, stdout, stderr) => {
        if (error && action === 'connect') {
            console.error(`Erro: ${error}`);
            return res.status(500).json({ success: false });
        }
    });

    // Como túneis SSH/VPN às vezes ficam abertos, respondemos "sucesso" se o comando iniciou
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('--- SERVIDOR DO PORTAL VPN RODANDO ---');
    console.log('Acesse o seu arquivo HTML no navegador.');
});

app.get('/', (req, res) => {
    res.send("O servidor da VPN está ativo e aguardando comandos do portal!");
});