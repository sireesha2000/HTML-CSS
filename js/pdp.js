$(document).ready(function(){
	var atr = $('.product-image > img');
	$('.im > img').click(function(){
		var imAtr = $(this).attr("src");
		atr.attr("src", imAtr);
	});
	$('.size').click(function () {
        $(this).toggleClass('size-toggled');
        var $size = $(this).val();
        if ($(this).val() == $size) {
            $('.size').removeClass('size-toggled');
            $(this).addClass('size-toggled');
        }   
    });
    $('.color').click(function () {
        $(this).toggleClass('color-toggled');
        var $color = $(this).val();
        if ($(this).val() == $color) {
            $('.color').removeClass('color-toggled');
            $(this).addClass('color-toggled');
        }   
    });
});