async function getInfoCourses(url) {
  let response = await fetch(url)
  let dataJson = await response.json()
  let data = await dataJson
  try {
    curso.innerHTML = ""
    if (response.ok) {
      await data.map((el, index) => {
        curso.innerHTML += `<li id="${el.idCourses}" class="item" onClick="handleListenerItems(this)">${el.courseName}</li>`
      })
    } else {
      curso.innerHTML += `<li class="item">Selecione o curso</li>`
    }
  }
  catch (e) {
    return 0
  }
}
function $(el) {
  return document.querySelector(`${el}`)
}

function chooseFile(target) {
  $(".text-file").innerHTML = `${target.files[0].name.length >= 25 ? target.files[0].name.slice(0, 25) + "..." : target.files[0].name}`
}

function logout() {
  modal.style.display = 'none';
  document.cookie = "mode="
  document.cookie = "permission="
  window.location.assign(window.location.protocol + "/api/admlogin")
}

function handleFieldsAndItems() {



  try {
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.target.parentNode.previousElementSibling.innerText = item.innerText
        e.target.parentNode.nextElementSibling.value = item.id
        if (e.target.parentNode.nextElementSibling.id == "aula") {
          lesson = item.id
        } else if (e.target.parentNode.nextElementSibling.id == "regiao") {
          region = item.id
        }
      },
        false
      )
    })

    campos.forEach((field, index) => {
      field.parentNode.querySelector(".lista").style.maxHeight = Math.floor(((eval(window.screen.height - field.getBoundingClientRect().bottom) - 220))).toString() + "px"
      field.addEventListener("click", (e) => {
        field.style.zIndex = "3"
        campos.filter(el => el !== field).forEach(el => { el.style.zIndex = "0" })
        if (listas[index].style.display == "flex") {
          listas[index].style.display = "none"
          hiddenLines()
        } else {
          hiddenList()
          listas[index].style.display = "flex"
          Array.from(lines).filter(el => el.nextElementSibling == field)[0].style.display = "flex"
          field.parentNode.lastChild.previousElementSibling.style.display = "flex"
        }
      })
    })

  }
  catch (e) {
    null
  }



  function hiddenList() {
    hiddenLines()
    listas.forEach((lista, index) => {
      lista.style.display = "none"
    })
  }
  function hiddenLines() {
    lines.forEach(line => {
      line.style.display = "none"
    })
  }

  window.addEventListener("click", e => {
    if (e.target.classList.contains("campo") === false) {
      hiddenList()
    }
  })

}
function handleListenerItems(e) {
  e.parentNode.previousElementSibling.innerText = e.innerText
  e.parentNode.nextElementSibling.value = e.id
  course = e.id
}



