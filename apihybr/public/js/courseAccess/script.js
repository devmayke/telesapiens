let session =
  (
    document.cookie.includes("mode=dmlld19jb3Vyc2U=") ||
    document.cookie.includes("permission=YWRtaW4=") ||
    document.cookie.includes("permission=bWFzdGVy")  
  )
if (session) {
  var curso = $(".listacurso");

  var form = $("form");

  var profile = $(".profile-container");
  var profilePopup = $(".profile-popup");
  var btnLogout = $(".profile-btn-logout");
  var btnVerCurso = $(".profile-btn-curso");
  var btnHome = $(".profile-btn-home");

  var modal = $(".modal-wrapper");
  var modalImg = $(".modal-img");
  var modalTexto = $(".modal-texto");
  var modalBtnSim = $(".modal-btn-sim");
  var modalBtnNao = $(".modal-btn-nao");

  var campoinstituicao = $(".campoinstituicao");
  var listainstituicao = $(".listainstituicao");
  $(".listainstituicao").addEventListener("change", (event) => {
    console.log("MUDOU LISTA");
    getInfoCourses(
      window.location.protocol +
        "//" +
        window.location.hostname +
        "/api/getinfocourses"
    );
  });

  console.log("CAMPO INSTITUICAO", listainstituicao.getElementsByTagName("li"));

  var campocurso = $(".campocurso");
  var listacurso = $(".listacurso");

  var campoaula = $(".campoaula");
  var listaaula = $(".listaaula");

  var campoatividade = $(".campoatividade");
  var listaatividade = $(".listaatividade");

  var camporegiao = $(".camporegiao");
  var listaregiao = $(".listaregiao");

  var items = document.querySelectorAll(".item");
  var lines = document.querySelectorAll(".line");

  var campos = [
    campoinstituicao,
    campocurso,
    campoaula,
    campoatividade,
    camporegiao,
  ];
  var listas = [
    listainstituicao,
    listacurso,
    listaaula,
    listaatividade,
    listaregiao,
  ];
} else {
  document.querySelector("body").style.display = "none";
  window.location.assign(window.location.protocol + "/api/admlogin");
  // document.querySelector("body").innerHTML = `<h1 style="margin-right:auto;width:43vw; margin-left:20px;">Você não tem autorização para acessar esta página</h1>`
}

let getInfoCourses = async function (url) {
  let escola = `0`;

  switch ($("#url").value) {
    case "https://appaula.prepara.com.br":
      escola = "1";
      break;
    case "https://appaula.microlins.com.br":
      escola = "1";
      break;
    case "https://appaula.sos.com.br":
      escola = "1";
      break;
    case "https://appaula.people.com.br":
      escola = "1";
      break;
    case "https://appaula.ensinamais.com.br":
      escola = "2";
      break;
    default:
      escola = "1";
      break;
  }

  let response = await fetch(url + `/${escola}`);
  console.log("URL", url + `/${escola}`);
  let dataJson = await response.json();
  let data = await dataJson;
  try {
    curso.innerHTML = "";
    if (response.ok) {
      await data.map((el, index) => {
        curso.innerHTML += `<li id="${el.idCourses}" class="item" onClick="handleListenerItems(this)">${el.courseName}</li>`;
      });
    } else {
      curso.innerHTML += `<li class="item">Selecione o curso</li>`;
    }
  } catch (e) {
    return 0;
  }
};

// getInfoCourses(
//   window.location.protocol +
//     "//" +
//     window.location.hostname +
//     ":5000/api/getinfocourses"
// );

/////////////////////////////////////////// DROPDOWN ///////////////////////////////////////////

function $(el) {
  return document.querySelector(`${el}`);
}

