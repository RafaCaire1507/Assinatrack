const toggleSenha = document.getElementById("toggleSenha");
const senhaLogin = document.getElementById("senha_login");

toggleSenha.addEventListener("click", () => {
  const isHidden = senhaLogin.type === "password";

  senhaLogin.type = isHidden ? "text" : "password";
  toggleSenha.src = isHidden
    ? "https://cdn-icons-png.flaticon.com/512/159/159605.png"
    : "https://cdn-icons-png.flaticon.com/512/159/159604.png";
});

function entrar() {
  const email = document.getElementById("email_login").value.trim();
  const senha = document.getElementById("senha_login").value.trim();

  const emailLabel = document.getElementById("emailLabel");
  const senhaLabel = document.getElementById("senhaLabel");
  const msgError = document.getElementById("msgError");

  const listaUsuarios = JSON.parse(localStorage.getItem("listaUsuarios")) || [];

  
  const user = listaUsuarios.find(
    (u) => u.email === email && u.senha === senha
  );

  if (!user) {
    msgError.style.display = "block";
    msgError.innerText = "Usuário ou senha incorretos.";
    emailLabel.style.color = "red";
    senhaLabel.style.color = "red";
    return;
  }

  msgError.style.display = "none";

  
  const token =
    Math.random().toString(16).substring(2) +
    Math.random().toString(16).substring(2);

  localStorage.setItem("token", token);
  localStorage.setItem("userLogado", JSON.stringify(user));

  
  window.location.href =
    "/codigo-fonte/Meu-perfil-Douglas/perfil.html"

}
