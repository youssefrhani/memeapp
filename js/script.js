// 🎉 Récupération des éléments HTML
const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const generateButton = document.querySelector('.generate-btn');
const textColorPicker = document.getElementById('textColor');
const textSizeSelect = document.getElementById('textSize');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

let uploadedImage = null;

// 📸 Quand une image est sélectionnée
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

// 📤 Mise à jour du mème lors des interactions
topTextInput.addEventListener('input', genererMeme);
textColorPicker.addEventListener('input', genererMeme);
textSizeSelect.addEventListener('change', genererMeme);
generateButton.addEventListener('click', genererMeme);

// 🖍️ Fonction principale pour générer le mème
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

