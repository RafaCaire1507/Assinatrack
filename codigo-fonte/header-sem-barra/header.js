// Substitua o conteúdo do seu header.js por ESTE
document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("header");
  const userLogado = JSON.parse(localStorage.getItem("userLogado"));

  // --- Detecta base do repo (project page) ---
  // Se a URL for /Assinatrack/..., pathParts[0] = 'Assinatrack' -> repoBase = '/Assinatrack'
  // Se a URL for /codigo-fonte/... (p.ex. local ou user page raiz), repoBase = ''
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  let repoBase = "";
  if (pathParts.length > 0 && pathParts[0] !== "codigo-fonte") {
    // possivelmente /REPO/...
    repoBase = "/" + pathParts[0];
  } else {
    repoBase = "";
  }

  const IMAGES = `${repoBase}/imagens`;
  const CODIGO = `${repoBase}/codigo-fonte`;

  // --- avatar (mantive sua lógica) ---
  let avatarHTML = "";
  if (userLogado) {
    const fotoSalva = localStorage.getItem(
      `usuario_${userLogado.id}_fotoPerfil`
    );
    avatarHTML = `
      <img 
        id="miniAvatar"
        src="${
          fotoSalva && fotoSalva !== "null"
            ? fotoSalva
            : `${IMAGES}/user-avatar.png`
        }"
        class="avatar"
        alt="Foto do usuário"
      >
    `;
  }

  // --- menu de links usando CODIGO como base ---
  const menu = `
    <li><a href="${CODIGO}/Tela-SobreNos/SobreNos.html">Sobre nós</a></li>
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

    <!-- MODAL LOGIN -->
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

  // --- modal logic ---
  const modal = document.getElementById("modalLogin");
  const modalBox = document.querySelector(".modal-box");
  const closeX = document.getElementById("closeModalX");

  function abrirModal() {
    modal.style.display = "flex";
  }

  if (closeX) {
    closeX.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (modalBox) {
    modalBox.addEventListener("click", (e) => e.stopPropagation());
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (!modalBox.contains(e.target)) {
        modal.style.display = "none";
      }
    });
  }

  // --- proteção de links (rota protegida) ---
  document.querySelectorAll("a[data-protegido='true']").forEach((link) => {
    link.addEventListener("click", function (e) {
      const currentUser = JSON.parse(localStorage.getItem("userLogado"));
      if (!currentUser) {
        e.preventDefault();
        abrirModal();
      }
    });
  });

  // --- smooth scroll para hashes (mantive sua lógica) ---
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      // cria URL baseada em this.href (funciona com absolute ou relative)
      const url = new URL(this.href, window.location.href);
      const hash = url.hash;

      if (hash && document.querySelector(hash)) {
        const destino = document.querySelector(hash);

        if (url.pathname === window.location.pathname) {
          e.preventDefault();
          destino.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
});