try {
  items.forEach((el) => {
    el.addEventListener(
      "click",
      (e) => {
        e.target.parentNode.previousElementSibling.innerText = el.innerText;
        e.target.parentNode.nextElementSibling.value = el.id;
        if (e.target.parentNode.nextElementSibling.id == "aula") {
          lesson = el.id;
        } else if (e.target.parentNode.nextElementSibling.id == "regiao") {
          region = el.id;
        }
        getInfoCourses(
          window.location.protocol +
            "//" +
            window.location.hostname +
            "/api/getinfocourses"
        );
      },
      false
    );
  });
  campos.forEach((field, index) => {
    field.parentNode.querySelector(".lista").style.maxHeight =
      Math.floor(
        eval(window.screen.height - field.getBoundingClientRect().top) - 320
      ).toString() + "px";
    field.addEventListener("click", (e) => {
      field.style.zIndex = "3";
      campos
        .filter((el) => el !== field)
        .forEach((el) => {
          el.style.zIndex = "0";
        });
      if (listas[index].style.display == "flex") {
        listas[index].style.display = "none";
        hiddenLines();
      } else {
        hiddenList();
        listas[index].style.display = "flex";
        Array.from(lines).filter(
          (el) => el.nextElementSibling == field
        )[0].style.display = "flex";
        field.parentNode.lastChild.previousElementSibling.style.display =
          "flex";
      }
    });
  });
} catch (e) {
  null;
}

function handleListenerItems(e) {
  e.parentNode.previousElementSibling.innerText = e.innerText;
  e.parentNode.nextElementSibling.value = e.id;
  course = e.id;
}

function hiddenList() {
  hiddenLines();
  listas.forEach((lista) => {
    lista.style.display = "none";
  });
}
function hiddenLines() {
  lines.forEach((line) => {
    line.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("campo") === false) {
    hiddenList();
  }
});

/////////////////////////////////////////// DROPDOWN ///////////////////////////////////////////

function CreateModal(img, text, sim, nao, imgcSS) {
  if (imgcSS !== "") {
    modalImg.style = imgcSS;
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
  modalImg.src = img;
  modalImg.style.marginTop = "20px";
  modalTexto.innerHTML = text;
  modalBtnSim.innerText = sim;
  modalBtnNao.innerText = nao;
  modal.style.display = "flex";
}

function logout() {
  modal.style.display = "none";
  document.cookie = "mode=";
  document.cookie = "permission=";
  window.location.assign(window.location.protocol + "/api/admlogin");
}
try {
  profile.addEventListener("mouseover", (e) => {
    profilePopup.style.display = "block";
  });
  profile.addEventListener("mouseout", (e) => {
    profilePopup.style.display = "none";
  });
  btnLogout.addEventListener("click", () => {
    CreateModal(
      "./img/icon_certeza_sair.png",
      '<span style="display:block;width:100%; color:white; font-weight:700; padding:0 15px;white-space: nowrap; margin:auto;">Tem certeza que</span> deseja sair conta?',
      "Confirmar",
      "Cancelar",
      "width:130px; transform:scale(.85)"
    );
  });

  modalBtnSim.addEventListener("click", logout);
  modalBtnNao.addEventListener("click", () => {
    modal.style.display = "none";
  });
  btnVerCurso.addEventListener("click", () => {
    window.location.assign(window.location.protocol + "/api/adicionar");
  });
  btnHome.addEventListener("click", () => {
    window.location.assign(window.location.protocol + "/api/admlogin");
  });
  if (document.cookie.includes("permission=dXNlcg==")) {
    btnVerCurso.style.display = "none";
  }

  form.addEventListener("submit", (e) => {
    if (
      $("#url").value === "" ||
      $("#curso").value === "" ||
      $("#aula").value === "" ||
      $("#atividade").value === "" ||
      $("#regiao").value === ""
    ) {
      e.preventDefault();
      CreateModal(
        "./img/fill-fields.png",
        '<span style="widht:100%; color:white; font-weight:700; padding:0 10px;white-space: nowrap; margin:auto;">Você precisa preencher</span> todos os campos!',
        "",
        "Ok",
        "width:160px; transform:scale(.75)"
      );

      console.log("não envia");
      // e.preventDefault = false
    }
  });
} catch (e) {
  null;
}
