const express = require('express');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // Module pour générer des identifiants uniques

const app = express();
const server = app.listen(3000, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});

const wss = new WebSocket.Server({ server });

// Map pour stocker les couleurs attribuées à chaque client
const clientColors = new Map();

// Gérer la connexion WebSocket
wss.on('connection', (ws) => {
  console.log('Nouvelle connexion WebSocket établie');

  // Générer un identifiant unique pour le client
  const clientId = uuidv4();

  // Générer une couleur aléatoire pour le client (si elle n'a pas déjà été attribuée)
  const clientColor = clientColors.get(clientId) || getRandomColor();

  // Envoyer l'identifiant et la couleur au client
  ws.send(JSON.stringify({ id: clientId, color: clientColor }));

  // Enregistrer la couleur attribuée pour ce client
  clientColors.set(clientId, clientColor);

  // Gérer les messages reçus du client WebSocket
  ws.on('message', (message) => {
    // Transmettre le message (couleur) à tous les utilisateurs connectés
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Gérer la déconnexion du client
  ws.on('close', () => {
    // Supprimer l'entrée de couleur du client lorsqu'il se déconnecte
    clientColors.delete(clientId);
    console.log('Client déconnecté');
  });
});

// Fonction pour générer une couleur aléatoire
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
