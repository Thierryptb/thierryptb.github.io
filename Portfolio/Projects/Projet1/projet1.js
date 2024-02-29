$(window).mousemove(function (e) {
	$(".ring").css(
		"transform",
		`translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`
	);
});
document.addEventListener('DOMContentLoaded', function() {
	const openButton = document.getElementById('openButton');
	const popup = document.getElementById('popup');
  
	openButton.addEventListener('click', function() {
	  if (popup.style.display === 'block') {
		popup.style.display = 'none';
	  } else {
		popup.style.display = 'block';
	  }
	});
  });
  document.addEventListener('DOMContentLoaded', function() {
  const openButton = document.getElementById('openButton');
  const popup = document.getElementById('popup');

  openButton.addEventListener('click', function() {
    popup.classList.toggle('active'); // Ajoute ou supprime la classe 'active' lorsque le bouton est cliqué
  });
});

  
  