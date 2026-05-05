// ============================================================
// PASTEL DA VILA — Backend (Node.js + Express)
// Integração Pix via Mercado Pago
// ============================================================

const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Mercado Pago Client ──────────────────────────────────────
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
const payment = new Payment(client);

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos do site (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// ── Rota: Criar pagamento Pix ────────────────────────────────
app.post('/api/criar-pix', async (req, res) => {
  const { total, nome, email, pedido } = req.body;

  if (!total || !nome) {
    return res.status(400).json({ erro: 'Dados incompletos' });
  }

  // Monta descrição resumida do pedido
  const descricao = pedido
    ? pedido.map(i => `${i.qty}x ${i.nome}`).join(', ').substring(0, 100)
    : 'Pedido Pastel da Vila';

  try {
    const resultado = await payment.create({
      body: {
        transaction_amount: parseFloat(total),
        description: descricao,
        payment_method_id: 'pix',
        payer: {
          email: email || 'cliente@pasteldavila.com.br',
          first_name: nome.split(' ')[0],
          last_name: nome.split(' ').slice(1).join(' ') || 'Cliente',
        },
      },
      requestOptions: {
        idempotencyKey: `pedido-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      },
    });

    const txData = resultado.point_of_interaction?.transaction_data;

    if (!txData) {
      return res.status(500).json({ erro: 'Erro ao gerar Pix no Mercado Pago' });
    }

    return res.json({
      id: resultado.id,
      status: resultado.status,
      qr_code: txData.qr_code,           // código copia-e-cola
      qr_code_base64: txData.qr_code_base64, // imagem do QR Code
      expiracao: resultado.date_of_expiration,
    });

  } catch (err) {
    console.error('Erro Mercado Pago:', err);
    return res.status(500).json({ erro: 'Falha ao criar pagamento Pix', detalhe: err.message });
  }
});

// ── Rota: Verificar status do pagamento ─────────────────────
app.get('/api/status-pix/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await payment.get({ id });
    return res.json({
      id: resultado.id,
      status: resultado.status, // pending | approved | cancelled | rejected
      status_detail: resultado.status_detail,
    });
  } catch (err) {
    console.error('Erro ao consultar pagamento:', err);
    return res.status(500).json({ erro: 'Falha ao consultar pagamento' });
  }
});

// ── Rota: Webhook Mercado Pago (notificações automáticas) ────
app.post('/api/webhook', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'payment' && data?.id) {
    try {
      const resultado = await payment.get({ id: data.id });
      console.log(`[Webhook] Pagamento ${data.id} — Status: ${resultado.status}`);
      // Aqui você pode salvar em banco, enviar notificação, etc.
    } catch (err) {
      console.error('[Webhook] Erro:', err.message);
    }
  }

  res.sendStatus(200);
});

// ── Fallback: serve index.html para qualquer rota desconhecida
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Pastel da Vila rodando na porta ${PORT}`);
});
