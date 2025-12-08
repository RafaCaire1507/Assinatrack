// header.js (versão robusta para project pages / raiz / codigo-fonte)
document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("header");
  const userLogado = JSON.parse(localStorage.getItem("userLogado"));

  // --- detecta repoBase de forma mais robusta ---
  // se pathname contiver "/codigo-fonte/", repoBase = parte antes de "/codigo-fonte"
  // ex: "/Assinatrack/codigo-fonte/Home-Gabriel/home.html" -> repoBase = "/Assinatrack"
  // se pathname começar por "/codigo-fonte", repoBase = ""
  const pathname = window.location.pathname || "/";
  let repoBase = "";
  const codigoIndex = pathname.indexOf("/codigo-fonte/");
  if (codigoIndex > 0) {
    repoBase = pathname.substring(0, codigoIndex); // inclui leading slash
  } else if (
    pathname.startsWith("/codigo-fonte/") ||
    pathname === "/codigo-fonte"
  ) {
    repoBase = "";
  } else {
    // fallback: se a primeira parte não for "codigo-fonte", pode ser projeto em root (/Assinatrack/...)
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length && parts[0] !== "codigo-fonte") {
      repoBase = "/" + parts[0];
    } else {
      repoBase = "";
    }
  }

  // normaliza (remove trailing slash)
  if (repoBase.endsWith("/")) repoBase = repoBase.slice(0, -1);

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

  // --- menu com links construídos a partir de CODIGO (garante que apontam para /REPO/codigo-fonte/...) ---
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

  // --- modal behavior ---
  const modal = document.getElementById("modalLogin");
  const modalBox = document.querySelector(".modal-box");
  const closeX = document.getElementById("closeModalX");

  function abrirModal() {
    if (modal) modal.style.display = "flex";
  }

  if (closeX)
    closeX.addEventListener("click", () => {
      modal.style.display = "none";
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
      } catch (err) {
        // se this.href não for um URL completo, fallback: deixa o link agir normalmente
      }
    });
  });
});
