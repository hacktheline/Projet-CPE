
/////////////////// Variables globales ////////////////////
var PRODUCT_LIST = [];
var COLOR_LIST = {};
var PANIER = [];
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
        ${this.prix}€
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

function afficher_mon_panier()
{
  var prix_total = 0;
  var html_panier_content = `<p>Vous avez ${PANIER.length} articles dans votre panier</p>`;
  for (var i= 0; i < PANIER.length; i++)
  {
    prix_total += PRODUCT_LIST[PANIER[i].id].prix*PANIER[i].quantity;
    console.log("id",PANIER[i].id);
    html_panier_content += `
    <div class="row">
        <div class="col-6">
            <img class="small-image" src="${PRODUCT_LIST[PANIER[i].id].img}" alt="Funbox">
        </div>
        <div class="col-6">
            <center>
            <p>${PRODUCT_LIST[PANIER[i].id].nom}</br><em>couleur - ${PANIER[i].color}</em></p>
            </center>
        </div>
        <div class="col-6">
            <p>${PRODUCT_LIST[PANIER[i].id].prix}€</p>
        </div>
        <div class="col-6">
            <p>x${PANIER[i].quantity} <span class="badge-green">En stock</span></p>
            
        </div>
        <div class="col-6">
          <p>${PRODUCT_LIST[PANIER[i].id].prix*PANIER[i].quantity}€</p>
        </div>
        <div class="col-6">
            </br>
            <a class="mini-button" href="?supprimer-${i}">X</a>
        </div>

    </div>`;
  }
  html_panier_content += `<div class="row">
    <div class="col-6"></div>
    <div class="col-6"></div>
    <div class="col-6"></div>
    <div class="col-6"></div>
    <div class="col-6"><h2>Total: ${prix_total}€</h2></div>
    <div class="col-6"></div>
  
    `;
  document.getElementById("mon-panier").innerHTML = html_panier_content;

}

function afficher_un_article(id) {
  var option_color = `<select id="select-color" onChange="generate_image(this.value,'${PRODUCT_LIST[id].calque1}',this)">`; // Calque0 = Choix de la couleur
  for (const [key, value] of Object.entries(COLOR_LIST)) {
    option_color += `<option value="${value}">${key}</option>`;
  }
  option_color += `</select>`;
  html_article_content = `<div class="row">
  <div class="col-2" id="produit-img">
      <img height="500px" width="500px" id="produit-img-img" src="${PRODUCT_LIST[id].img}" alt="Funbox">
      <canvas id="produit-img-canvas"></canvas>
  </div>                
  <div class="col-2">
      <div class="mt-150px">
          <h1>${PRODUCT_LIST[id].nom}</h1>
          <p>${PRODUCT_LIST[id].description}</p>
          <ul>
              <li><img class="icone" src="img/icone/délai.png" />Livraison: 2-3 jours</li>
              <li><img class="icone" src="img/icone/poids.png" />Poids: ${PRODUCT_LIST[id].poids}</li>
              <li><img class="icone" src="img/icone/provenance.png" />Provenance: ${PRODUCT_LIST[id].provenance}</li>
              <li><img class="icone" src="img/icone/prix.png" />Prix: ${PRODUCT_LIST[id].prix}€</li>
          </ul>
          <p>Couleur: ${option_color}</p>
          <p>Quantité: <input id="select-quantity" type="number" name"=quantity" value="1"/> </p>
          <input id="article-id" type="hidden" name="id" value="${PRODUCT_LIST[id].id}"/>
          <a href="#" class="link-button mt-150px" onclick="treat_panier();">Ajouter au panier</a>
      </div>
      
  </div>
  </div>`

  document.getElementById("un_article").innerHTML = html_article_content;
}



function generate_image(calque0,calque1,self)
{
  console.log(self.options[self.selectedIndex].text);
  document.getElementById("select-color").style.setProperty("background-color",self.options[self.selectedIndex].text);
  document.getElementById("produit-img").innerHTML = `<canvas height="800px" width="800px" id="produit-img-canvas" ></canvas>`;
  var canvas_e = document.querySelector('#produit-img-canvas');
  var ctx = canvas_e.getContext("2d");
  console.log("Changing the image");
  // Calque 1
  var img_calque1 = new Image(); 
  img_calque1.src = calque1;
  img_calque1.onload = function() {
    ctx.drawImage(img_calque1,0,0);
    // Calque 1
    var img_calque0 = new Image(); 
    img_calque0.src = calque0; 
    img_calque0.onload = function() {
      ctx.drawImage(img_calque0,0,0);
    };
  };  
 
}


function getCook(cookiename) 
  {
  // Get name followed by anything except a semicolon
  var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return atob(decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "").replace("@", "="));
  }
function setCook(cname, cvalue) 
{
    if ('btoa' in window) {
        cvalue = btoa(cvalue).replace("=", "@");
    }
    document.cookie = cname + "=" + cvalue + ";";

    
}
function first_generate_cookie()
{
  var panier = [];
  setCook("panier",JSON.stringify(panier))
  return panier;
}
function first_treat_cookie()
{
  var panier = JSON.parse(getCook("panier"));
  return panier;
}

function treat_panier()
{
  var color = document.getElementById('select-color').options[document.getElementById('select-color').selectedIndex].text;
  var quantity = document.getElementById('select-quantity').value;
  var article_id = document.getElementById('article-id').value;
  add_item_panier(article_id,color,quantity);
}
function add_item_panier(item_id,item_color = "red",item_quantity = 1)
{
  article = {"id":item_id,"color":item_color,"quantity":item_quantity};
  PANIER.push(article);
  save_cookie();
}
function delete_item_panier(id)
{
  PANIER.splice(id, 1);
  save_cookie();
}
function save_cookie()
{
  setCook("panier",JSON.stringify(PANIER))
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
  else if (WHERE == "/panier.html")
  {

    if (ARG.includes("supprimer-") && ARG.indexOf("supprimer-") == 1)
    {
      id = ARG.split("supprimer-")[1];
      if (!isNaN(id))
      {
        id = parseInt(id,10);
        delete_item_panier(id);
        document.location.href = "/panier.html";
      }
    }
    afficher_mon_panier();
  }
  
})
.catch(err => { throw err });

// Gestion du panier
if (getCook("panier") == "")
{
  PANIER = first_generate_cookie();
}
else
{
  PANIER = first_treat_cookie();
}
console.log("Panier",PANIER);



// Format cookie: 
// Panier = [{"id":<id>,"quantité":<quantité>,"modele":<modele>}]
// Compte = ["username":<username>]