// ============================================================
// CARDÁPIO — Edite aqui para adicionar, remover ou alterar produtos
// ============================================================

const PRODUCTS = [
  // ── SALGADOS TRADICIONAIS ──────────────────────────────────
  {
    id: 1,
    categoria: 'salgados',
    img: 'images/sabores/carne.svg',
    nome: 'Carne',
    descricao: 'Carne moída temperada na massa crocante — o clássico que nunca decepciona',
    preco: 15.00,
    especial: false,
  },
  {
    id: 2,
    categoria: 'salgados',
    img: 'images/sabores/queijo.svg',
    nome: 'Queijo',
    descricao: 'Mussarela derretida dentro de uma massa leve e sequinha',
    preco: 15.00,
    especial: false,
  },
  {
    id: 3,
    categoria: 'salgados',
    img: 'images/sabores/frango.svg',
    nome: 'Frango',
    descricao: 'Frango desfiado e temperado no ponto certo',
    preco: 15.00,
    especial: false,
  },
  {
    id: 4,
    categoria: 'salgados',
    img: 'images/sabores/pizza.svg',
    nome: 'Pizza',
    descricao: 'Presunto, mussarela e tomate — sabor de pizza em forma de pastel',
    preco: 15.00,
    especial: false,
  },
  {
    id: 5,
    categoria: 'salgados',
    img: 'images/sabores/frango-cat.svg',
    nome: 'Frango com Catupiry',
    descricao: 'Frango desfiado com catupiry cremoso — combinação perfeita',
    preco: 15.00,
    especial: false,
  },
  {
    id: 6,
    categoria: 'salgados',
    img: 'images/sabores/bacon-queijo.svg',
    nome: 'Bacon com Queijo',
    descricao: 'Bacon crocante com queijo derretido — irresistível!',
    preco: 15.00,
    especial: false,
  },

  // ── ESPECIAIS ─────────────────────────────────────────────
  {
    id: 7,
    categoria: 'especiais',
    img: 'images/sabores/especial-casa.svg',
    nome: 'Especial da Casa',
    descricao: 'Carne moída, queijo e bacon — o trio campeão da casa',
    preco: 18.00,
    especial: true,
  },
  {
    id: 8,
    categoria: 'especiais',
    img: 'images/sabores/especial-vila.svg',
    nome: 'Especial da Vila',
    descricao: 'Frango desfiado, requeijão cremoso e tomate — leve e saboroso',
    preco: 18.00,
    especial: true,
  },
  {
    id: 9,
    categoria: 'especiais',
    img: 'images/sabores/bolonhesa.svg',
    nome: 'Bolonhesa',
    descricao: 'Presunto, mussarela, carne moída e tomate — sabor italiano',
    preco: 18.00,
    especial: true,
  },

  // ── DOCES ─────────────────────────────────────────────────
  {
    id: 10,
    categoria: 'doces',
    img: 'images/sabores/chocolate.svg',
    nome: 'Chocolate',
    descricao: 'Chocolate cremoso derretendo a cada mordida',
    preco: 18.00,
    especial: false,
  },
  {
    id: 11,
    categoria: 'doces',
    img: 'images/sabores/doce-leite.svg',
    nome: 'Doce de Leite',
    descricao: 'Doce de leite na medida certa — puro conforto',
    preco: 18.00,
    especial: false,
  },
];

// ── CONFIGURAÇÕES DA LOJA ─────────────────────────────────────
const CONFIG = {
  whatsapp: '5543988623313',
  pix_chave: '43988623313',
  taxa_entrega: 0,
};
