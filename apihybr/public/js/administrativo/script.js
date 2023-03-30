function $(str) {
  return document.querySelector(str)
}

let session =
  (document.cookie.includes("mode=YWRkX2NvdXJzZQ==") ||
    document.cookie.includes("mode=cmVnaXN0ZXJfdXNlcg==")) &&
  document.cookie.includes("permission=bWFzdGVy")

if (session) {
  var modal = $(".modal-wrapper-editor")
  var modalImg = $(".modal-img-editor")
  var modalTexto = $(".modal-texto-editor")
  var modalBtnSim = $(".modal-btn-sim")
  var modalBtnNao = $(".modal-btn-nao")
  var profile = $(".profile-container")
  var profilePopup = $(".profile-popup")
  var btnLogout = $(".profile-btn-logout")
  var btnVerCurso = $(".profile-btn-curso")
  var btnHome = $(".profile-btn-home")
} else {
  document.querySelector("body").style.display = "none";
  window.location.assign(`${window.location.protocol}/api/admlogin`);
}

let data;
let wrapperModal = $('.modal-wrapper-editor')
const BASE_URL = 'http://localhost:5000/api'


if (wrapperModal) {
  wrapperModal.addEventListener("click", (e) => {
    if (e.target.className.includes("modal-wrapper-editor")) {
      document.querySelector(".modal-wrapper-editor").classList.remove("visible")
    }
  })
}


let old_username = ''
let old_password = ''
let old_role = ''



/////////////////////////////////////////// UTILS /////////////////////////////////////////// 


async function EditUser(e, id, mode) {
  e.stopPropagation()

  if (mode === "update") {

    let userFields = e.target.parentElement
    let l_id = id
    let usernameField = userFields.querySelector("#username")
    let passwordField = userFields.querySelector("#password")
    let roleField = userFields.querySelector("#role")

    usernameField.addEventListener("change", e => usernameField.value = e.target.value)
    passwordField.addEventListener("change", e => passwordField.value = e.target.value)
    roleField.addEventListener("change", e => roleField.value = e.target.value)

    let listUsers = document.querySelectorAll(".registerUser")
    let id_master = null
    listUsers.forEach(el => {
      if (el.querySelector(".role")) {
        if (el.querySelector(".role").innerText === "Master") {
          id_master = el.id
        }
      }
    })



    let updateData = {
      id: l_id,
      new_username: usernameField.value,
      new_password: passwordField.value,
      new_role: l_id === id_master ? "master" : roleField.value
    }
  
    let dataField = {
      id: l_id,
      username: usernameField.value,
      password: passwordField.value,
      role: l_id === id_master ? "master" : roleField.value
    }

    if (
      old_password === updateData.new_password &&
      old_username === updateData.new_username &&
      old_role === updateData.new_role
    ) {
      createToast("Os dados não foram alterados!", 'error', 4000)
      bounceElement(".modal-container-editor", 400)
    }
    else if (dataField.username === "" || dataField.password === "") {
      createToast("Preencha todos os campos!", 'error', 4000)
      bounceElement(".modal-container-editor", 400)
    } else {
      if (validadeSpaceString(dataField.username)) {
        createToast("Não pode haver espaços em branco no nome do usuário!", 'error', 4000)
        bounceElement(".modal-container-editor", 400)
      } else {
        updateUserInfo(updateData, dataField)
        createToast("Usuário salvo com sucesso!", "success", 4000)
      }
    }
  }

  if (mode === "create") {

    let userFields = $(".formEditor")
    let usernameField = userFields.querySelector("#username")
    let passwordField = userFields.querySelector("#password")
    roleField = userFields.querySelector("#role")
    usernameField.addEventListener("change", e => usernameField.value = e.target.value)
    passwordField.addEventListener("change", e => passwordField.value = e.target.value)
    roleField.addEventListener("change", e => roleField.value = e.target.value)

    let dataFields = {
      username: usernameField.value,
      password: passwordField.value,
      role: roleField.value
    }

    if (dataFields.username === "" || dataFields.password === "") {
      createToast("Preencha todos os campos!", 'error', 4000)
      bounceElement(".modal-container-editor", 400)
    } else {
      addUser(dataFields)
    }
  }
}

function bounceElement(element, time) {
  document.querySelector(element).classList.add("bounce")
  setTimeout(() => {
    document.querySelector(element).classList.remove("bounce")
  }, time)
}

