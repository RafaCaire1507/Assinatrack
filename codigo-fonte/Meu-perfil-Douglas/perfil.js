const userLogado = JSON.parse(localStorage.getItem("userLogado"));

if (!userLogado) {
  alert("Você precisa estar logado para acessar o perfil.");
  window.location.href = "/codigo-fonte/Login-Douglas/Login.html";
}

const userID = userLogado.id;

const fotoPerfil = document.getElementById("fotoPerfil");
const miniAvatar = document.getElementById("miniAvatar");
const miniPlaceholder = document.querySelector(".mini-avatar-placeholder");
const avatarPlaceholder = document.querySelector(".avatar-placeholder");
const fotoInput = document.getElementById("fotoInput");
const avatarWrapper = document.getElementById("avatarWrapper");
const salvarBtn = document.getElementById("salvarBtn");
const deletarContaBtn = document.getElementById("deletarContaBtn");
const nomeDisplay = document.getElementById("nomeDisplay");

avatarWrapper.addEventListener("click", () => fotoInput.click());

fotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const imageData = reader.result;

    fotoPerfil.src = imageData;
    fotoPerfil.style.display = "block";
    avatarPlaceholder.style.display = "none";

    if (miniAvatar) {
      miniAvatar.src = imageData;
      miniAvatar.style.display = "block";
      miniPlaceholder.style.display = "none";
    }

    localStorage.setItem(`usuario_${userID}_fotoPerfil`, imageData);

    atualizarConclusaoPerfil();
  };

  reader.readAsDataURL(file);
});

function removerFotoPerfil() {
  localStorage.removeItem(`usuario_${userID}_fotoPerfil`);

  fotoPerfil.style.display = "none";
  avatarPlaceholder.style.display = "flex";

  if (miniAvatar) {
    miniAvatar.style.display = "none";
    miniPlaceholder.style.display = "flex";
  }

  fotoInput.value = "";
  atualizarConclusaoPerfil();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover foto";
  btnRemover.className = "acao remover-foto";
  btnRemover.style.marginTop = "10px";

  document.querySelector(".perfil-left").appendChild(btnRemover);
  btnRemover.addEventListener("click", removerFotoPerfil);

  carregarPerfil();
});

function carregarPerfil() {
  const savedFoto = localStorage.getItem(`usuario_${userID}_fotoPerfil`);
  if (savedFoto) {
    fotoPerfil.src = savedFoto;
    fotoPerfil.style.display = "block";
    avatarPlaceholder.style.display = "none";

    if (miniAvatar) {
      miniAvatar.src = savedFoto;
      miniAvatar.style.display = "block";
      miniPlaceholder.style.display = "none";
    }
  }

  ["nome", "email", "telefone", "endereco"].forEach((id) => {
    const saved = localStorage.getItem(`usuario_${userID}_${id}`);
    if (saved) {
      document.getElementById(id).value = saved;
      if (id === "nome") nomeDisplay.textContent = saved;
    }
  });

  atualizarConclusaoPerfil();
}

salvarBtn.addEventListener("click", () => {
  let lista = JSON.parse(localStorage.getItem("listaUsuarios")) || [];
  const index = lista.findIndex((u) => u.id === userID);

  ["nome", "email", "telefone", "endereco"].forEach((id) => {
    const valor = document.getElementById(id).value.trim();
    localStorage.setItem(`usuario_${userID}_${id}`, valor);

    if (index !== -1) lista[index][id] = valor;
    if (id === "nome") nomeDisplay.textContent = valor || "Seu Nome";
  });

  localStorage.setItem("listaUsuarios", JSON.stringify(lista));

  atualizarConclusaoPerfil();
  alert("Alterações salvas com sucesso!");
});

deletarContaBtn.addEventListener("click", () => {
  if (!confirm("Tem certeza que deseja deletar sua conta?")) return;

  ["fotoPerfil", "nome", "email", "telefone", "endereco"].forEach((campo) => {
    localStorage.removeItem(`usuario_${userID}_${campo}`);
  });

  let lista = JSON.parse(localStorage.getItem("listaUsuarios")) || [];
  lista = lista.filter((u) => u.id !== userID);
  localStorage.setItem("listaUsuarios", JSON.stringify(lista));

  localStorage.removeItem("userLogado");
  localStorage.removeItem("token");

  alert("Conta removida com sucesso!");
  window.location.href =
    "https://rafacaire1507.github.io/Assinatrack/codigo-fonte/Home-Gabriel/home.html";
});

document.getElementById("sairContaBtn").addEventListener("click", () => {
  if (!confirm("Deseja realmente sair da conta?")) return;

  localStorage.removeItem("userLogado");
  localStorage.removeItem("token");

  alert("Você saiu da sua conta.");
  window.location.href =
    "https://rafacaire1507.github.io/Assinatrack/codigo-fonte/Home-Gabriel/home.html";
});

function atualizarConclusaoPerfil() {
  const campos = {
    foto: !!localStorage.getItem(`usuario_${userID}_fotoPerfil`),
    nome: !!document.getElementById("nome").value.trim(),
    email: !!document.getElementById("email").value.trim(),
    telefone: !!document.getElementById("telefone").value.trim(),
    endereco: !!document.getElementById("endereco").value.trim(),
  };

  Object.keys(campos).forEach((campo) => {
    const li = document.getElementById(`check-${campo}`);
    if (li) li.classList.toggle("completo", campos[campo]);
  });

  const completos = Object.values(campos).filter(Boolean).length;
  const total = Object.keys(campos).length;
  const porcentagem = Math.round((completos / total) * 100);

  const barra = document.getElementById("progressoPerfil");
  const texto = document.getElementById("porcentagemPerfil");

  barra.style.width = `${porcentagem}%`;
  texto.textContent = `Seu perfil está ${porcentagem}% completo`;
}

["nome", "email", "telefone", "endereco"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("input", atualizarConclusaoPerfil);
});
