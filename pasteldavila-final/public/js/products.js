// ============================================================
// CARDÁPIO — Edite aqui para adicionar, remover ou alterar produtos
// ============================================================

const PRODUCTS = [
  // ── SALGADOS TRADICIONAIS ──────────────────────────────────
  {
    id: 1,
    categoria: 'salgados',
    img: 'images/sabores/carne.jpg',
    nome: 'Carne',
    descricao: 'Carne moída temperada na massa crocante — o clássico que nunca decepciona',
    preco: 15.00,
    especial: false,
  },
  {
    id: 2,
    categoria: 'salgados',
    img: 'images/sabores/queijo.jpg',
    nome: 'Queijo',
    descricao: 'Mussarela derretida dentro de uma massa leve e sequinha',
    preco: 15.00,
    especial: false,
  },
  {
    id: 3,
    categoria: 'salgados',
    img: 'images/sabores/frango.jpg',
    nome: 'Frango',
    descricao: 'Frango desfiado e temperado no ponto certo',
    preco: 15.00,
    especial: false,
  },
  {
    id: 4,
    categoria: 'salgados',
    img: 'images/sabores/pizza.jpg',
    nome: 'Pizza',
    descricao: 'Presunto, mussarela e tomate — sabor de pizza em forma de pastel',
    preco: 15.00,
    especial: false,
  },
  {
    id: 5,
    categoria: 'salgados',
    img: 'images/sabores/frango-cat.jpg',
    nome: 'Frango com Catupiry',
    descricao: 'Frango desfiado com catupiry cremoso — combinação perfeita',
    preco: 15.00,
    especial: false,
  },
  {
    id: 12,
    categoria: 'salgados',
    img: 'images/sabores/frango-cheddar.jpg',
    nome: 'Frango com Cheddar',
    descricao: 'Frango desfiado com cheddar cremoso — combinação irresistível',
    preco: 15.00,
    especial: false,
  },
  {
    id: 13,
    categoria: 'salgados',
    img: 'images/sabores/frango-queijo.jpg',
    nome: 'Frango com Queijo',
    descricao: 'Frango desfiado com mussarela derretida no ponto certo',
    preco: 15.00,
    especial: false,
  },
  {
    id: 14,
    categoria: 'salgados',
    img: 'images/sabores/carne-queijo.jpg',
    nome: 'Carne com Queijo',
    descricao: 'Carne moída temperada com mussarela derretida — clássico duplo',
    preco: 15.00,
    especial: false,
  },

  // ── ESPECIAIS ─────────────────────────────────────────────
  {
    id: 6,
    categoria: 'especiais',
    img: 'images/sabores/bacon-queijo.jpg',
    nome: 'Bacon com Queijo',
    descricao: 'Bacon crocante com queijo derretido — irresistível!',
    preco: 18.00,
    especial: true,
  },
  {
    id: 7,
    categoria: 'especiais',
    img: 'images/sabores/especial-casa.jpg',
    nome: 'Especial da Casa',
    descricao: 'Carne moída, queijo e bacon — o trio campeão da casa',
    preco: 18.00,
    especial: true,
  },
  {
    id: 8,
    categoria: 'especiais',
    img: 'images/sabores/especial-vila.jpg',
    nome: 'Especial da Vila',
    descricao: 'Frango desfiado, requeijão cremoso e tomate — leve e saboroso',
    preco: 18.00,
    especial: true,
  },
  {
    id: 9,
    categoria: 'especiais',
    img: 'images/sabores/bolonhesa.jpg',
    nome: 'Bolonhesa',
    descricao: 'Presunto, mussarela, carne moída e tomate — sabor italiano',
    preco: 18.00,
    especial: true,
  },

  // ── DOCES ─────────────────────────────────────────────────
  {
    id: 10,
    categoria: 'doces',
    img: 'images/sabores/chocolate.jpg',
    nome: 'Chocolate',
    descricao: 'Chocolate cremoso derretendo a cada mordida',
    preco: 18.00,
    especial: false,
  },
  {
    id: 11,
    categoria: 'doces',
    img: 'images/sabores/doce-leite.jpg',
    nome: 'Doce de Leite',
    descricao: 'Doce de leite na medida certa — puro conforto',
    preco: 18.00,
    especial: false,
  },
  {
    id: 15,
    categoria: 'doces',
    img: 'images/sabores/romeu-julieta.jpg',
    nome: 'Romeu e Julieta',
    descricao: 'Goiabada cremosa com queijo minas — o doce clássico brasileiro',
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