function validadeSpaceString(str) {
  return (str.split(" ").length > 1)
}




function removeElement(id) {
  let listUsers = infoUser.querySelectorAll(".registerUser")
  for (let i = 0; i <= listUsers.length; i++) {
    if (listUsers[i].id === id) {
      listUsers[i].remove()
      break
    }
  }
}



let eventUserDataID = null
let mode = ''



function createToast(text, typeMessage, time) {
  let toast = $(".toast")
  toast.innerText = text
  toast.style.opacity = '1';

  if (typeMessage === "success") {
    toast.style.background = "#4CC21D"
  } else if (typeMessage === "error") {
    toast.style.background = "#DB4715"

  }
  toast.style.top = "10px"

  setTimeout(() => {
    toast.style.top = "-150px"
    toast.style.opacity = "0"
  }, time)
}


async function allowEditUser(ev) {
  ev.stopPropagation()
  let isMaster = false
  isMaster = ev.target.parentElement.querySelector(".role").innerText === "Master" ? true : false

  document.querySelector(".modal-wrapper-editor").classList.toggle("visible")
  data = ev.target.parentElement
  eventUserDataID = ev.target.parentElement.id
  let new_username = data.querySelector('.username').innerText
  let new_password = data.querySelector('.password').innerText
  let new_role = ''

  if (data.querySelector('.role').innerText === "Visualizador") {
    new_role = 'viewer'
  } else if (data.querySelector('.role').innerText === "Editor") {
    new_role = "admin"
  } else {
    new_role = "master"
  }

  old_username = new_username
  old_password = new_password
  old_role = new_role

  document.querySelector("#username").value = new_username
  document.querySelector("#password").value = new_password
  if (isMaster) {
    document.querySelector(".label__function").style.display = "none"
    document.querySelector("#role").style.display = "none"
  } else {
    document.querySelector(".label__function").style.display = "flex"
    document.querySelector("#role").style.display = "flex"
    document.querySelector("#role").value = new_role
  }
  mode = 'update'
}


function CreateModal(img, text, sim, nao, modo, imgCSS) {
  modalImg.src = img;
  modalTexto.innerHTML = text;
  modalBtnSim.innerText = sim;
  modalBtnNao.innerText = nao;
  modal.classList.add("visible")
  modalImg.style.marginTop = "20px";
  if (imgCSS !== "") {
    modalImg.style = imgCSS;
  }

  if (img === "") {
    modalImg.style.visibility = "hidden";
  }
  if (sim === "") {
    modalBtnSim.style.display = "none";
  }
  if (nao === "") {
    modalBtnNao.style.display = "none";
  }

  if (modo === "logout") {
    document.querySelector(".modal-btns").style.display = "flex"
    modalBtnSim.style.display = "flex";
    modalBtnNao.style.display = "flex";
    modalBtnSim.addEventListener("click", logout);
    modalBtnNao.addEventListener("click", () => {
      // modal.style.display = "none";
      modal.classList.remove("visible")
    });
  }

  if (modo === "simples") {
    modalBtnSim.style.display = "none";
    modalBtnNao.style.display = "flex";
    modalBtnNao.addEventListener("click", () => {
      modal.classList.remove("visible")
    });
  }
}

function CreateModalEditor(img, text, sim, nao, modo, imgCSS) {
  modalImg.src = img;
  modalTexto.innerHTML = text;
  modalBtnSim.innerText = sim;
  modalBtnNao.innerText = nao;
  modal.classList.add("visible")

  modalImg.style.marginTop = "20px";
  if (imgCSS !== "") {
    modalImg.style = imgCSS;
  }

  if (img === "") {
    modalImg.style.visibility = "hidden";
  }
  if (sim === "") {
    modalBtnSim.style.display = "none";
  }
  if (nao === "") {
    modalBtnNao.style.display = "none";
  }

  if (modo === "userEditor") {
    modalBtnSim.style.display = "flex";
    modalBtnNao.style.display = "flex";
    modalBtnSim.addEventListener("click", logout);
    modalBtnNao.addEventListener("click", () => {
      modal.classList.remove("visible")
    });
  }

  if (modo === "simples") {
    modalBtnSim.style.display = "none";
    modalBtnNao.style.display = "flex";
    modalBtnNao.addEventListener("click", () => {
      modal.classList.remove("visible")
    });
  }
}

