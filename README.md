# Calculadora SOAP

API SOAP em Python → Cliente Node.js (XML manual) → Frontend HTML puro

## Estrutura

```
projeto/
├── api/          # Python + spyne (porta 8000)
├── cliente/      # Node.js + fetch manual (porta 3000)
└── frontend/     # HTML puro (abrir no navegador)
```

## Como rodar

Abra 3 terminais separados.

### Terminal 1 — API SOAP (Python)

```bash
cd api
pip install -r requirements.txt
python server.py
```

Acesse http://localhost:8000/?wsdl para ver o WSDL gerado.

### Terminal 2 — Cliente Node.js

```bash
cd cliente
npm install
node index.js
```

### Terminal 3 — Frontend

Abra o arquivo `frontend/index.html` diretamente no navegador.
Se quiser servir com live-server:

```bash
npx live-server frontend
```

## Fluxo

1. Frontend envia JSON para o Node.js (`POST /somar` ou `POST /multiplicar`)
2. Node.js monta o envelope SOAP **na mão** (XML puro) e faz POST para a API Python
3. API Python processa e devolve XML SOAP
4. Node.js faz parse do XML e devolve resultado + XML bruto para o frontend
5. Frontend exibe o resultado e mostra os dois XMLs (enviado e recebido)

## Endpoints da API SOAP

| Operação      | Parâmetros | Retorno |
|---------------|------------|---------|
| `somar`       | a, b       | Float   |
| `multiplicar` | a, b       | Float   |
| `dividir`     | a, b       | Float   |
| `subtrair`    | a, b       | Float   |
