let session =
  (document.cookie.includes("mode=YWRkX2NvdXJzZQ==") ||
    document.cookie.includes("mode=dmlld19jb3Vyc2U=")) &&
    (document.cookie.includes("permission=YWRtaW4=") || 
    document.cookie.includes("permission=bWFzdGVy"))
if (session) {
  var curso = $(".lista");
  var course = $("#curso").value;
  var lesson = $("#aula").value;
  var region = $("#regiao").value;

  var modal = $(".modal-wrapper");
  var modalImg = $(".modal-img");
  var modalTexto = $(".modal-texto");
  var modalBtnSim = $(".modal-btn-sim");
  var modalBtnNao = $(".modal-btn-nao");

  var profile = $(".profile-container");
  var profilePopup = $(".profile-popup");
  var btnLogout = $(".profile-btn-logout");
  var btnVerCurso = $(".profile-btn-curso");
  var btnHome = $(".profile-btn-home");

  var campocurso = $(".campocurso");
  var listacurso = $(".listacurso");

  var campoaula = $(".campoaula");
  var listaaula = $(".listaaula");

  var camporegiao = $(".camporegiao");
  var listaregiao = $(".listaregiao");

  var items = document.querySelectorAll(".item");
  var lines = document.querySelectorAll(".line");

  var campos = [campocurso, campoaula, camporegiao];
  var listas = [listacurso, listaaula, listaregiao];
} else {
  document.querySelector("body").style.display = "none";
  window.location.assign(window.location.protocol + "/api/admlogin");
  // document.querySelector("body").innerHTML = `<h1 style="margin-left:auto;width:43vw; margin-right:20px;">Você não tem autorização para acessar esta página</h1>`
}

let getInfoCourses = async function (url) {
  let response = await fetch(url);
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

getInfoCourses(
  window.location.protocol +
    "//" +
    window.location.hostname +
    "/api/getinfocourses/99"
);

/////////////////////////////////////////// DROPDOWN ///////////////////////////////////////////

function $(el) {
  return document.querySelector(`${el}`);
}

function chooseFile(target) {
  $(".text-file").innerHTML = `${
    target.files[0].name.length >= 25
      ? target.files[0].name.slice(0, 18) + "..."
      : target.files[0].name
  }`;
}
try {
  items.forEach((item) => {
    item.addEventListener(
      "click",
      (e) => {
        e.target.parentNode.previousElementSibling.innerText = item.innerText;
        e.target.parentNode.nextElementSibling.value = item.id;
        if (e.target.parentNode.nextElementSibling.id == "aula") {
          lesson = item.id;
        } else if (e.target.parentNode.nextElementSibling.id == "regiao") {
          region = item.id;
        }
      },
      false
    );
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
  listas.forEach((lista, index) => {
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

try {
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

function CreateModal(img, text, sim, nao, modo, imgCSS) {
  modalImg.src = img;
  modalTexto.innerHTML = text;
  modalBtnSim.innerText = sim;
  modalBtnNao.innerText = nao;
  modal.style.display = "flex";
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
    modalBtnSim.style.display = "flex";
    modalBtnNao.style.display = "flex";

    modalBtnSim.addEventListener("click", logout);
    modalBtnNao.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (modo == "simples") {
    modalBtnSim.style.display = "none";
    modalBtnNao.style.display = "flex";
    modalBtnNao.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (modo == "done-upload") {
    modalBtnSim.style.display = "none";
    modalBtnNao.style.display = "flex";
    modalBtnNao.addEventListener("click", () => {
      window.location.assign(window.location.protocol + "/api/adicionar");
    });
  }

  if (modo == "confirmar_envio") {
    modalBtnSim.style.display = "flex";
    modalBtnNao.style.display = "flex";
    modalBtnSim.addEventListener("click", () => {
      modal.style.display = "none";
      confirmSend();
    });
    modalBtnNao.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
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
      "logout",
      "transform:scale(1)"
    );
  });

  btnVerCurso.addEventListener("click", () => {
    window.location.assign(window.location.protocol + "/api/acessar");
  });

  btnHome.addEventListener("click", () => {
    window.location.assign(window.location.protocol + "/api/admlogin");
  });
} catch (e) {
  null;
}

/////////////////////////////////////////// DROPDOWN ///////////////////////////////////////////

const sendFile = async () => {
  if (course == "" || lesson == "" || region == "") {
    // alert("Por favor, selecione todos os campos");
    CreateModal(
      "./img/fill-fields.png",
      '<span style="display:block;width:100%; color:white; font-weight:700; padding:0 10px;white-space: nowrap; margin:auto;">Você precisa preencher</span> todos os campos!',
      "",
      "Ok",
      "simples",
      "width:160px; transform:scale(.75)"
    );
    return;
  }
  if (document.getElementById("file").files.length == 0) {
    CreateModal(
      "./img/icon_attention.png",
      '<span style="display:block;width:100%; color:white; font-weight:700; padding:0 10px;white-space: nowrap; margin:auto;">Por favor, selecione</span> um arquivo',
      "",
      "Ok",
      "simples",
      "transform:scale(.75);"
    );
    return;
  }

  try {
    if (
      !$("#file").files[0].name.includes(".zip") &&
      !$("#file").files[0].type.includes("zip")
    ) {
      CreateModal(
        "./img/icon_attention.png",
        '<span style="display:block;width:100%; color:white; font-weight:700; padding:0 10px;white-space: nowrap; margin:auto;">O Arquivo deve conter</span> a extensão .zip',
        "",
        "Ok",
        "simples",
        "transform:scale(.75);"
      );
    } else {
      fetch("/api/temScorm/" + course + "/" + lesson + "/" + region)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data[`scorm${region}`] == 1) {
            CreateModal(
              "./img/icon_attention.png",
              '<span style="display:block;width:100%; color:white; font-weight:700; padding:0 10px;white-space: nowrap; margin:auto;">Já existe um SCORM</span> nesta região, deseja sobrescrever?',
              "Sim",
              "Não",
              "confirmar_envio",
              "transform:scale(.75);"
            );
          } else {
            console.log(data);
            confirmSend();
          }
        });
    }
  } catch (e) {
    null;
  }
};

let confirmSend = async () => {
  //// set loading icon
  let loading = document.getElementById("upload-icon");
  loading.src = "./img/loading.gif";

  const dataForm = new FormData();
  dataForm.append("file", document.getElementById("file").files[0]);
  console.log(
    "ENVIANDO ISSO DAQUI: ",
    document.getElementById("file").files[0]
  );

  const res = await fetch(`/api/uploadCourse/${course}/${lesson}/${region}`, {
    headers: {
      Authorization: `Bearer ${"pR889Q6+6CI9VuF"}`,
    },
    method: "POST",
    body: dataForm,
  })
    .then((response) => {
      if (response.status == 200) {
        console.log(response);
        loading.src = "./img/upload_icon.png";
        CreateModal(
          "./img/upload-done.png",
          "Enviado com sucesso!",
          "",
          "Ok",
          "done-upload",
          ""
        );
      } else {
        loading.src = "./img/upload_icon.png";
        CreateModal(
          "./img/zip_icon.png",
          "Erro ao enviar arquivo",
          "",
          "Ok",
          "simples",
          ""
        );
      }
    })
    .catch((error) => {
      console.log("Error while posting data", error.message);
      alert("Error while posting data: \nError" + error.message);
    });
};
