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
    if (!uploadedImage) {
      alert("Veuillez d'abord télécharger une image 📸");
      return;
    }
  
    genererMeme(); // Assure que le dessin est à jour
  
    // Convert to Blob and upload to Imgur
    canvas.toBlob(async (blob) => {
      if (!blob) return;
  
      try {
        imgURL = await uploadToImgur(blob); 
        memePreview.src = imgURL;
        memePreview.setAttribute('data-url', imgURL);
        modal.style.display = "flex";
      } catch (err) {
        alert("Erreur lors de l’envoi vers Imgur.");
        console.error(err);
      }
    }, 'image/png');
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

const twitterBtn = document.getElementById("shareMeme");

twitterBtn.addEventListener("click", () => {
  if (!imgURL) return alert('Mème non prêt à partager');

  const tweetText = encodeURIComponent("LOOL !");
  const twitterURL = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(imgURL)}`;
  window.open(twitterURL, "_blank");
});


// Partager sur Whatsapp

const whatsappBtn = document.getElementById("shareWhatsapp");

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
        Authorization: 'Client-ID' 
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