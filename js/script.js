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

  if (topText !== '') {
    ctx.font = `bold ${textSize}px Comic Sans MS, cursive, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';

    ctx.fillText(topText, canvas.width / 2, 40);
    ctx.strokeText(topText, canvas.width / 2, 40);
  }
}

