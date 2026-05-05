// ============================================================
// PASTEL DA VILA — App Logic
// ============================================================

let cart = []; // { id, nome, preco, emoji, qty }
let currentPayment = '';
let dadosCliente = {};

// ─── INICIALIZAÇÃO ──────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});

// ─── RENDER PRODUCTS ────────────────────────────────────────

function renderProducts(filter = 'todos') {
  const grids = {
    salgados: document.getElementById('grid-salgados'),
    doces: document.getElementById('grid-doces'),
    especiais: document.getElementById('grid-especiais'),
  };

  Object.values(grids).forEach(g => (g.innerHTML = ''));

  PRODUCTS.forEach(p => {
    if (filter !== 'todos' && p.categoria !== filter) return;
    const el = createProductCard(p);
    grids[p.categoria].appendChild(el);
  });

  // Ocultar seções vazias
  ['salgados', 'doces', 'especiais'].forEach(cat => {
    const block = document.getElementById('cat-' + cat);
    const grid = grids[cat];
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
    <div class="product-emoji">
      ${p.emoji}
      ${p.especial ? '<span class="especial-badge">Especial</span>' : ''}
    </div>
    <div class="product-info">
      <div class="product-name">${p.nome}</div>
      <div class="product-desc">${p.descricao}</div>
      <div class="product-footer">
        <span class="product-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
        <button class="add-btn" onclick="addToCart(${p.id})" title="Adicionar ao carrinho">+</button>
      </div>
    </div>
  `;
  return div;
}

// ─── FILTRO DE CATEGORIA ─────────────────────────────────────

function filterCategory(cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderProducts(cat);
}

// ─── SCROLL ─────────────────────────────────────────────────

function scrollToMenu() {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// ─── CART ────────────────────────────────────────────────────

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
  const footer = document.getElementById('cart-footer');

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Seu carrinho está vazio 🥺</p>';
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
  btn.style.transform = 'scale(1.2)';
  setTimeout(() => (btn.style.transform = ''), 200);
}

function resetCart() {
  cart = [];
  updateCartUI();
}

// ─── CART OPEN/CLOSE ────────────────────────────────────────

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

// ─── DADOS / ENDEREÇO ────────────────────────────────────────

function maskPhone(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 11);
  if (v.length >= 7) {
    v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  } else if (v.length >= 3) {
    v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  } else if (v.length >= 1) {
    v = `(${v}`;
  }
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
  loader.style.display = 'inline';

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (data.erro) {
      alert('CEP não encontrado. Verifique e tente novamente.');
      return;
    }

    document.getElementById('f-rua').value = data.logradouro || '';
    document.getElementById('f-bairro').value = data.bairro || '';
    document.getElementById('f-cidade').value = data.localidade + ' — ' + data.uf || '';
    document.getElementById('f-numero').focus();
  } catch (err) {
    alert('Erro ao buscar CEP. Verifique sua conexão.');
  } finally {
    loader.style.display = 'none';
  }
}

function goToPagamento() {
  const nome = document.getElementById('f-nome').value.trim();
  const tel = document.getElementById('f-tel').value.trim();
  const cep = document.getElementById('f-cep').value.trim();
  const numero = document.getElementById('f-numero').value.trim();

  if (!nome || !tel || !cep || !numero) {
    alert('Preencha todos os campos obrigatórios (*)');
    return;
  }

  dadosCliente = {
    nome,
    telefone: tel,
    cep,
    rua: document.getElementById('f-rua').value,
    numero,
    complemento: document.getElementById('f-comp').value,
    bairro: document.getElementById('f-bairro').value,
    cidade: document.getElementById('f-cidade').value,
  };

  // Atualiza resumo
  document.getElementById('summary-items').innerHTML = cart.map(i =>
    `<div class="summary-item">
      <span>${i.qty}x ${i.nome}</span>
      <span>${fmtBRL(i.preco * i.qty)}</span>
    </div>`
  ).join('');

  if (CONFIG.taxa_entrega > 0) {
    document.getElementById('summary-items').innerHTML +=
      `<div class="summary-item"><span>Entrega</span><span>${fmtBRL(CONFIG.taxa_entrega)}</span></div>`;
  }

  document.getElementById('summary-total').textContent = fmtBRL(getTotal());

  showStep('step-pagamento');
}

function goToDados() {
  showStep('step-dados');
}

// ─── PAGAMENTO ───────────────────────────────────────────────

function selectPayment(method) {
  currentPayment = method;
  document.getElementById('troco-block').style.display =
    method === 'dinheiro' ? 'block' : 'none';
}

async function confirmarPedido() {
  if (!currentPayment) {
    alert('Selecione uma forma de pagamento.');
    return;
  }

  if (currentPayment === 'pix') {
    await iniciarPix();
  } else {
    // Dinheiro / Cartão — confirma direto e manda WhatsApp
    showStep('step-confirmacao');
    // Não chama WhatsApp automaticamente, só quando o usuário clicar
  }
}

// ─── PIX / MERCADO PAGO ──────────────────────────────────────

let pixPaymentId = null; // guarda o ID para polling de status
let pixPollingTimer = null;

async function iniciarPix() {
  const total = getTotal();
  document.getElementById('pix-value').textContent = fmtBRL(total);
  document.getElementById('pix-key-display').textContent = '⏳ Gerando Pix...';
  showStep('step-pix');

  try {
    const res = await fetch('/api/criar-pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total: total,
        nome: dadosCliente.nome,
        email: dadosCliente.email || 'cliente@pasteldavila.com.br',
        pedido: cart.map(i => ({ nome: i.nome, qty: i.qty })),
      }),
    });

    const data = await res.json();

    if (!res.ok || data.erro) {
      alert('Erro ao gerar Pix: ' + (data.erro || 'Tente novamente'));
      showStep('step-pagamento');
      return;
    }

    pixPaymentId = data.id;

    // Atualiza QR Code com imagem real do Mercado Pago
    if (data.qr_code_base64) {
      document.querySelector('#qr-code-area img').src =
        'data:image/png;base64,' + data.qr_code_base64;
    }

    // Atualiza código copia-e-cola
    if (data.qr_code) {
      document.getElementById('pix-key-display').textContent = data.qr_code;
    }

    // Inicia polling automático de status (verifica a cada 5 segundos)
    iniciarPollingPix(data.id);

  } catch (err) {
    console.error('Erro ao criar Pix:', err);
    alert('Não foi possível conectar ao servidor. Tente novamente.');
    showStep('step-pagamento');
  }
}

function iniciarPollingPix(paymentId) {
  if (pixPollingTimer) clearInterval(pixPollingTimer);

  pixPollingTimer = setInterval(async () => {
    try {
      const res = await fetch(`/api/status-pix/${paymentId}`);
      const data = await res.json();

      if (data.status === 'approved') {
        clearInterval(pixPollingTimer);
        // Pagamento confirmado automaticamente!
        mostrarPagamentoConfirmado();
      } else if (data.status === 'cancelled' || data.status === 'rejected') {
        clearInterval(pixPollingTimer);
        alert('Pagamento cancelado ou expirado. Por favor, tente novamente.');
        showStep('step-pagamento');
      }
    } catch (err) {
      // silencia erros de polling para não atrapalhar o usuário
    }
  }, 5000); // verifica a cada 5 segundos

  // Para o polling após 10 minutos (Pix expira)
  setTimeout(() => clearInterval(pixPollingTimer), 10 * 60 * 1000);
}

function mostrarPagamentoConfirmado() {
  // Atualiza a tela Pix para mostrar confirmação visual
  const pixContainer = document.querySelector('.pix-container');
  if (pixContainer) {
    pixContainer.innerHTML = `
      <div class="confirm-icon" style="font-size:4rem;margin-bottom:1rem">✅</div>
      <h3 style="font-family:'Playfair Display',serif;color:var(--marrom);margin-bottom:.5rem">Pix Aprovado!</h3>
      <p style="color:var(--texto-suave);margin-bottom:1.5rem">Pagamento confirmado! Seu pedido já está sendo preparado.</p>
      <button class="btn-whatsapp full" onclick="enviarWhatsApp()">
        📱 Acompanhar pelo WhatsApp
      </button>
    `;
  }
}

function copyPix() {
  const key = document.getElementById('pix-key-display').textContent;
  navigator.clipboard.writeText(key).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copiado!';
    setTimeout(() => (btn.textContent = 'Copiar'), 2000);
  });
}

// ─── WHATSAPP ────────────────────────────────────────────────

function enviarWhatsApp() {
  const troco = document.getElementById('f-troco')?.value || '';
  const payLabel = {
    pix: '✅ Pix (pago online)',
    dinheiro: `💵 Dinheiro${troco ? ' — troco para ' + troco : ''}`,
    cartao: '💳 Cartão na entrega',
  }[currentPayment] || currentPayment;

  const endereço =
    `${dadosCliente.rua}, ${dadosCliente.numero}` +
    (dadosCliente.complemento ? `, ${dadosCliente.complemento}` : '') +
    ` — ${dadosCliente.bairro}, ${dadosCliente.cidade} (CEP ${dadosCliente.cep})`;

  const itens = cart.map(i => `  • ${i.qty}x ${i.nome} — ${fmtBRL(i.preco * i.qty)}`).join('\n');

  const msg = [
    `🥟 *Novo Pedido — Pastel da Vila*`,
    ``,
    `👤 *Cliente:* ${dadosCliente.nome}`,
    `📱 *WhatsApp:* ${dadosCliente.telefone}`,
    ``,
    `📍 *Endereço de entrega:*`,
    endereço,
    ``,
    `🛒 *Itens:*`,
    itens,
    ``,
    `💰 *Total:* ${fmtBRL(getTotal())}`,
    `💳 *Pagamento:* ${payLabel}`,
    ``,
    `_Pedido enviado pelo site_`,
  ].join('\n');

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showStep('step-confirmacao');
}

// ─── ESC para fechar ────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
  }
});
