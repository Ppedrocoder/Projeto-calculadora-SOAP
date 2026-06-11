const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SOAP_URL = 'http://localhost:8000/';

// Monta o envelope SOAP manualmente
function montarEnvelope(operacao, a, b) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:cal="calculadora.soap">
  <soapenv:Body>
    <cal:${operacao}>
      <cal:a>${a}</cal:a>
      <cal:b>${b}</cal:b>
    </cal:${operacao}>
  </soapenv:Body>
</soapenv:Envelope>`;
}

// Faz o parse da resposta XML e extrai o valor do resultado ou o Fault
function extrairResultado(xml, operacao) {
  // Verifica se é um SOAP Fault
  const faultMatch = xml.match(/<faultstring[^>]*>([^<]+)<\/faultstring>/);
  if (faultMatch) {
    return { erro: true, mensagem: faultMatch[1] };
  }

  // Resultado normal: <operacaoResult>valor</operacaoResult>
  const regex = new RegExp(`<(tns:)?${operacao}Result[^>]*>([^<]+)<`);
  const match = xml.match(regex);
  return match ? { erro: false, valor: parseFloat(match[2]) } : { erro: false, valor: null };
}

// Função central: monta XML, envia via POST, recebe XML, faz parse
async function chamarSoap(operacao, a, b) {
  const envelope = montarEnvelope(operacao, a, b);

  console.log('\n--- XML ENVIADO ---');
  console.log(envelope);

  const response = await fetch(SOAP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': operacao,
    },
    body: envelope,
  });

  const xmlResposta = await response.text();

  console.log('\n--- XML RECEBIDO ---');
  console.log(xmlResposta);

  const parsed = extrairResultado(xmlResposta, operacao);

  return {
    resultado: parsed.erro ? null : parsed.valor,
    erro: parsed.erro ? parsed.mensagem : null,
    xmlEnviado: envelope,
    xmlRecebido: xmlResposta,
  };
}

// Endpoint REST: POST /somar
app.post('/somar', async (req, res) => {
  try {
    const { a, b } = req.body;
    const dados = await chamarSoap('somar', a, b);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Endpoint REST: POST /multiplicar
app.post('/multiplicar', async (req, res) => {
  try {
    const { a, b } = req.body;
    const dados = await chamarSoap('multiplicar', a, b);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Endpoint REST: POST /dividir
app.post('/dividir', async (req, res) => {
  try {
    const { a, b } = req.body;
    const dados = await chamarSoap('dividir', a, b);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Endpoint REST: POST /subtrair
app.post('/subtrair', async (req, res) => {
  try {
    const { a, b } = req.body;
    const dados = await chamarSoap('subtrair', a, b);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(3000, () => {
  console.log('Cliente Node.js rodando em http://localhost:3000');
});