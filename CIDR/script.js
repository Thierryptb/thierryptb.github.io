var xmlns = "http://www.w3.org/2000/svg",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
  container = select('.container'),
  dragger = select('#dragger'),
  dragVal,
  maxDrag = 300;

TweenMax.set('svg', {
  visibility: 'visible'
});

TweenMax.set('#upText', {
  alpha: 0,
  transformOrigin: '50% 50%'
});

TweenLite.defaultEase = Elastic.easeOut.config(0.4, 0.1);

var tl = new TimelineMax({
  paused: true
});
tl.addLabel("blobUp")
  .to('#display', 1, {
    attr: {
      cy: '-=40',
      r: 30
    }
  })
  .to('#dragger', 1, {
    attr: {
      r: 8
    }
  }, '-=1')
  .set('#dragger', {
    strokeWidth: 4
  }, '-=1')
  .to('.downText', 1, {
    alpha: 0,
    transformOrigin: '50% 50%'
  }, '-=1')
  .to('.upText', 1, {
    alpha: 1,
    transformOrigin: '50% 50%'
  }, '-=1')
  .addPause()
  .addLabel("blobDown")
  .to('#display', 1, {
    attr: {
      cy: 299.5,
      r: 0
    },
    ease: Expo.easeOut
  })
  .to('#dragger', 1, {
    attr: {
      r: 15
    }
  }, '-=1')
  .set('#dragger', {
    strokeWidth: 0
  }, '-=1')
  .to('.downText', 1, {
    alpha: 1,
    ease: Power4.easeOut
  }, '-=1')
  .to('.upText', 0.2, {
    alpha: 0,
    ease: Power4.easeOut,
    attr: {
      y: '+=45'
    }
  }, '-=1');

Draggable.create(dragger, {
  type: 'x',
  cursor: 'pointer',
  throwProps: true,
  bounds: {
    minX: 0,
    maxX: maxDrag
  },
  onPress: function() {
    tl.play('blobUp');
  },
  onRelease: function() {
    tl.play('blobDown');
  },
  onDrag: dragUpdate,
  onThrowUpdate: dragUpdate
});

// Fonction pour calculer le nombre de réseaux disponibles en fonction de la position du curseur CIDR
function calculateNetworksAvailable(cidr) {
  return Math.pow(2, cidr); // Nombre de réseaux disponibles
}

function calculateHostsAvailable(ip, cidr) {
  var networkBits = 32 - cidr; // Nombre de bits à gauche du préfixe CIDR
  var hostsAvailable = Math.pow(2, networkBits); // Nombre d'IP disponibles
  return hostsAvailable;
}

function dragUpdate() {
  // Récupérer la valeur du curseur CIDR
  dragVal = Math.round((this.target._gsTransform.x / maxDrag) * 31) + 1;

  // Mise à jour du texte du CIDR
  select('.downText').textContent = select('.upText').textContent = dragVal;

  // Calculer le nombre de réseaux disponibles en fonction de la position du curseur CIDR
  var networksAvailable = calculateNetworksAvailable(dragVal);

  // Mise à jour du texte dans l'avant-dernier rectangle avec le résultat du calcul
  select('.subnet-count').textContent = "Nombre de réseaux disponibles : " + networksAvailable;

  // Calculer le nombre d'IP disponibles en fonction de l'adresse IP et du curseur CIDR sélectionnés
  var ipInput = document.getElementById('ipInput');
  var ip = ipInput.value;
  var hostsAvailable = calculateHostsAvailable(ip, dragVal);

  // Mise à jour du texte dans le dernier rectangle avec le résultat du calcul
  select('.hosts-count').textContent = "Nombre d'IP disponibles : " + hostsAvailable;

  // Détermination de l'octet et de la position du "1" dans la ligne
  var byteIndex = Math.floor((dragVal - 1) / 8);
  var bitIndex = (dragVal - 1) % 8;

  // Mise à jour des rectangles inférieurs avec le "1" se déplaçant
  var rectangles = document.querySelectorAll('.rectangle');
  for (var i = 0; i < rectangles.length; i++) {
    var binaryString = "00000000"; 
    var updatedString = binaryString.substr(0, bitIndex) + "1" + binaryString.substr(bitIndex + 1);

    // Mise à jour spécifique pour la deuxième ligne de rectangles
    if (i >= 4 && i <= 7) {
      rectangles[i].textContent = binaryString; // Remise à zéro

      // Mise à jour du rectangle correspondant au déplacement du "1"
      if (byteIndex === 0) {
        rectangles[i].textContent = updatedString;
      }
    } else if (i >= 8 && i <= 11) {
      rectangles[i].textContent = binaryString; // Remise à zéro

      // Mise à jour du rectangle correspondant au déplacement du "1"
      if (byteIndex === 1 && bitIndex >= (i - 8) && bitIndex < (i - 8 + 8)) {
        var bitOffset = bitIndex - (i - 8);
        var updatedString = binaryString.substr(0, bitOffset) + "1" + binaryString.substr(bitOffset + 1);
        rectangles[i].textContent = updatedString;
      }
    } else {
      rectangles[i].textContent = binaryString;
    }
  }

  // Animation du curseur et des textes
  TweenMax.to('#display', 1.3, {
    x: this.target._gsTransform.x
  });

  TweenMax.staggerTo(['.upText', '.downText'], 1, {
    cycle: {
      attr: [{
        x: this.target._gsTransform.x + 146
      }]
    },
    ease: Elastic.easeOut.config(1, 0.4)
  }, '0.02');

  // Mettre à jour les réseaux lorsque la valeur CIDR change
  updateNetworks();
}


// Fonction pour mettre à jour les réseaux lors du changement de la valeur CIDR
function updateNetworks() {
  // Obtenez l'adresse IP et la valeur CIDR
  var ipInput = document.getElementById('ipInput');
  if (!ipInput || !ipInput.value) {
    console.log("Veuillez entrer une adresse IP.");
    return;
  }
  var cidr = dragVal;

  // Convertir l'adresse IP en binaire
  var ip = ipInput.value.split('.').map(function(octet) {
    return parseInt(octet).toString(2).padStart(8, '0');
  });

  // Afficher l'adresse IP en binaire dans les 4 premiers rectangles
  var rectangles = document.querySelectorAll('.rectangle');
  for (var i = 0; i < 4; i++) {
    rectangles[i].textContent = ip[i];
  }

  // Déterminer l'octet et la position du "1" dans la ligne
  var byteIndex = Math.floor((cidr - 1) / 8);
  var bitIndex = (cidr - 1) % 8;

  // Afficher le déplacement du "1" dans les rectangles inférieurs
  for (var i = 4; i < rectangles.length; i++) {
    var binaryString = "0.0.0.0.0.0.0.0";
    if (i === byteIndex + 4) {
      var updatedString = binaryString.substr(0, bitIndex * 2) + "1" + binaryString.substr(bitIndex * 2 + 1);
      rectangles[i].textContent = updatedString;
    } else {
      rectangles[i].textContent = binaryString;
    }
  }
}

// Appeler la fonction de mise à jour lors du changement de la valeur CIDR
document.getElementById('ipInput').addEventListener('input', updateNetworks);


