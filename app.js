const squares = document.querySelectorAll('.grid-item');
const socket = new WebSocket('ws://localhost:3000');

// Fonction pour changer la couleur d'un carré
function changeColor() {
  const randomColor = getRandomColor();
  this.style.backgroundColor = randomColor;
  socket.send(`${this.id},${randomColor}`); // Envoyer l'id et la nouvelle couleur au serveur WebSocket
}

// Fonction pour générer une couleur aléatoire
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Ajouter un écouteur d'événement pour détecter le clic sur chaque carré
squares.forEach((square) => {
  square.addEventListener('click', changeColor);
});

// Écouter les messages provenant du serveur WebSocket
socket.addEventListener('message', (event) => {
  const data = event.data.split(',');
  const squareId = data[0];
  const color = data[1];
  const square = document.getElementById(squareId);
  square.style.backgroundColor = color;
});

// Écouter les messages provenant du serveur WebSocket
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  const squareId = data.id;
  const color = data.color;
  const square = document.getElementById(squareId);
  square.style.backgroundColor = color;
  square.classList.add('color-transition'); // Ajouter la classe pour activer la transition
});