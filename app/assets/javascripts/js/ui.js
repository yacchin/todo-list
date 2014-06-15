(function() {
  'use strict';
  app.Utils = {
    getDate: function() {
      var today = new Date();
      var day = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      var month = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      var date = (function() {
        if (today.getDate() == 1) {
          return '1ST';
        } else if (today.getDate() == 2) {
          return '2ND';
        } else if (today.getDate() == 3) {
          return '3RD';
        } else {
          return '' + today.getDate() + 'TH';
        }
      })();
      return '' + day[today.getDay()] + ' ' + month[today.getMonth()] + ' ' + date;
    }
  };

  app.UI = {
    currentPage: 0,
    init: function() {
      $('.date').text(app.Utils.getDate());
      this.bindEvents();
    },
    bindEvents: function() {
      $('.header').on('dragLeft preswipeLeft dragRight preswipeRight', this.moveCard);
      $('.header').on('swipeLeft', this.nextCard);
      $('.header').on('swipeRight', this.prevCard);
    },
    moveCard: function(evt) {
      if ((evt.type == 'dragLeft' || evt.type == 'preswipeLeft') && app.UI.currentPage == 2) return;
      if ((evt.type == 'dragRight' || evt.type == 'preswipeRight') && app.UI.currentPage == 0) return;
      $('#todoapp').css('-webkit-transform', 'translateX(' + (evt.clientXdistance * 1.5 - 320 * app.UI.currentPage) + 'px)');
    },
    nextCard: function() {
      if (app.UI.currentPage == 2) return;
      app.UI.currentPage += 1;
      $('#todoapp').css('-webkit-transform', 'translateX(-' + (100 * app.UI.currentPage) + '%)');
    },
    prevCard: function() {
      if (app.UI.currentPage == 0) return;
      app.UI.currentPage -= 1;
      $('#todoapp').css('-webkit-transform', 'translateX(-' + (100 * app.UI.currentPage) + '%)');
    }
  };

  app.UI.init();
})();
