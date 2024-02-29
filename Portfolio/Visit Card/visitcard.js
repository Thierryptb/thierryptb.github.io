function chkmail(mail){
	var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
	return(reg.test(mail));
}

$(function(){
	$('#openContact').click(function(){
		$("#openContact").hide();
		$('#card').animate({top: -235}, 200);
		$('#container').animate({marginTop: -39}, 100);
		$('#card #text').append('<h2><a href="mailto:thierryptb97@gmail.com">thierryptb97@gmail.com</a></h2>');
	});

	$('#submit').click(function(){
		var name = $('#contact input[type=name]').val();
		if (name == '') {
			$('#contact input[type=name]').addClass('error').focus();
			return false;  
		} else {
			$('#contact input[type=name]').removeClass('error');
		}
		
		var email = $('#contact input[type=email]').val();
		if (!chkmail(email)) {
			$('#contact input[type=email]').addClass('error').focus();
			return false;  
		} else{
			$('#contact input[type=email]').removeClass('error');
		}
		
		var message = $('#contact textarea').val();
		if (message == '') {
			$('#contact textarea').addClass('error').focus();
			return false;  
		} else {
			$('#contact textarea').removeClass('error');
		}
		
		var datas = 'email='+ email + '&message=' + message + '&name=' + name;
		$.ajax({
			type: "GET",
			url: "send.php",
			data: datas,
			beforeSend: function() {
				$('#answer').fadeOut();
				$('#contact .loader').fadeIn();
				$('#contact input, #contact textarea').attr('disabled','disabled').animate({opacity: 0.5});
			},
			success: function(data) {
				$('#contact .loader').fadeOut();
				$('#answer').html(data).fadeIn();
			}
		});
		return false;
	});
	
	$('#social a').hover(function(){
		$(this).find('.normal').fadeOut(200);
		$(this).find('.hover').fadeIn(200);
	},function(){
		$(this).find('.normal').fadeIn(200);
		$(this).find('.hover').fadeOut(200);	
	})

	$('#dll a').hover(function(){
		$(this).find('.normal').fadeOut(200);
		$(this).find('.hover').fadeIn(200);
	},function(){
		$(this).find('.normal').fadeIn(200);
		$(this).find('.hover').fadeOut(200);	
	})
});
$(window).mousemove(function (e) {
	$(".ring").css(
		"transform",
		`translateX(calc(${e.clientX}px - 1.25rem)) translateY(calc(${e.clientY}px - 1.25rem))`
	);
});