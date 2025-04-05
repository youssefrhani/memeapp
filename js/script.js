// Récupération des éléments HTML
const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const generateButton = document.querySelector('.generate-btn');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

// Image globale qui sera dessinée
let uploadedImage = null;

// Événement : lorsqu’on choisit un fichier image
imageUpload.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      uploadedImage = img;
      // Affiche immédiatement l’image avec texte
      genererMeme();
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

//  Texte dynamique : à chaque frappe dans le champ texte
topTextInput.addEventListener('input', genererMeme);

// À chaque clic sur le bouton "Générer un mème"
generateButton.addEventListener('click', genererMeme);

//  Fonction principale : dessine l’image et le texte
function genererMeme() {
  // Si aucune image téléchargée, ne rien faire
  if (!uploadedImage) return;

  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner l'image centrée, remplissant tout le canvas
  ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

  // Dessiner le texte du haut
  const topText = topTextInput.value;

  if (topText.trim() !== '') {
    ctx.font = 'bold 32px Comic Sans MS';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';

    // Position du texte : centré en haut avec un petit décalage
    ctx.fillText(topText, canvas.width / 2, 40);
    ctx.strokeText(topText, canvas.width / 2, 40);
  }
}

const topText = topTextInput.value;
const textColor = textColorPicker.value;
const textSize = parseInt(textSizeSelect.value);

