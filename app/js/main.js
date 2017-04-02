$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        items:1,
        navText: '',
        responsive:{
            0:{
                dots:true
            },
            600:{
                dots:false
            }
        }
    });
    $('.rating').rating({
        fx: 'half',
        image: 'img/decoration/rating.png',
        minimal: 1,
        titles: '',
        width: 17
    });
});