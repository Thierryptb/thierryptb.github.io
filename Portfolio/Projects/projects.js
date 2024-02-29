const swiper = new Swiper(".swiper", {
	direction: "horizontal",
	loop: false,
	speed: 1500,
	spaceBetween: 60,
	mousewheel: true,
	parallax: true,
	centeredSlides: true,
	effect: "coverflow",
	coverflowEffect: {
	  rotate: 40,
	  slideShadows: true
	},
	scrollbar: {
	  el: ".swiper-scrollbar"
	},
	breakpoints: {
	  0: {
		slidesPerView: 1,
		spaceBetween: 60
	  },
	  600: {
		slidesPerView: 2,
		spaceBetween: 60
	  },
	  1000: {
		slidesPerView: 3,
		spaceBetween: 60
	  },
	  1400: {
		slidesPerView: 4,
		spaceBetween: 60
	  },
	  2300: {
		slidesPerView: 5,
		spaceBetween: 60
	  },
	  2900: {
		slidesPerView: 6,
		spaceBetween: 60
	  }
	},
    on: {
        init: function () {
            this.on('touchMove', function (e) {
                e.preventDefault();
            }, {passive: true});
        },
    },
});
$(window).mousemove(function (e) {
	$(".ring").css(
		"transform",
		`translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`
	);
});