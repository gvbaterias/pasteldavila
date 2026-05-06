// ============================================================
// PASTEL DA VILA — App Logic
// ============================================================

let cart = [];
let currentPayment = '';
let dadosCliente = {};

// ─── INICIALIZAÇÃO ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});

// ─── RENDER PRODUCTS ─────────────────────────────────────────
function renderProducts(filter = 'todos') {
  const grids = {
    salgados:  document.getElementById('grid-salgados'),
    doces:     document.getElementById('grid-doces'),
    especiais: document.getElementById('grid-especiais'),
  };

  Object.values(grids).forEach(g => (g.innerHTML = ''));

  PRODUCTS.forEach(p => {
    if (filter !== 'todos' && p.categoria !== filter) return;
    grids[p.categoria].appendChild(createProductCard(p));
  });

  ['salgados', 'doces', 'especiais'].forEach(cat => {
    const block = document.getElementById('cat-' + cat);
    if (filter !== 'todos' && filter !== cat) {
      block.classList.add('hidden');
    } else {
      block.classList.remove('hidden');
    }
  });
}

function createProductCard(p) {
  const div = document.createElement('div');
  div.className = 'product-card';
  div.innerHTML = `
    <div class="product-img-wrap">
      <img src="${p.img}" alt="${p.nome}" class="product-img" loading="lazy" />
      ${p.especial ? '<span class="especial-badge">Especial</span>' : ''}
    </div>
    <div class="product-info">
      <div class="product-name">${p.nome}</div>
      <div class="product-desc">${p.descricao}</div>
      <div class="product-footer">
        <span class="product-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
        <button class="add-btn" onclick="addToCart(${p.id})" title="Adicionar">+</button>
      </div>
    </div>
  `;
  return div;
}

// ─── CATEGORIA ───────────────────────────────────────────────
function filterCategory(cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderProducts(cat);
}

function scrollToMenu() {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// ─── CARRINHO ────────────────────────────────────────────────
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  flashCartBtn();
}

function removeFromCart(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  if (cart[idx].qty > 1) {
    cart[idx].qty--;
  } else {
    cart.splice(idx, 1);
  }
  updateCartUI();
}

function getTotal() {
  return cart.reduce((sum, i) => sum + i.preco * i.qty, 0) + (CONFIG.taxa_entrega || 0);
}

