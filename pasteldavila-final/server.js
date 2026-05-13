// ============================================================
// PASTEL DA VILA — Backend Node.js
// Pedidos em tempo real via Supabase
// ============================================================

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { createClient } = require('@supabase/supabase-js');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Supabase ─────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Middlewares ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── POST /api/pedido — recebe pedido do site ─────────────────
app.post('/api/pedido', async (req, res) => {
  const { cliente, endereco, itens, total, pagamento } = req.body;
  if (!cliente || !itens || !total) {
    return res.status(400).json({ erro: 'Dados incompletos' });
  }
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .insert([{
        cliente_nome:         cliente.nome,
        cliente_telefone:     cliente.telefone,
        endereco_rua:         endereco.rua,
        endereco_numero:      endereco.numero,
        endereco_complemento: endereco.complemento || '',
        endereco_bairro:      endereco.bairro,
        endereco_cidade:      endereco.cidade,
        endereco_cep:         endereco.cep,
        itens:                JSON.stringify(itens),
        total:                parseFloat(total),
        pagamento,
        status:               'novo',
        origem:               'site',
        criado_em:            new Date().toISOString(),
      }])
      .select()
      .single();
    if (error) throw error;
    return res.json({ sucesso: true, pedido_id: data.id });
  } catch (err) {
    console.error('Erro ao salvar pedido:', err.message);
    return res.status(500).json({ erro: 'Falha ao registrar pedido' });
  }
});

// ── GET /api/pedidos — lista pedidos para o painel ───────────
app.get('/api/pedidos', async (req, res) => {
  if (req.headers['x-painel-senha'] !== process.env.PAINEL_SENHA) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(100);
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// ── PATCH /api/pedido/:id — atualiza status ──────────────────
app.patch('/api/pedido/:id', async (req, res) => {
  if (req.headers['x-painel-senha'] !== process.env.PAINEL_SENHA) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  const { status } = req.body;
  try {
    const { error } = await supabase
      .from('pedidos').update({ status }).eq('id', req.params.id);
    if (error) throw error;
    return res.json({ sucesso: true });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// ── POST /api/pedido-manual — lança pedido do WhatsApp ───────
app.post('/api/pedido-manual', async (req, res) => {
  if (req.headers['x-painel-senha'] !== process.env.PAINEL_SENHA) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  const { cliente_nome, cliente_telefone, itens_texto, total, pagamento } = req.body;
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .insert([{
        cliente_nome,
        cliente_telefone,
        endereco_rua: '', endereco_numero: '',
        endereco_bairro: '', endereco_cidade: '', endereco_cep: '',
        endereco_complemento: '',
        itens: JSON.stringify([{ nome: itens_texto, qty: 1, preco: parseFloat(total) }]),
        total: parseFloat(total),
        pagamento,
        status: 'novo',
        origem: 'whatsapp',
        criado_em: new Date().toISOString(),
      }])
      .select().single();
    if (error) throw error;
    return res.json({ sucesso: true, pedido_id: data.id });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

// ── Painel ───────────────────────────────────────────────────
app.get('/painel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'painel.html'));
});

// ── Fallback ─────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Pastel da Vila rodando na porta ${PORT}`));
