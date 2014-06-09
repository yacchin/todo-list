;
(function() {
  // if (window.TouchEvent) {
  if ('ontouchend' in window) {
    console.log('touch device.');
    if (document.addEventListener) {
      function clone(obj) {
        var object = {};
        for (var i in obj) {
          object[i] = obj[i];
        }
        return object;
      };

      function initializeTouch(evt) {
        for (var i = 0; i < evt.touches.length; i++) {
          touchesStart[i] = clone(evt.touches[i]);
        }
      };

      function samplingTouch(evt) {
        for (var i = 0; i < evt.touches.length; i++) {
          touchesEnd[i] = clone(evt.touches[i]);
        }
        xdistance = touchesEnd[0].clientX - touchesStart[0].clientX; // + right / - left
        ydistance = touchesEnd[0].clientY - touchesStart[0].clientY; // - up / + down
        if (touchesStart.length && touchesEnd.length) {
          var touchEvt = document.createEvent('MouseEvents');
          var eventType = '';
          if (Math.abs(xdistance) > Math.abs(ydistance) && xdistance > 0) {
            evt.preventDefault();
            eventType = 'dragRight';
            if (Math.abs(xdistance) > distanceThreshold) eventType = 'preswipeRight';
          } else if (Math.abs(xdistance) > Math.abs(ydistance) && xdistance < 0) {
            evt.preventDefault();
            eventType = 'dragLeft';
            if (Math.abs(xdistance) > distanceThreshold) eventType = 'preswipeLeft';
          } else if (Math.abs(xdistance) < Math.abs(ydistance) && ydistance < 0) {
            evt.preventDefault();
            eventType = 'dragUp';
            if (Math.abs(ydistance) > distanceThreshold) eventType = 'preswipeUp';
          } else if (Math.abs(xdistance) < Math.abs(ydistance) && ydistance > 0) {
            evt.preventDefault();
            eventType = 'dragDown';
            if (Math.abs(ydistance) > distanceThreshold) eventType = 'preswipeDown';
          } else {
            eventType = 'nodrag';
          }
          touchEvt.initMouseEvent(eventType, true, true, window, 1, touchesStart[0].screenX, touchesStart[0].screenY, touchesStart[0].clientX, touchesStart[0].clientY, false, false, false, false, 0, null);
          touchEvt.clientXend = touchesEnd[0].clientX;
          touchEvt.clientYend = touchesEnd[0].clientY;
          touchEvt.clientXdistance = xdistance;
          touchEvt.clientYdistance = ydistance;
          touchesStart[0].target.dispatchEvent(touchEvt);
        }
      };

      function callEvents(evt) {
        evt.preventDefault();
        var touchEvt = document.createEvent('MouseEvents');
        var eventType = '';
        if (touchesStart.length && !touchesEnd.length) {
          if (touchesStart[0].target == document.elementFromPoint(touchesStart[0].clientX, touchesStart[0].clientY)) {
            eventType = 'tap';
          } else {
            eventType = 'scrollStop';
          }
        } else if (touchesStart.length && touchesEnd.length) {
          if (Math.abs(xdistance) > Math.abs(ydistance) && xdistance > 0 && Math.abs(xdistance) > distanceThreshold) {
            eventType = 'swipeRight';
          } else if (Math.abs(xdistance) > Math.abs(ydistance) && xdistance < 0 && Math.abs(xdistance) > distanceThreshold) {
            eventType = 'swipeLeft';
          } else if (Math.abs(xdistance) < Math.abs(ydistance) && ydistance < 0 && Math.abs(ydistance) > distanceThreshold) {
            eventType = 'swipeUp';
          } else if (Math.abs(xdistance) < Math.abs(ydistance) && ydistance > 0 && Math.abs(ydistance) > distanceThreshold) {
            eventType = 'swipeDown';
          } else {
            eventType = 'swipeCancel';
          }
          touchEvt.clientXend = touchesEnd[0].clientX;
          touchEvt.clientYend = touchesEnd[0].clientY;
          touchEvt.clientXdistance = xdistance;
          touchEvt.clientYdistance = ydistance;
        }
        touchEvt.initMouseEvent(eventType, true, true, window, 1, touchesStart[0].screenX, touchesStart[0].screenY, touchesStart[0].clientX, touchesStart[0].clientY, false, false, false, false, 0, null);
        touchesStart[0].target.dispatchEvent(touchEvt);
        touchesStart = [], touchesEnd = [];
        xdistance = 0, ydistance = 0;
        return false;
      };

      var touchesStart = [],
        touchesEnd = [];
      var xdistance = 0,
        ydistance = 0;
      var distanceThreshold = 40;

      document.addEventListener('touchstart', initializeTouch);
      document.addEventListener('touchmove', samplingTouch);
      document.addEventListener('touchend', callEvents);

      // document.addEventListener('tap', function(evt){
      //   console.log(evt);
      // });
    }
  } else {
    console.log('not touch device.');
    document.addEventListener('click', function(evt) {
      var touchEvt = document.createEvent('MouseEvents');
      touchEvt.initMouseEvent('tap', true, false);
      evt.target.dispatchEvent(touchEvt);
    });
  }
})();
