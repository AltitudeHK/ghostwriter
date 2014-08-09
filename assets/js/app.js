$(function() {
  AltitudeBlog.init();
});

var AltitudeBlog = {
  init: function() {
    // Init Isotope layout
    this.initIsotope();

    // Init scroll functionality
    this.initScroll();

    // Init next and previous posts
    this.initNextPrevPosts();
  },
  initIsotope: function() {
    var $container = $('.fluid-post-index');
    var $loader = $('.loader');
    var item = '.post-stub';
    var yGutter = 1;
    var xGutter = 0;
    var colWidth = function () {
      var w = $container.width(),
        columnNum = 1,
        columnWidth = 0;
      if (w > 1200) {
        columnNum  = 3;
      } else if (w > 900) {
        columnNum  = 3;
      } else if (w > 600) {
        columnNum  = 2;
      } else if (w > 300) {
        columnNum  = 1;
      }
      columnWidth = Math.floor(w/columnNum);
      $container.find(item).each(function() {
        var $post = $(this),
          multiplier_w = $post.attr('class').match(/post-w(\d)/),
          width = multiplier_w ? columnWidth*multiplier_w[1]-yGutter : columnWidth-yGutter;
        $post.css({
          width: width
        });
      });
      return columnWidth;
    };
    var isotope = function () {
      $container.isotope({
        resizable: false,
        itemSelector: item,
        masonry: {
          columnWidth: colWidth(),
          gutterWidth: xGutter
        }
      });
    };
    $(window).load(function(){
      isotope();
      $container.css('opacity', '1');
      $loader.css('opacity', '0');
    });
    $(window).smartresize(isotope);
  },
  initNextPrevPosts: function(){
    var curr = $('#curr-post-uuid').html(),
        $prevLink = $('.prev-post'),
        $nextLink = $('.next-post');

    $prevLink.hide();
    $nextLink.hide();

    $.get('/rss', function(d){
      var items = $(d).find('item');
      for (var i = 0; i < items.length; i++){
        var uuid = $(items[i]).find('guid').text();
        if (uuid === curr){
          if (i < items.length-1){
            $prevLink.attr('href', $(items[i+1]).find('link').text());
            $prevLink.show();
          }
          if (i > 0){
            $nextLink.attr('href', $(items[i-1]).find('link').text());
            $nextLink.show();
          }
        }
      }
    });
  },
  initScroll: function() {

    // Detects if device is mobile
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

    // Scroll up functionality
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
      // Display and hide floating nav
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