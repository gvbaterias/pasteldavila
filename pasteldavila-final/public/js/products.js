// ============================================================
// CARDÁPIO — Edite aqui para adicionar, remover ou alterar produtos
// ============================================================

const PRODUCTS = [
  // ── SALGADOS TRADICIONAIS ──────────────────────────────────
  {
    id: 1,
    categoria: 'salgados',
    emoji: '🥩',
    nome: 'Carne',
    descricao: 'Carne moída temperada na massa crocante — o clássico que nunca decepciona',
    preco: 12.00,
    especial: false,
  },
  {
    id: 2,
    categoria: 'salgados',
    emoji: '🧀',
    nome: 'Queijo',
    descricao: 'Mussarela derretida dentro de uma massa leve e sequinha',
    preco: 12.00,
    especial: false,
  },
  {
    id: 3,
    categoria: 'salgados',
    emoji: '🐔',
    nome: 'Frango',
    descricao: 'Frango desfiado e temperado no ponto certo',
    preco: 12.00,
    especial: false,
  },
  {
    id: 4,
    categoria: 'salgados',
    emoji: '🍕',
    nome: 'Pizza',
    descricao: 'Presunto, mussarela e tomate — sabor de pizza em forma de pastel',
    preco: 12.00,
    especial: false,
  },
  {
    id: 5,
    categoria: 'salgados',
    emoji: '🐔',
    nome: 'Frango com Catupiry',
    descricao: 'Frango desfiado com catupiry cremoso — combinação perfeita',
    preco: 12.00,
    especial: false,
  },
  {
    id: 6,
    categoria: 'salgados',
    emoji: '🥓',
    nome: 'Bacon com Queijo',
    descricao: 'Bacon crocante com queijo derretido — irresistível!',
    preco: 12.00,
    especial: false,
  },

  // ── ESPECIAIS ─────────────────────────────────────────────
  {
    id: 7,
    categoria: 'especiais',
    emoji: '🏆',
    nome: 'Especial da Casa',
    descricao: 'Carne moída, queijo e bacon — o trio campeão da casa',
    preco: 15.00,
    especial: true,
  },
  {
    id: 8,
    categoria: 'especiais',
    emoji: '⭐',
    nome: 'Especial da Vila',
    descricao: 'Frango desfiado, requeijão cremoso e tomate — leve e saboroso',
    preco: 15.00,
    especial: true,
  },
  {
    id: 9,
    categoria: 'especiais',
    emoji: '🍝',
    nome: 'Bolonhesa',
    descricao: 'Presunto, mussarela, carne moída e tomate — sabor italiano',
    preco: 15.00,
    especial: true,
  },

  // ── DOCES ─────────────────────────────────────────────────
  {
    id: 10,
    categoria: 'doces',
    emoji: '🍫',
    nome: 'Chocolate',
    descricao: 'Chocolate cremoso derretendo a cada mordida',
    preco: 15.00,
    especial: false,
  },
  {
    id: 11,
    categoria: 'doces',
    emoji: '🍮',
    nome: 'Doce de Leite',
    descricao: 'Doce de leite na medida certa — puro conforto',
    preco: 15.00,
    especial: false,
  },
];

// Configurações da loja — edite aqui
const CONFIG = {
  nome_loja: 'Pastel da Vila',
  whatsapp: '5543988623313', // formato: 55 + DDD + número
  pix_chave: '43988623313', // sua chave Pix real
  pix_nome: 'Guilherme Lucas Silva', // nome que aparece no Pix
  // Mercado Pago: access_token do sua conta (produção)
  // Coloque seu token real aqui para habilitar o QR Code real
  mp_access_token: 'APP_USR-5657632982266420-050419-6c892445b15a10736554990c22bca1e6-3330298292', // ex: 'APP_USR-...'
  taxa_entrega: 0, // 0 = grátis. Ex: 5.00 para R$ 5,00
};
