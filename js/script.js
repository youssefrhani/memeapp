// Récupération des éléments HTML
const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const generateButton = document.querySelector('.generate-btn');
const textColorPicker = document.getElementById('textColor');
const textSizeSelect = document.getElementById('textSize');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

//  Variables globales
let uploadedImage = null;
let imgURL = ''; 

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

// 🔁 Mise à jour du texte en direct
topTextInput.addEventListener('input', genererMeme);
textColorPicker.addEventListener('input', genererMeme);
textSizeSelect.addEventListener('change', genererMeme);

//  Fonction principale de rendu
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
    const lignes = topText.split('\n');
    const ligneHeight = textSize + 10;
    let startY = 40;

    lignes.forEach((ligne, index) => {
      ctx.fillText(ligne, canvas.width / 2, startY + index * ligneHeight);
      ctx.strokeText(ligne, canvas.width / 2, startY + index * ligneHeight);
    });
  }
}


//  Ouvrir la modale et tenter upload
const modal = document.getElementById("memeModal");
const memePreview = document.getElementById("memePreview");
const closeModalBtn = document.getElementById("closeModal");
const downloadBtn = document.getElementById("downloadMeme");
const twitterBtn = document.getElementById("shareMeme");
const whatsappBtn = document.getElementById("shareWhatsapp");

generateButton.addEventListener("click", function () {
  if (!uploadedImage) {
    alert("Veuillez d'abord télécharger une image 📸");
    return;
  }

  genererMeme(); // Met à jour l’image

  //  Affiche d'abord la version locale
  canvas.toBlob(async (blob) => {
    const localURL = URL.createObjectURL(blob); // version locale
    memePreview.src = localURL;
    memePreview.setAttribute('data-url', localURL);
    modal.style.display = "flex";

    // 🌐 Upload à Imgur en arrière-plan
    try {
      const remoteUrl = await uploadToImgur(blob);
      imgURL = remoteUrl;
      memePreview.src = remoteUrl;
      memePreview.setAttribute('data-url', remoteUrl);
    } catch (err) {
      console.error("Erreur Imgur :", err);
      alert("Erreur lors de l’envoi vers Imgur ");
    }
  }, 'image/png');
});


//  Fermer la modale simplement
closeModalBtn.addEventListener("click", function () {
  modal.style.display = "none";
});


//  Télécharger l’image (toujours fonctionnel)
downloadBtn.addEventListener("click", function () {
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "mon_meme.png";
  link.click();
});


//  Partager sur Twitter
twitterBtn.addEventListener("click", () => {
  if (!imgURL) return alert('Mème non prêt à partager');

  const tweetText = encodeURIComponent("LOOL !");
  const twitterURL = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(imgURL)}`;
  window.open(twitterURL, "_blank");
});


// Partager sur WhatsApp
whatsappBtn.addEventListener("click", () => {
  if (!imgURL) return alert('Mème non prêt à partager');

  const message = encodeURIComponent("LOL");
  const whatsappURL = `https://wa.me/?text=${message}%20${encodeURIComponent(imgURL)}`;
  window.open(whatsappURL, "_blank");
});

async function uploadToImgur(blob) {
  const formData = new FormData();
  formData.append('image', blob);

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      Authorization: 'client id' 
    },
    body: formData
  });

  const result = await response.json();
  if (result.success) {
    return result.data.link;
  } else {
    throw new Error("L'upload vers Imgur a échoué.");
  }
}