// header.js (versão robusta e dinâmica)
// Substitua completamente o arquivo atual por este.
document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("header");
  const userLogado = JSON.parse(localStorage.getItem("userLogado"));

  // --- Allow explicit override (optional)
  // If you set window.REPO_BASE = '/Assinatrack' in a page, it will be used.
  if (window.REPO_BASE && typeof window.REPO_BASE === "string") {
    window.REPO_BASE = window.REPO_BASE.replace(/\/+$/, ""); // trim trailing slash
  }

  // --- detect repoBase robustly ---
  function detectRepoBase() {
    if (window.REPO_BASE !== undefined) return window.REPO_BASE || "";

    const pathname =
      window.location && window.location.pathname
        ? window.location.pathname
        : "/";
    // If path includes "/codigo-fonte/" then repoBase is prefix before that
    const idx = pathname.indexOf("/codigo-fonte/");
    if (idx > 0) {
      return pathname.substring(0, idx).replace(/\/+$/, "");
    }
    // If path starts with /codigo-fonte, repo at root
    if (pathname.startsWith("/codigo-fonte/") || pathname === "/codigo-fonte") {
      return "";
    }
    // If on github pages (hostname endsWith github.io), first path part is repo name
    try {
      const host = window.location.hostname || "";
      if (host.endsWith("github.io")) {
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length > 0 && parts[0] !== "codigo-fonte") {
          return "/" + parts[0];
        }
      }
    } catch (e) {}
    return "";
  }

  const repoBase = detectRepoBase();
  const IMAGES = `${repoBase}/imagens`;
  const CODIGO = `${repoBase}/codigo-fonte`;

  // --- avatar ---
  let avatarHTML = "";
  if (userLogado) {
    const fotoSalva = localStorage.getItem(
      `usuario_${userLogado.id}_fotoPerfil`
    );
    const avatarSrc =
      fotoSalva && fotoSalva !== "null"
        ? fotoSalva
        : `${IMAGES}/user-avatar.png`;
    avatarHTML = `
      <img 
        id="miniAvatar"
        src="${avatarSrc}"
        class="avatar"
        alt="Foto do usuário"
      >
    `;
  }

  // --- menu e botões usando CODIGO ---
  const menu = `
    <li><a href="/Tela-SobreNos/SobreNos.html">Sobre nós</a></li>
    <li><a href="${CODIGO}/Home-Gabriel/home.html#como-funciona">Como funciona</a></li>
    <li><a data-protegido="true" href="${CODIGO}/MinhasAssinaturas/minhas-assinaturas.html">Minhas assinaturas</a></li>
    <li><a data-protegido="true" href="${CODIGO}/Tela-Notificacoes/notificacoes.html">Minhas notificações</a></li>
    <li><a href="${CODIGO}/PesquisaAssinaturas-Gabriel/index.html">Pesquisa assinaturas</a></li>
    <li><a href="${CODIGO}/Home-Gabriel/home.html#contato">Contato</a></li>
  `;

  const botoesDireita = userLogado
    ? `
      <a href="${CODIGO}/Meu-perfil-Douglas/perfil.html" class="perfil-btn">Meu Perfil</a>
      ${avatarHTML}
    `
    : `<a href="${CODIGO}/Login-Douglas/Login.html" class="perfil-btn">Entrar</a>`;

  headerContainer.innerHTML = `
    <header class="navbar">
      <div class="logo">
        <a href="${CODIGO}/Home-Gabriel/home.html">
          <img src="${IMAGES}/logoassinatrack.png" alt="Assinatrack Logo">
        </a>
      </div>

      <nav>
        <ul>${menu}</ul>
      </nav>

      <div class="profile-section">
        ${botoesDireita}
      </div>
    </header>

    <div id="modalLogin" class="modal-overlay" style="display:none;">
      <div class="modal-box">
        <button id="closeModalX" class="modal-close-x">✖</button>
        <h2>Você não está logado</h2>
        <p>Para acessar esta área, faça login ou crie uma conta gratuita.</p>
        <div class="modal-buttons">
          <a href="${CODIGO}/Login-Douglas/Login.html" class="modal-btn primary">Fazer Login</a>
          <a href="${CODIGO}/CriarConta-Hugo/index.html" class="modal-btn primary">Criar Conta</a>
        </div>
      </div>
    </div>
  `;

  // --- modal behavior ---
  const modal = document.getElementById("modalLogin");
  const modalBox = document.querySelector(".modal-box");
  const closeX = document.getElementById("closeModalX");
  function abrirModal() {
    if (modal) modal.style.display = "flex";
  }
  if (closeX)
    closeX.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  if (modalBox) modalBox.addEventListener("click", (e) => e.stopPropagation());
  if (modal)
    modal.addEventListener("click", (e) => {
      if (!modalBox.contains(e.target)) modal.style.display = "none";
    });

  // --- proteção de rotas ---
  document.querySelectorAll("a[data-protegido='true']").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (!userLogado) {
        e.preventDefault();
        abrirModal();
      }
    });
  });

  // --- smooth scroll for same-page hashes ---
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      try {
        const url = new URL(this.href, window.location.href);
        const hash = url.hash;
        if (hash && document.querySelector(hash)) {
          const destino = document.querySelector(hash);
          if (url.pathname === window.location.pathname) {
            e.preventDefault();
            destino.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } catch (err) {}
    });
  });
});