function recreateModal() {
  CreateModal(
    "",
    `<div class="modal-wrapper-editor visible">
    <div class="modal-container-editor">
        <img class="modal-img-editor" src="./img/icon_certeza_sair.png" alt="">
        <div class="modal-texto-editor">
            <form class="formEditor">
                <label>Usuário</label>
                <input type="text" name="user" id="username">
                <label>Senha</label>
                <input type="password" name="password" id="password">
                <label>Função</label>
                <select id="role" name="role">               
                    <option value="admin">Editor</option>
                    <option value="viewer">Visualizador</option>                    
                </select>
                <input type="button" id="update" value="Salvar">
            </form>                
        </div>    
        <span class="modal-btns" style="width: 100%; align-items: center; justify-content: space-around;flex:3.5;">
            <div class="modal-btn-sim">Confirmar</div>
            <div class="modal-btn-nao">Cancelar</div>
        </span>      
    </div>
</div>`,
    "",
    "",
    "simples",
    "width:130px; transform:scale(.85)"
  )

  document.querySelector(".buttonDelete").addEventListener('click', deleteUser)
  document.querySelector(".buttonDelete").addEventListener('click', allowEditUser)
  document.querySelector("#update").addEventListener("click", (e) => EditUser(e, eventUserDataID, mode))
}



var infoUser = $(".infoUser")

function createListUsers(element, data, l_infoUser) {

  let div = document.createElement(element)

  div.classList.add('registerUser')

  let usernameElement = document.createElement("div")
  let passwordElement = document.createElement("div")
  let roleElement = document.createElement("div")
  let buttonEditElement = document.createElement('button')
  let buttonDeleteElement = document.createElement('button')

  buttonDeleteElement.addEventListener('click', deleteUser)
  buttonEditElement.addEventListener('click', allowEditUser)

  usernameElement.classList.add("username")
  passwordElement.classList.add("password")
  roleElement.classList.add("role")
  buttonEditElement.classList.add("buttonEdit")
  buttonDeleteElement.classList.add("buttonDelete")
  div.id = data.id

  let textUsername = document.createTextNode(data.username)
  let textPassword = document.createTextNode(data.password)
  let text = ""
  let textRole = document.createTextNode(text)
  if (data.role === 'master') {
    text = "Master"
    buttonDeleteElement.style.opacity = "0"
    buttonDeleteElement.style.pointerEvents = "none"

  } else if (data.role === "admin") {
    text = "Editor"
  } else {
    text = "Visualizador"
  }

  textRole = document.createTextNode(text)
  let textEdit = document.createTextNode('Editar')
  let textDelete = document.createTextNode('Deletar')

  usernameElement.appendChild(textUsername)
  passwordElement.appendChild(textPassword)
  roleElement.appendChild(textRole)
  buttonEditElement.appendChild(textEdit)
  buttonDeleteElement.appendChild(textDelete)

  div.appendChild(usernameElement)
  div.appendChild(passwordElement)
  div.appendChild(roleElement)
  div.appendChild(buttonEditElement)
  div.appendChild(buttonDeleteElement)

  l_infoUser.appendChild(div)
}



/////////////////////////////////////////// UTILS /////////////////////////////////////////// 





/////////////////////////////////////////// CRUD OPERATIONS /////////////////////////////////////////// 


let getInfoAdministrativo = async function (url) {


  try {
    let response = await fetch(url);
    let dataJson = await response.json();
    data = await dataJson;
    if (response.ok) {
      await data.forEach((el, index) => {
        createListUsers('div', el, infoUser)
      });
    } else {
      user.innerHTML += `<li class="item">Selecione o curso</li>`;
    }
  } catch (e) {
    createToast("Erro ao carregar dados do banco!", "error", 10000)
    return 0;
  }
};

getInfoAdministrativo(`${BASE_URL}/getInfoAdministrativo`);

async function updateUserInfo(updateData, dataField) {

  try {


    let url = `${BASE_URL}/updateUserInfo`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    let dataJson = await response.json()

    if (dataJson.fail) {
      createToast("Este usuário já existe. Não foi possível atualizar !", "error", 10000)
      bounceElement(".modal-container-editor", 400)

    } else {
      createListUsers('div', dataField, infoUser)
      createToast("Usuário atualizado com sucesso!", "success", 4000)
      document.querySelector(".modal-wrapper-editor").classList.toggle("visible")
      removeElement(dataField.id)
    }


  }
  catch (error) {
    createToast("Erro ao atualizar o usuário!", "error", 10000)
    document.querySelector(".modal-wrapper-editor").classList.remove("visible")

  }
}