function fmtBRL(val) {
  return 'R$ ' + val.toFixed(2).replace('.', ',');
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-badge').textContent = count;
  document.getElementById('cart-badge-nav').textContent = count;

  const container = document.getElementById('cart-items');
  const footer    = document.getElementById('cart-footer');

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Seu carrinho está vazio</p>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-price">${fmtBRL(item.preco * item.qty)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="removeFromCart(${item.id})">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" onclick="addToCart(${item.id})">+</button>
      </div>
    </div>
  `).join('');

  document.getElementById('cart-total').textContent = fmtBRL(getTotal());
}

function flashCartBtn() {
  const btn = document.querySelector('.cart-float');
  if (!btn) return;
  btn.style.transform = 'scale(1.2)';
  setTimeout(() => (btn.style.transform = ''), 200);
}

function resetCart() {
  cart = [];
  currentPayment = '';
  dadosCliente = {};
  updateCartUI();
}

// ─── ABRIR / FECHAR CARRINHO ─────────────────────────────────
function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('active');
}

// ─── CHECKOUT ────────────────────────────────────────────────
function openCheckout() {
  if (cart.length === 0) return;
  closeCart();
  currentPayment = '';
  document.querySelectorAll('input[name="pagamento"]').forEach(r => (r.checked = false));
  const tb = document.getElementById('troco-block');
  if (tb) tb.style.display = 'none';
  showStep('step-dados');
  document.getElementById('checkout-overlay').classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkout-overlay').classList.remove('active');
}

function showStep(stepId) {
  document.querySelectorAll('.step').forEach(s => (s.style.display = 'none'));
  document.getElementById(stepId).style.display = 'block';
}

// ─── MÁSCARA TELEFONE / CEP ──────────────────────────────────
function maskPhone(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 11);
  if (v.length >= 7)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length >= 3) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length >= 1) v = `(${v}`;
  input.value = v;
}

function maskCep(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  input.value = v;
}

async function buscaCep() {
  const cep = document.getElementById('f-cep').value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  const loader = document.getElementById('cep-loading');
  if (loader) loader.style.display = 'inline';

  try {
    const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (data.erro) {
      alert('CEP não encontrado. Verifique e tente novamente.');
      return;
    }

    document.getElementById('f-rua').value    = data.logradouro || '';
    document.getElementById('f-bairro').value = data.bairro     || '';
    document.getElementById('f-cidade').value = `${data.localidade} — ${data.uf}`;
    document.getElementById('f-numero').focus();
  } catch (err) {
    alert('Erro ao buscar CEP. Verifique sua conexão.');
  } finally {
    if (loader) loader.style.display = 'none';
  }
}

// ─── STEP DADOS → PAGAMENTO ──────────────────────────────────
function goToPagamento() {
  const nome   = document.getElementById('f-nome').value.trim();
  const tel    = document.getElementById('f-tel').value.trim();
  const cep    = document.getElementById('f-cep').value.trim();
  const numero = document.getElementById('f-numero').value.trim();

  if (!nome || !tel || !cep || !numero) {
    alert('Preencha todos os campos obrigatórios (*)');
    return;
  }

  dadosCliente = {
    nome,
    telefone:    tel,
    cep,
    rua:         document.getElementById('f-rua').value,
    numero,
    complemento: document.getElementById('f-comp').value,
    bairro:      document.getElementById('f-bairro').value,
    cidade:      document.getElementById('f-cidade').value,
  };

  let resumoHTML = cart.map(i =>
    `<div class="summary-item">
      <span>${i.qty}x ${i.nome}</span>
      <span>${fmtBRL(i.preco * i.qty)}</span>
    </div>`
  ).join('');

  if (CONFIG.taxa_entrega > 0) {
    resumoHTML += `<div class="summary-item"><span>Entrega</span><span>${fmtBRL(CONFIG.taxa_entrega)}</span></div>`;
  }

  document.getElementById('summary-items').innerHTML = resumoHTML;
  document.getElementById('summary-total').textContent = fmtBRL(getTotal());

  showStep('step-pagamento');
}

function goToDados() {
  showStep('step-dados');
}

// ─── SELEÇÃO DE PAGAMENTO ────────────────────────────────────
function selectPayment(method) {
  currentPayment = method;
  const tb = document.getElementById('troco-block');
  if (tb) tb.style.display = method === 'dinheiro' ? 'block' : 'none';
}

// ─── CONFIRMAR → WHATSAPP ────────────────────────────────────
function confirmarPedido() {
  if (!currentPayment) {
    alert('Selecione uma forma de pagamento.');
    return;
  }
  enviarWhatsApp();
}

function enviarWhatsApp() {
  const troco = (document.getElementById('f-troco')?.value || '').trim();

  // Label do pagamento
  let payLabel = '';
  if (currentPayment === 'pix') {
    payLabel = 'PIX\n'
      + '  Chave: ' + CONFIG.pix_chave + '\n'
      + '  Por favor envie o comprovante apos o pagamento!';
  } else if (currentPayment === 'dinheiro') {
    payLabel = 'Dinheiro na entrega'
      + (troco ? '\n  Troco para: ' + troco : '');
  } else if (currentPayment === 'cartao') {
    payLabel = 'Cartao na entrega';
  }

  // Endereço
  const endereco =
    dadosCliente.rua + ', ' + dadosCliente.numero +
    (dadosCliente.complemento ? ', ' + dadosCliente.complemento : '') +
    ' - ' + dadosCliente.bairro + ', ' + dadosCliente.cidade +
    ' (CEP ' + dadosCliente.cep + ')';

  // Itens
  const itens = cart.map(i =>
    '  - ' + i.qty + 'x ' + i.nome + ' -- ' + fmtBRL(i.preco * i.qty)
  ).join('\n');

  // Mensagem
  const linhas = [
    '🥟 *Novo Pedido - Pastel da Vila*',
    '',
    '👤 *Cliente:* ' + dadosCliente.nome,
    '📱 *WhatsApp:* ' + dadosCliente.telefone,
    '',
    '📍 *Entrega:*',
    '  ' + endereco,
    '',
    '🛒 *Itens:*',
    itens,
    '',
    '💰 *Total: ' + fmtBRL(getTotal()) + '*',
    '',
    '💳 *Pagamento:* ' + payLabel,
    '',
    '_Pedido pelo site Pastel da Vila_',
  ];

  const msg    = linhas.join('\n');
  const numero = CONFIG.whatsapp.replace(/\D/g, '');
  const url    = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(msg);

  window.open(url, '_blank');
  showStep('step-confirmacao');
}

// ─── ESC para fechar ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
  }
});
