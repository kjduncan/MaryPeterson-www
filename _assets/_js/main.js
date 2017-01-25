$(function() {
    // Smooth scroll
    $('a[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
            console.log(target.offset().top);
          $('html, body').animate({
            scrollTop: target.offset().top-100
        }, 500);
          return false;
        }
      }
    });

  // Header nav-bar
  var bottomOfNav = $(".nav-bar").outerHeight(true) + $(".nav-bar").position().top;
  $(window).scroll(function() {
    var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollPos > bottomOfNav) {
      $(".sticky-nav").addClass("active");
    } else {
      $(".sticky-nav").removeClass("active");
    }
  });

});