async function deleteUser(e) {

  if (!confirm("Deseja realmente deletar este usuário?")) return

  try {
    let isMaster = false
    isMaster = e.target.parentElement.querySelector(".role").innerText === "Master" ? true : false
    if (isMaster) {
      createToast("Você não pode deletar um usuário com privilégios do tipo 'master' !", "error", 10000)
      return
    }

    let id = e.target.parentElement.id;
    let url = `${BASE_URL}/deleteUser`
    let response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    let dataJson = await response.json();

    if (dataJson.status === "success") {
      e.target.parentElement.remove()
      createToast("Usuário deletado com sucesso!", "success", 4000)
    }
  }
  catch (err) {
    createToast("Erro ao deletar o usuário!", "error", 10000)
  }
}


async function addUser(dataFields) {
  if (validadeSpaceString(dataFields.username)) {
    createToast("Não pode haver espaços em branco no nome do usuário!", 'error', 4000)
    bounceElement(".modal-container-editor", 400)
    return
  }

  try {
    let url = `${BASE_URL}/addUser`
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFields),
    });

    let dataJson = await response.json();

    if (dataJson.fail) {
      createToast("Este usuário já existe. Não foi possível criar !", "error", 10000)
      bounceElement(".modal-container-editor", 400)
    } else {
      if (dataJson.status === "success") {
        createListUsers('div', { ...dataFields, id: dataJson.result.insertId }, infoUser)
        createToast("Usuário criado com sucesso!", "success", 4000)
        document.querySelector(".modal-wrapper-editor").classList.toggle("visible")
      }
    }

  }
  catch (err) {
    createToast("Erro ao criar usuário!", "error", 10000)
  }

}

/////////////////////////////////////////// CRUD OPERATIONS /////////////////////////////////////////// 



function logout() {
  modal.classList.remove("visible")
  document.cookie = "mode=";
  document.cookie = "permission=";
  window.location.assign(`${window.location.protocol}/api/admlogin`);
}

/////////////////////////////////////////// LISTENERS /////////////////////////////////////////// 

document.querySelector("#update").addEventListener("click", (e) => EditUser(e, eventUserDataID, mode))


try {
  profile.addEventListener("mouseover", (e) => {
    profilePopup.style.display = "block";
  });

  profile.addEventListener("mouseout", (e) => {
    profilePopup.style.display = "none";
  });

  btnLogout.addEventListener("click", () => {
    document.querySelector(".modal-btns").classList.add("visible")
    document.querySelector(".modal-container-editor").classList.add("logoutMode")
    modal.classList.add("visible")

    CreateModal(
      "./img/icon_certeza_sair.png",
      '<span style="display:block;width:100%; color:white; font-weight:700; padding:0 15px;white-space: nowrap; margin:auto;">Tem certeza quedeseja sair conta?</span> ',
      "Confirmar",
      "Cancelar",
      "logout",
      "width:130px; transform:scale(.85)"
    )
  })



  document.querySelector("#addUser").addEventListener("click", async (e) => {

    document.querySelector(".modal-wrapper-editor").classList.toggle("visible")
    let userFields = $(".formEditor")

    let usernameField = userFields.querySelector("#username")
    let passwordField = userFields.querySelector("#password")
    let roleField = userFields.querySelector("#role")
    document.querySelector(".label__function").style.display = "flex"
    document.querySelector("#role").style.display = "flex"

    usernameField.value = ''
    passwordField.value = ''
    roleField.value = 'viewer'
    mode = 'create'
  })

  modalBtnSim.addEventListener("click", logout);
  modalBtnNao.addEventListener("click", () => {
    recreateModal()
    modal.classList.remove("visible")
  });
  btnVerCurso.addEventListener("click", () => {
    window.location.assign(`${window.location.protocol}/api/adicionar`);
  });
  btnHome.addEventListener("click", () => {
    window.location.assign(`${window.location.protocol}/api/admlogin`);
  });
  if (document.cookie.includes("permission=dXNlcg==")) {
    btnVerCurso.style.display = "none";
  }
} catch (e) {
  null;
}

/////////////////////////////////////////// LISTENERS /////////////////////////////////////////// 




