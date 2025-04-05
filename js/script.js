//  Récupération des éléments HTML
const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const generateButton = document.querySelector('.generate-btn');
const textColorPicker = document.getElementById('textColor');
const textSizeSelect = document.getElementById('textSize');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

let uploadedImage = null;

//  Quand une image est sélectionnée
imageUpload.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      uploadedImage = img;
      genererMeme();
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

//  Mise à jour du mème lors des interactions
topTextInput.addEventListener('input', genererMeme);
textColorPicker.addEventListener('input', genererMeme);
textSizeSelect.addEventListener('change', genererMeme);
generateButton.addEventListener('click', genererMeme);

//  Fonction principale pour générer le mème
function genererMeme() {
  if (!uploadedImage) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

  const topText = topTextInput.value.trim();
  const textColor = textColorPicker.value;
  const textSize = parseInt(textSizeSelect.value);
  
  ctx.font = `bold ${textSize}px Comic Sans MS, sans-serif`;
  ctx.fillStyle = textColor;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';
  
  if (topText !== '') {
    const lignes = topText.split('\n'); // Découpé par saut à la ligne
    const ligneHeight = textSize + 10; // espace entre lignes
    let startY = 40; // Position initiale
  
    lignes.forEach((ligne, index) => {
      ctx.fillText(ligne, canvas.width / 2, startY + index * ligneHeight);
      ctx.strokeText(ligne, canvas.width / 2, startY + index * ligneHeight);
    });
  }
}

//  Références modale
const modal = document.getElementById("memeModal");
const memePreview = document.getElementById("memePreview");
const closeModalBtn = document.getElementById("closeModal");
const downloadBtn = document.getElementById("downloadMeme");
const shareBtn = document.getElementById("shareMeme");

// Clique sur "Générer un mème"
generateButton.addEventListener("click", function () {
  genererMeme(); // assure que le canvas est à jour
  const dataURL = canvas.toDataURL("image/png");
  memePreview.src = dataURL;
  modal.style.display = "flex";
});

// Fermer la modale
closeModalBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

// Télécharger l’image
downloadBtn.addEventListener("click", function () {
  const imgURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imgURL;
  link.download = "mon_meme.png";
  link.click();
});

// Partager sur Twitter
shareBtn.addEventListener("click", function () {
  const tweetText = encodeURIComponent("Regardez ce mème que j'ai créé !");
  const tweetURL = encodeURIComponent(window.location.href);
  const twitterURL = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetURL}`;
  window.open(twitterURL, "_blank");
});

