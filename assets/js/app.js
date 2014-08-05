$(function() {
  AltitudeBlog.init();
});

var AltitudeBlog = {
  init: function() {
    // Init Isotope layout
    this.initIsotope();

    // Init scroll functionality
    this.initScroll();
  },
  initIsotope: function() {

  },
  initScroll: function() {
    /* Detects if device is mobile */
    $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

    /*
     * Helper: Handle scrolls
     */
    var scrollTo = function(){
      var section = this.attr('data-section');
      var to = '#'+section;
      if (section) {
        $(document).scrollTo($(to).position().top, 500);
      }
    };

    /*
     * Helper: Checks if element is visible on viewport
     */
    $.fn.visible = function(partial) {

      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;

      return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };

    /* Scrolling */
    var $nav = $('#top-nav, #float-nav, #mobile-nav');
    $nav.find('.prevent-default, .go-to-top').click(function(e) {
      e.preventDefault();
      scrollTo.apply($(this));

      if ($('#mobile-nav').is(':visible')) {
        $('#mobile-nav ul').slideToggle();
      }
    });

    var $goToTop = $('.go-to-top');
    var $floatNav = $('#float-nav');

    // Handles mobile nav click
    $('#mobile-nav-icon').click(function() {
      $('#mobile-nav ul').slideToggle();
    });

    $(window).scroll(function() {
      // display and hide floating nav
      if ($(document).scrollTop() <= 87) {
        $floatNav.stop(true, true).css({'margin-top': '-80px'});
        $goToTop.css({'display': 'none'});
      }
      else {
        $floatNav.stop(true, true).css({'margin-top': '0px'});
        $goToTop.css({'display': 'block'});
      }
    });
  }
};