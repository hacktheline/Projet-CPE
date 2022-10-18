
/////////////////// Variables globales ////////////////////
var PRODUCT_LIST = [];
var COLOR_LIST = {};
var WHERE = window.location.pathname;
var ARG = window.location.search;
//////////////////////// Objects //////////////////////////
/*              Objet produit                   */
/* Caracterise les differents produits du site  */
function produit(jsonobject) {
  this.id = jsonobject.id;
  this.nom = jsonobject.nom;
  this.description = jsonobject.description;
  this.prix = jsonobject.prix;
  this.poids = jsonobject.poids;
  this.quantité = jsonobject.quantité;
  this.provenance = jsonobject.provenance;
  this.img = jsonobject.img;
  this.calque1 = jsonobject.calque1;
  this.afficher = function() {
    return `<div class=col-3>
    <a href="perso.html?article-${this.id}">
        <img src="${this.img}" class="medium-image mr-20px" />
    </a>
    <br><span style="font-size: 30px">${this.nom}</span>
    </br>
    <p>
        <br> Prix: ${this.prix}€
    </p>

</div>`;
  }

}

//////////////////////// Functions //////////////////////////
function parseProduits(content) {
  console.log("Length: ",content["article-list"].length);
  for(var i= 0; i < content["article-list"].length; i++)
  {
       console.log(content["article-list"][i]); // Log purpose
       PRODUCT_LIST[i] = new produit(content["article-list"][i]);
  } 
}
function parseCouleur(content) {
  console.log("Length: ",content["couleur-list"].length);
  COLOR_LIST = content["couleur-list"];
}
function afficher_tous_articles() {
    html_article_content = `<div class="row">`
    for(var i= 0; i < PRODUCT_LIST.length; i++)
    {
        if (i % 3 == 0 && i != 0)
        {
          html_article_content += `</div>`;
          html_article_content += `<div class="row ">`;
        }
        html_article_content += PRODUCT_LIST[i].afficher();
    }
    html_article_content += `</div>`
    document.getElementById("tous-articles").innerHTML = html_article_content;
}

function afficher_un_article(id) {
  var option_color = `<select onChange="generate_image(this.value,'${PRODUCT_LIST[id].calque1}')">`; // Calque0 = Choix de la couleur
  for (const [key, value] of Object.entries(COLOR_LIST)) {
    option_color += `<option value="${value}">${key}</option>`;
  }
  option_color += `</select>`;
  html_article_content = `<div class="row">
  <div class="col-2" id="produit-img">
      <img class="big-image" id="produit-img-img" src="${PRODUCT_LIST[id].img}" alt="Funbox">
      <canvas id="produit-img-canvas"></canvas>
  </div>                
  <div class="col-2">
      <div class="mt-150px">
          <h1>${PRODUCT_LIST[id].nom}</h1>
          <p>${PRODUCT_LIST[id].description}</p>
          <ul>
              <li>Livraison: 2-3 jours</li>
              <li>Poids: ${PRODUCT_LIST[id].poids}</li>
              <li>Provenance: ${PRODUCT_LIST[id].provenance}</li>
              <li>Prix: ${PRODUCT_LIST[id].prix}€</li>
          </ul>
          <p>Couleur: ${option_color}
          </p>
          <a href="#" class="link-button mt-150px" onclick="alert('Element ajouté au panier');">Ajouter au panier</a>
      </div>
      
  </div>
  </div>`

  document.getElementById("un_article").innerHTML = html_article_content;
}



function generate_image(calque0,calque1)
{
  var canvas1 = document.querySelector('#produit-img-canvas')
  var canvas = canvas1.getContext("2d"); 
  console.log("Changing the image");
  var img_calque0 = new Image(); 
  img_calque0.src = calque0; 
  var img_calque1 = new Image(); 
  img_calque1.src = calque1; 
  canvas.canvas.width = img_calque1.width;
  canvas.canvas.height = img_calque1.height;
  canvas.drawImage(img_calque0, 0, 0,img_calque1.height,  img_calque1.width);
  canvas.drawImage(img_calque1, 0, 0,img_calque1.height, img_calque1.width);


  document.getElementById("produit-img-img").src = canvas1.toDataURL();
  
 
}

//////////////////////// Code `onload` //////////////////////////
let url = 'bdd.json';
fetch(url)
.then(res => res.json())
.then(function(response) {
  console.log(' BDD', response); // Log purpose
  parseProduits(response);
  parseCouleur(response);
  if (WHERE == "/articles.html")
  {
    afficher_tous_articles();
  }
  else if (WHERE == "/perso.html")
  {
    if (ARG.includes("article-") && ARG.indexOf("article-") == 1)
    {
      id = ARG.split("article-")[1];
      if (!isNaN(id))
      {
        id = parseInt(id,10);
        afficher_un_article(id);
      }
    }
  }
  else if (WHERE == "/index.html")
  {
    
  }
  
})
.catch(err => { throw err });


