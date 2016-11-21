$(function() {

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
