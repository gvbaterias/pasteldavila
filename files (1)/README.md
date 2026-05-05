# 🥟 Pastel da Vila — Site de Delivery

Site de delivery com carrinho, checkout, CEP automático e **Pix real via Mercado Pago**.

---

## 📁 Estrutura do projeto

```
pastel-da-vila/
├── server.js           ← Backend Node.js (API + serve o site)
├── package.json
├── .env.example        ← Modelo das variáveis de ambiente
├── .gitignore
└── public/             ← Arquivos do site (HTML, CSS, JS, imagens)
    ├── index.html
    ├── css/style.css
    ├── js/
    │   ├── products.js  ← Cardápio e configurações
    │   └── app.js       ← Lógica do carrinho e checkout
    └── images/logo.png
```

---

## ⚙️ Configuração rápida

### 1. Cardápio e WhatsApp — edite public/js/products.js

```js
const CONFIG = {
  whatsapp: '5511999999999', // 55 + DDD + número
  pix_chave: 'seupix@email.com',
  taxa_entrega: 0,
};
```

### 2. Token do Mercado Pago

1. Acesse mercadopago.com.br/developers
2. Crie um app → Credenciais de produção → copie o Access Token

### 3. Crie o arquivo .env (nunca suba para o GitHub!)

```
MP_ACCESS_TOKEN=APP_USR-seu-token-aqui
```

---

## 🚀 Deploy GitHub + Render

```bash
git init && git add . && git commit -m "Pastel da Vila v1"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pastel-da-vila.git
git push -u origin main
```

No Render (render.com):
- New → Web Service → conecte o repositório
- Runtime: Node | Build: npm install | Start: npm start
- Em Environment Variables adicione: MP_ACCESS_TOKEN = seu token
- Create Web Service ✓

---

## 💳 Como funciona o Pix

Cliente escolhe Pix → frontend chama /api/criar-pix → backend chama MP com token seguro → QR Code real gerado → frontend verifica status a cada 5s → confirmação automática quando pago!

---

## 🛠️ Rodar local

```bash
npm install
cp .env.example .env   # preencha com seu token
npm run dev            # http://localhost:3000
```
