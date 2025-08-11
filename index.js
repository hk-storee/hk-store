<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Loja PIX - Demo com Admin Melhorado</title>
  <style>
    :root{--accent:#0b84ff;--muted:#666}
    body{font-family:Inter,Segoe UI,Arial;margin:0;background:#f5f7fb;color:#111}
    header{background:white;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 6px rgba(0,0,0,.06)}
    .brand{font-weight:700;font-size:18px;color:var(--accent)}
    .container{max-width:1100px;margin:24px auto;padding:0 16px}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
    .card{background:white;padding:12px;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
    img{max-width:100%;border-radius:8px}
    .product-title{font-weight:600;margin:6px 0}
    .muted{color:var(--muted);font-size:14px}
    .btn{display:inline-block;padding:8px 12px;border-radius:8px;background:var(--accent);color:white;text-decoration:none;cursor:pointer;border:none}
    .btn.ghost{background:transparent;color:var(--accent);border:1px solid rgba(11,132,255,.12)}
    .top-actions{display:flex;gap:8px;align-items:center}
    aside{position:fixed;right:18px;top:78px;width:320px;max-height:80vh;overflow-y:auto}
    .cart{background:white;padding:12px;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.08)}
    .cart h3{margin:0 0 8px 0}
    .row{display:flex;align-items:center;justify-content:space-between}
    label{display:block;margin:8px 0 4px}
    input,select,textarea,button{width:100%;padding:8px;border-radius:8px;border:1px solid #e6e9ef;box-sizing:border-box;font-size:14px}
    input[type=number]{width:auto;padding:6px}
    .admin-panel{margin-top:18px;background:#fff;padding:16px;border-radius:10px;box-shadow:0 1px 6px rgba(0,0,0,.1)}
    .small{font-size:13px;color:#666}
    footer{text-align:center;color:#999;padding:28px 12px}
    .product-row{display:flex;gap:6px;align-items:center;margin-bottom:6px}
    .product-row > input[type=text], .product-row > input[type=number]{flex:1}
    .product-row button{width:auto;padding:6px 10px;font-size:13px}
    .login-panel label, .login-panel input{width:100%}
    .login-panel button{margin-top:12px}
    @media (max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}aside{position:static;width:auto;margin-top:16px;max-height:none;overflow:auto}}
    @media (max-width:600px){.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <header>
    <div class="brand">HK STORE — Loja PIX (Demo)</div>
    <div class="top-actions">
      <div class="small">Modo: <strong id="modeLabel">Visão pública</strong></div>
      <button class="btn ghost" id="btnAdminToggle">Entrar como Admin</button>
    </div>
  </header>

  <main class="container">
    <section>
      <div class="row" style="margin-bottom:12px">
        <h2>Produtos</h2>
        <div class="small">Adicione ao carrinho e realize o pagamento via PIX</div>
      </div>
      <div id="products" class="grid"></div>
    </section>

    <aside>
      <div class="cart">
        <h3>Carrinho</h3>
        <div id="cartList"></div>
        <div class="row" style="margin-top:8px"><strong>Total:</strong><strong id="totalValue">R$ 0,00</strong></div>
        <div style="margin-top:12px">
          <label for="customerName">Nome (opcional)</label>
          <input id="customerName" placeholder="Nome do comprador" />
          <label for="customerNote">Observação</label>
          <textarea id="customerNote" rows="2" placeholder="Ex: pedido para entrega"></textarea>
          <button class="btn" id="btnCheckout" style="margin-top:8px" >Gerar PIX</button>
        </div>
        <div id="pixArea" style="display:none;margin-top:12px"></div>
      </div>

      <div class="admin-panel" id="adminPanel" style="display:none;">
        <!-- Login -->
        <div class="login-panel" id="loginPanel">
          <h4>Login Admin</h4>
          <label for="loginUser">Usuário</label>
          <input type="text" id="loginUser" placeholder="Usuário" autocomplete="username" />
          <label for="loginPass">Senha</label>
          <input type="password" id="loginPass" placeholder="Senha" autocomplete="current-password" />
          <button id="btnLogin" class="btn">Entrar</button>
        </div>

        <!-- Painel admin depois do login -->
        <div id="adminContent" style="display:none;">
          <h4>Painel Admin</h4>
          <label>Chave PIX</label>
          <input id="pixKey" placeholder="chavepix@exemplo.com" />
          <label>Nome do Recebedor</label>
          <input id="receiverName" placeholder="Nome/Empresa" />
          <button class="btn ghost" id="btnSaveStoreCfg" style="margin-bottom:12px">Salvar Configurações</button>

          <h5>Produtos</h5>
          <div id="adminProductsList"></div>

          <h5 style="margin-top:12px">Adicionar produto</h5>
          <label>Nome do produto</label>
          <input id="pName" placeholder="Nome do produto" />
          <label>Preço (R$)</label>
          <input id="pPrice" placeholder="12.50" />
          <label>Quantidade em estoque</label>
          <input id="pStock" placeholder="10" />
          <label>URL da imagem (opcional)</label>
          <input id="pImage" placeholder="https://...jpg" />
          <button class="btn" id="btnAddProduct" style="margin-top:8px">Adicionar Produto</button>
          <button class="btn ghost" id="btnLogoutAdmin" style="margin-top:16px">Sair do Admin</button>
        </div>
      </div>
    </aside>
  </main>

  <footer> Salve este arquivo como <code>index.html</code>. Para publicar: GitHub Pages ou qualquer host estático. </footer>

<script>
// ======= armazenamento local e estado =======
const LS_PRODUCTS = 'hk_products_v2'
const LS_CART = 'hk_cart_v1'
const LS_STORE = 'hk_store_cfg_v1'
const LS_ADMIN = 'hk_admin_logged_in'
let products = JSON.parse(localStorage.getItem(LS_PRODUCTS) || 'null') || [
  {id:1,name:'Caneca HK',price:20.00,stock:8,image:''},
  {id:2,name:'Camiseta HK',price:45.50,stock:5,image:''},
  {id:3,name:'Adesivo HK',price:3.99,stock:50,image:''}
]
let cart = JSON.parse(localStorage.getItem(LS_CART) || '[]')
let storeCfg = JSON.parse(localStorage.getItem(LS_STORE) || 'null') || {pixKey:'franggg78@gmail.com',receiverName:'HK STORE'}
let isAdmin = localStorage.getItem(LS_ADMIN) === 'true'
const adminUser = 'admin'
const adminPassword = 'admin123'
const currency = v=> 'R$ '+Number(v).toFixed(2).replace('.',',')

// ======= render =======
function renderProducts(){
  const el = document.getElementById('products'); el.innerHTML=''
  products.forEach(p=>{
    const div = document.createElement('div'); div.className='card'
    div.innerHTML = `
      <div style="height:140px;display:flex;align-items:center;justify-content:center;background:#fbfdff;border-radius:8px;overflow:hidden;margin-bottom:8px">
        ${p.image?`<img src="${p.image}" alt="${p.name}" style="height:100%;object-fit:cover">`:'<div class="muted">Sem imagem</div>'}
      </div>
      <div class="product-title">${p.name}</div>
      <div class="muted">${currency(p.price)} • Estoque: <strong>${p.stock}</strong></div>
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
        <input type="number" min="1" max="${p.stock}" value="1" style="width:72px;padding:6px;border-radius:8px;border:1px solid #e6e9ef" id="q_${p.id}">
        <button class="btn" onclick="addToCart(${p.id})">Adicionar</button>
        <button class="btn ghost" onclick="viewProduct(${p.id})">Detalhes</button>
      </div>
    `
    el.appendChild(div)
  })
}

function renderCart(){
  const el = document.getElementById('cartList'); el.innerHTML=''
  if(cart.length===0){el.innerHTML='<div class="small">Seu carrinho está vazio</div>'; document.getElementById('totalValue').innerText=currency(0); return}
  let total=0
  cart.forEach(item=>{
    const p = products.find(x=>x.id===item.id)
    if(!p) return
    const row = document.createElement('div'); row.style.marginBottom='8px'
    row.innerHTML = `
      <div class="row">
        <div style="flex:1">
          <div style="font-weight:600">${p.name}</div>
          <div class="small">${currency(p.price)} x ${item.qty}</div>
        </div>
        <div style="text-align:right">
          <div>${currency(p.price*item.qty)}</div>
          <div style="margin-top:6px"><button class="btn ghost" onclick="removeFromCart(${item.id})">Remover</button></div>
        </div>
      </div>
    `
    el.appendChild(row)
    total += p.price * item.qty
  })
  document.getElementById('totalValue').innerText = currency(total)
}

// ======= ações cart =======
function addToCart(id){
  const qtyInput = document.getElementById('q_'+id)
  let qty = Number(qtyInput?.value || 1)
  if(qty<=0) qty=1
  const p = products.find(x=>x.id===id)
  if(!p) return alert('Produto não encontrado')
  if(qty>p.stock) return alert('Quantidade maior que o estoque')
  const exists = cart.find(x=>x.id===id)
  if(exists){
    if(exists.qty + qty > p.stock) return alert('Estoque insuficiente')
    exists.qty += qty
  } else cart.push({id,qty})
  persistCart(); renderCart()
}

function removeFromCart(id){ cart = cart.filter(x=>x.id!==id); persistCart(); renderCart() }

function persistCart(){ localStorage.setItem(LS_CART, JSON.stringify(cart)) }

// ======= checkout / PIX =======
function gerarTextoPIX(amount, key, receiver, reference){
  return `Pagamento via PIX\nChave: ${key}\nRecebedor: ${receiver}\nValor: R$ ${Number(amount).toFixed(2)}\nReferência: ${reference}`
}

function generatePIXQr(data){
  const url = 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=' + encodeURIComponent(data)
  return url
}

function checkoutPrepare(){
  if(cart.length===0) return alert('Carrinho vazio')
  const total = cart.reduce((s,it)=>{
    const p = products.find(x=>x.id===it.id); return s + (p? p.price*it.qty:0)
  },0)
  const key = storeCfg.pixKey || ''
  const receiver = storeCfg.receiverName || ''
  const reference = 'PED-' + Date.now()
  const text = gerarTextoPIX(total, key, receiver, reference)
  const qr = generatePIXQr(text)
  const area = document.getElementById('pixArea')
  area.style.display='block'
  area.innerHTML = `
    <div style="text-align:center">
      <div style="font-weight:600">Pagar com PIX</div>
      <img src="${qr}" alt="QR PIX" style="margin:8px 0;border-radius:8px">
      <div class="small">Chave: <strong>${key}</strong></div>
      <div class="small">Valor: <strong>${currency(total)}</strong></div>
      <div class="small">Referência: <strong>${reference}</strong></div>
      <div style="margin-top:8px"><button class="btn" onclick="copiarTexto('${escapeHtml(text)}')">Copiar instruções</button></div>
      <div style="margin-top:8px" class="small">Depois de pagar, confirme manualmente o pedido com o vendedor (este demo não faz conciliação automática).</div>
    </div>
  `
}

function copiarTexto(t){ const textarea = document.createElement('textarea'); textarea.value = unescapeHtml(t); document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); textarea.remove(); alert('Instruções copiadas para a área de transferência') }

function escapeHtml(s){ return s.replace(/'/g, "\\'").replace(/\n/g,'\\n') }
function unescapeHtml(s){ return s }

// ======= admin =======
function renderAdminProducts(){
  const el = document.getElementById('adminProductsList')
  el.innerHTML = ''
  if(products.length === 0){
    el.innerHTML = '<div class="small">Nenhum produto cadastrado.</div>'
    return
  }
  products.forEach(p=>{
    const row = document.createElement('div')
    row.className = 'product-row'
    row.innerHTML = `
      <input type="text" value="${p.name}" id="admName_${p.id}" placeholder="Nome" />
      <input type="number" step="0.01" min="0" value="${p.price}" id="admPrice_${p.id}" placeholder="Preço" style="max-width:80px" />
      <input type="number" min="0" value="${p.stock}" id="admStock_${p.id}" placeholder="Estoque" style="max-width:70px" />
      <input type="text" value="${p.image}" id="admImage_${p.id}" placeholder="URL da imagem" />
      <button class="btn ghost" onclick="updateProduct(${p.id})" title="Salvar">Salvar</button>
      <button class="btn ghost" style="color:#d00;border-color:#d00" onclick="deleteProduct(${p.id})" title="Excluir">Excluir</button>
    `
    el.appendChild(row)
  })
}

function updateProduct(id){
  const name = document.getElementById('admName_'+id).value.trim()
  const price = parseFloat(document.getElementById('admPrice_'+id).value.replace(',','.'))
  const stock = parseInt(document.getElementById('admStock_'+id).value)
  const image = document.getElementById('admImage_'+id).value.trim()
  if(!name || isNaN(price) || isNaN(stock)){
    alert('Preencha nome, preço e estoque corretamente para salvar.')
    return
  }
  const prodIndex = products.findIndex(p=>p.id===id)
  if(prodIndex === -1) return alert('Produto não encontrado')
  products[prodIndex] = {id, name, price, stock, image}
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(products))
  renderProducts()
  renderAdminProducts()
  alert('Produto atualizado.')
}

function deleteProduct(id){
  if(!confirm('Tem certeza que deseja excluir este produto?')) return
  products = products.filter(p=>p.id!==id)
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(products))
  renderProducts()
  renderAdminProducts()
  alert('Produto excluído.')
}

function toggleAdmin(){
  if(!isAdmin){
    showLoginPanel()
  } else {
    logoutAdmin()
  }
}

function showLoginPanel(){
  document.getElementById('loginPanel').style.display = 'block'
  document.getElementById('adminContent').style.display = 'none'
  document.getElementById('adminPanel').style.display = 'block'
}

function loginAdmin(){
  const user = document.getElementById('loginUser').value.trim()
  const pass = document.getElementById('loginPass').value
  if(user === adminUser && pass === adminPassword){
    isAdmin = true
    localStorage.setItem(LS_ADMIN, 'true')
    document.getElementById('modeLabel').innerText = 'Admin'
    document.getElementById('loginUser').value = ''
    document.getElementById('loginPass').value = ''
    document.getElementById('loginPanel').style.display = 'none'
    document.getElementById('adminContent').style.display = 'block'
    renderAdminProducts()
    loadAdminValues()
    document.getElementById('btnAdminToggle').innerText = 'Painel
