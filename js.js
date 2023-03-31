let worksTmp = null
fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then((works) => {
printWork(works)
modaleWorks(works)
worksTmp = works
})
function printWork(works) {
    const galerie = document.querySelector(".gallery");
    galerie.innerHTML = ''
for(let i = 0; i < works.length; i++) {
    const work = works[i];
    const figureElement = document.createElement("Figure");
    figureElement.classList.add("class" + work.categoryId)
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl
    imageElement.alt = work.title
    const figCaptionElement = document.createElement("figcaption")
    figCaptionElement.innerHTML = work.title

    galerie.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figCaptionElement);
}};

fetch("http://localhost:5678/api/categories")
.then((response) => response.json())
.then((categories) => {
printCategory(categories)
})

function printCategory(categories) {
    const categoryList = document.querySelector('#categorie')
    for(let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const option1 = document.createElement("option");
        option1.value = category.id;
        option1.text = category.name;

        categoryList.appendChild(option1);
        
    }
}

// Catégories

const buttons = document.querySelectorAll(".btn");
const btnClass = {
    'Objets': ['.class1', ['.class2, .class3']],
    'Appartements': ['.class2', ['.class1, .class3']],
    'Hôtels & Restaurants': ['.class3', ['.class1, .class2']],
};

for (let button of buttons) {
    button.addEventListener("click", function () {
        buttons.forEach(btn => {
                btn.classList.remove('categorieClicked');
        });

        button.classList.add('categorieClicked');
        
        if (button.innerText in btnClass) {
            let object = document.querySelectorAll(btnClass[button.innerText][0]);
            for (let objet of object) {
                objet.style.display = 'block';
            }
            object = document.querySelectorAll(btnClass[button.innerText][1]);
            for (let objet of object) {
                objet.style.display = 'none';
            }
            object = document.querySelectorAll(btnClass[button.innerText][2]);
            for (let objet of object) {
                objet.style.display = 'none';
            }
        } else {
            let objets = document.querySelectorAll([".class1", ".class2", ".class3"]);
            for (let objet of objets) {
                objet.style.display = "block";
            }
        }
    });
}

//Fenetre Modale

function modaleWorks (works) {
    const galleryModale = document.querySelector(".gallery-modale");
    galleryModale.innerHTML = ""
for(let i = 0; i < works.length; i++) {
    const work = works[i];
    const figureModale = document.createElement("figure");

    const divImage = document.createElement("div");
    divImage.classList.add("imageModale")
    const imageModale = document.createElement("img");
    imageModale.src = work.imageUrl
    imageModale.alt = work.title
    const btnSupprimer = document.createElement("button");
    btnSupprimer.innerText = "🗑";
    btnSupprimer.style.color = "white";
    btnSupprimer.id = work.id;
    btnSupprimer.addEventListener("click", async (button) => {
        let suppression = await deleteUnWork(button.target.id)
    })
    divImage.appendChild(imageModale)
    divImage.appendChild(btnSupprimer)

    const figcaptionModale = document.createElement("figcaption")
    const anchor = document.createElement("a")
    anchor.classList.add("editLink")
    anchor.innerText = "Editer"
    figcaptionModale.appendChild(anchor)

    figureModale.appendChild(divImage);
    figureModale.appendChild(figcaptionModale);
    galleryModale.appendChild(figureModale);
}
}

// Ouvrir la modale

const openModale = document.querySelector(".btn-modale");
const fenetreModale = document.querySelector(".fenetre");

openModale.addEventListener("click", function() {
    fenetreModale.style.display = "flex";
});

const closeModale = document.querySelector(".btn-close");

closeModale.addEventListener("click", function() {
    fenetreModale.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === fenetreModale) {
        fenetreModale.style.display = "none";
    }
});

// Supprimer des modales


const deleteAllModale = document.getElementById("deleteAllGallery")
deleteAllModale.addEventListener("click", async () => {
    let allModale = document.querySelector(".gallery-modale")

    for (modales of allModale.childNodes) {
        if (modales.nodeName === "FIGURE"){
           // deleteUnWork (modales.firstElementChild.lastChild.id)
           console.log(modales.firstElementChild.lastChild.id)
        }
    }
})

async function deleteUnWork (idWork) {

    let response = await fetch("http://localhost:5678/api/works/" + idWork, {
        method: 'DELETE',
        headers: {
            'Authorization':"Bearer " + window.localStorage.getItem("token"),
        }
    })

    const result = await response;
    for (let i = 0; i < worksTmp.length; i++){
        if (worksTmp[i].id == idWork) {
            worksTmp = worksTmp.filter(function(item) {
                return item.id != idWork
            })
            printWork(worksTmp)
            modaleWorks(worksTmp)
            break
        }
    }
    return result
}

// Modale ajouter photo

const ajouterPhoto = document.getElementById("ajoutPhoto");
const fenetrePhoto = document.querySelector(".addFigure");
const fermerAjouterPhoto = document.querySelector(".btn-close2");
const pagePrecedente = document.querySelector(".btn-precedent");

ajouterPhoto.addEventListener("click", () => {
  fenetrePhoto.style.display = "flex";
  fenetreModale.style.display = "none";
});

fenetrePhoto.addEventListener("click", (event) => {
  if (event.target === fenetrePhoto) {
    fenetrePhoto.style.display = "none";
  }
});

fermerAjouterPhoto.addEventListener("click", () => {
  fenetrePhoto.style.display = "none";
});

pagePrecedente.addEventListener("click", () => {
  fenetrePhoto.style.display = "none";
  fenetreModale.style.display = "flex";
});

const AjouterphotoBtn = document.getElementById("ajouter-photo");
const inputFileBtn = document.getElementById("inputFile")

AjouterphotoBtn.addEventListener("click", () =>
{
    inputFileBtn.click();
})

const validerAdd = document.getElementById('valider-add')
validerAdd.addEventListener('click', async (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.stopImmediatePropagation()
    const image = document.getElementById('inputFile')

    const file = image.files[0];        
    const title = document.querySelector('#titre').value
    const category = document.querySelector('#categorie').value
    if (title === "" ) {
    alert("Titre manquant")
}
    else if (file === undefined) {
    alert("Image manquante")
}
    else {
        const formData = new FormData();
        formData.append("image", file)
        formData.append("title", title)
        formData.append("category", parseInt(category))
        let response = await fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
          'Authorization':"Bearer " + window.localStorage.getItem("token"),
          "Accept":"application/json"
        },
        body: formData
      });
      
      let result = await response.json();
}})

const imageUpload = document.getElementById("inputFile");
const uploadedImage = document.getElementById("uploaded-image")

imageUpload.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", function() {
        uploadedImage.src = reader.result;
        document.querySelector(".section-image").style.display = "none";
        document.getElementById("image-container").style.display = "flex";
        });
        reader.readAsDataURL(file);
    }   
});

const titreInput = document.querySelector('#titre');
const inputFile = document.querySelector('#inputFile');

function updateValiderAdd() {
  if (titreInput.value.trim() !== '' && inputFile.files.length > 0) {
    validerAdd.style.backgroundColor = '#1D6154';
  } else {
    validerAdd.style.backgroundColor = '';
  }
}

titreInput.addEventListener('input', updateValiderAdd);
inputFile.addEventListener('change', updateValiderAdd);











   
