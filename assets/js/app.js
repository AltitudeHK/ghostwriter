$(function() {

  /* Detects if device is mobile */
  $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

  /*
   * Handles resize
   * Look into this: https://github.com/typekit/webfontloader
   */
  var _resizeHome = function() {

    // Page sections
    $('.page-section').css({
      'min-height': $(window).height()+'px'
    });

    // Splash sections
    var _screenH = $(window).height();
    var _topnavH = $('#top-nav').is(':visible') ? $('#top-nav').height() : 0;

    $('#home').css({
      'min-height': _screenH-_topnavH+'px',
      'padding'   : '0px'
    });

    var _splash = $('#home').find('.splash-text');
    _splash.css({
      'margin-top': (_splash.height() < _screenH-_topnavH ? ((_screenH-_topnavH)-_splash.height())/2 : 20)+'px'
    });

  };

  $(window).smartresize(function() {
    setTimeout(function() { _resizeHome(); }, 500);
  });

  $(window).bind('load', function() {
    $('.splash-text').slabText({ 'viewportBreakpoint':380 });
    _resizeHome();
  });

  /*
   * Helper for handling scrolls
   */
  var scrollTo = function(){
    var section = this.attr('data-section');
    var to = '#'+section;
    if (section) {
      $(document).scrollTo($(to).position().top, 500);
    }
  };

  /*
   * Checks if element is visible on viewport
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

    // animate product pictures on desktop
    if ($.browser !== 'device'){
      $('.product').each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.addClass('pullUp');
        }
      });
    }
  });

  // Call scroll event once to set the stage
  $(window).scroll();

  // Scroll to next section
  $('.next-section').click(function(e){
    scrollTo.apply($(this));
  });

  // Handles mobile nav click
  $('#mobile-nav-icon').click(function() {
    $('#mobile-nav ul').slideToggle();
  });

  /*
   * Handles contact
   */
  $('#contact input, #contact textarea').each(function() {
    var placeholder = $(this).attr('data-placeholder');
    $(this).val(placeholder);
    $(this).data('placeholder', placeholder);

    $(this).focus(function() {
        if ($(this).val() == placeholder) { $(this).val(''); }
    });
    $(this).blur(function() {
        if (!$(this).val()) { $(this).val(placeholder); }
    });
  });

  /* Helper: Flashes validation messages on screen */
  var flash = (function(){
    var $val = $('.validation-message p');
    var $valWindow = $('.validation-message');

    var flashMessage = function(msg){
      $val.html(msg);
      $valWindow.fadeIn(function() {
        clearTimeout(validation_timer);
        setTimeout(function() {
          $('.validation-message').fadeOut();
        }, 5000);
      });
    };

    return {
      flashMessage: flashMessage
    };

  })();

  $('.send-email').click(function(e) {
      e.preventDefault();

      // Form validation
      // name
      if (($('#contact_name').val() === '') || ($('#contact_name').val() === $('#contact_name').data('placeholder'))) {
        flash.flashMessage('Name is required.');
        return false;
      }

      // email
      if (($('#contact_email').val() === '') || ($('#contact_email').val() === $('#contact_email').data('placeholder'))) {
        flash.flashMessage('Your e-mail address is required.');
        return false;
      }
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test($('#contact_email').val())) {
        flash.flashMessage('Your e-mail address appears to be invalid.');
        return false;
      }
      // budget
      var budget = $('#contact_budget').val();
      if (!$.isNumeric(budget)){
        flash.flashMessage('Budget should be a number in Hong Kong dollars.');
        return false;
      }

      // message
      if (($('#contact_message').val() === '') || ($('#contact_message').val() === $('#contact_message').data('placeholder'))) {
        flash.flashMessage('Please let us know how we can help.');
        return false;
      }
      // End of form validation

      var self = $(this);
      var prevText = self.html();

      var params = $('#contact-footer').serialize();

      $.ajax({
        url: '/contact',
        type: 'POST',
        data: params,
        beforeSend: function (xhr) {
          $('#contact-footer input, #contact-footer textarea').attr('disabled', 'disabled');
          self.html('Sending...');
          $('.ajax-message').hide();
        },
        error: function() {
          console.log('papa', data);
          $('.ajax-message.error').not('.validation-message').fadeIn();
        },
        complete: function(data) {
          var response = {};
          if (data.responseText) response = JSON.parse(data.responseText);
          console.log('1',response);
          if (response.status && response.status === 'OK') {
            console.log('here');
            $('.ajax-message.success').fadeIn();
          } else {
            $('.ajax-message.error').not('.validation-message').fadeIn();
          }

          $('#contact-footer input, #contact-footer textarea').removeAttr('disabled');
          self.html(prevText);
        }
      });
  });

});