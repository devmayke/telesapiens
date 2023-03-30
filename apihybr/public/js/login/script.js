function $(el) {
  return document.querySelector(`${el}`);
}
function CreateModal(imgSRC, text, sim, nao, cssIMG) {
  modalImg.src = imgSRC;
  modalTexto.innerHTML = text;
  modalBtnSim.innerText = sim;
  modalBtnNao.innerText = nao;
  modal.style.display = "flex";
  modalImg.style.marginTop = "20px";
  if (cssIMG !== "") {
    modalImg.style = cssIMG;
  }

  if (imgSRC === "") {
    modalImg.style.visibility = "hidden";
  }
  if (sim === "") {
    modalBtnSim.style.display = "none";
  }
  if (nao === "") {
    modalBtnNao.style.display = "none";
  }
}

var modal = $(".modal-wrapper");
var modalImg = $(".modal-img");
var modalTexto = $(".modal-texto");
var modalBtnSim = $(".modal-btn-sim");
var modalBtnNao = $(".modal-btn-nao");

modalBtnSim.addEventListener("click", () => {
  modal.style.display = "none";
})


let user = $("#username")
let password = $("#password")

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  if(user.value === "" || password.value === ""){
    console.log("eiiii")
    CreateModal(
          "./img/fill-fields.png",
          '<span style="display:block;width:100%; color:white; font-weight:700; padding:0 10px;white-space: nowrap; margin:auto;">Você precisa preencher</span> todos os campos!',
          "Ok",
          "",
          "width:190px;transform:scale(.77);"
        )
    return
  }

  fetch(e.target.action, {
    method: "POST",
    body: new URLSearchParams(new FormData(e.target)),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data)

      if(data.message && data.permission === "Unauthorized"){
         CreateModal(
            "./img/auth.png",
            data.message,
            "Ok",
            "",
            "transform:scale(.85)"
          )
      }

      if (data.permission === 'master') {
        if (data.mode === 'edit_course') {
          window.location.assign(data.redirect)
        }
        else {
          document.cookie = data.cookieMode;
          document.cookie = data.cookiePermission;
          window.location.assign(window.location.protocol + data.redirect)
        }
      }

      if (data.permission === 'admin' && data.redirect === "Unauthorized") {
        CreateModal(
          "./img/auth.png",
          'Você não tem autorização para acessar esta página',
          "Ok",
          "",
          "transform:scale(.85)"
        )
      }

      if (data.permission === 'admin' && data.redirect !== "Unauthorized") {
        if (data.mode === 'edit_course') {
          window.location.assign(data.redirect)
        }
        else {
          document.cookie = data.cookieMode;
          document.cookie = data.cookiePermission;
          window.location.assign(window.location.protocol + data.redirect)
        }
      }

      if (data.permission === 'viewer' && data.redirect !== "Unauthorized") {        
        document.cookie = data.cookieMode;
        document.cookie = data.cookiePermission;
        window.location.assign(data.redirect)
      }else if(data.permission === 'viewer' && data.redirect === "Unauthorized"){
        CreateModal(
          "./img/auth.png",
          'Você não tem autorização para acessar esta página',
          "Ok",
          "",
          "transform:scale(.85)"
        )
      }






































      // if (data.msg) {
      //   console.log('1')
      //   console.log(data)
      //   // CreateModal(
      //   //   "./img/fill-fields.png",
      //   //   '<span style="display:block;width:100%; color:white; font-weight:700; padding:0 10px;white-space: nowrap; margin:auto;">Você precisa preencher</span> todos os campos!',
      //   //   "Ok",
      //   //   "",
      //   //   "width:190px;transform:scale(.77);"
      //   // );
      // } else {
      //   let mode = data.mode;
      //   let permission = data.permission;
      //   if (permission === "user" && data.redirect === "Unauthorized") {
      //     console.log("2")
      //     console.log(data)

      //     // CreateModal(
      //     //   "./img/auth.png",
      //     //   data.message,
      //     //   "Ok",
      //     //   "",
      //     //   "transform:scale(.85)"
      //     // );
      //   } else if (
      //     permission === "Unauthorized" &&
      //     data.redirect === "Unauthorized"
      //   ) {
      //     console.log("3")
      //     console.log(data)

      //     // CreateModal(
      //     //   "./img/auth.png",
      //     //   data.message,
      //     //   "Ok",
      //     //   "",
      //     //   "transform:scale(.85);"
      //     // );
      //   } else if (mode === "edit_course") {
      //     console.log("4")
      //     console.log(data)

      //     // window.location.assign(data.redirect)
      //   } else {
      //     console.log("5");
      //     console.log(data)

      //     document.cookie = data.cookieMode;
      //     document.cookie = data.cookiePermission;
      //     // window.location.assign(window.location.protocol + data.redirect)

      //   }
      // }
    })
    .catch((error) => {
      // console.log(error);
    });
});
