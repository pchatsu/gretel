/*
minScrollBar.js v.0.0.2
Copyright (c) 2013 SHIFTBRAIN Inc.
Licensed under the MIT license.

https://github.com/devjam
*/

(function() {

  this.minScrollBar = (function() {

    function minScrollBar(container, contents, config, onScroll) {
      var bgCss, bgpos, defaultConfig, handleCss,
        _this = this;
      if (onScroll == null) {
        onScroll = null;
      }
      if (typeof Util === "undefined" || Util === null) {
        console.log("ERROR: minScrollBar is REQUIRED util.js");
        return false;
      }
      this.onHandleMouseDown = function(e) {
        _this.isHandleMouseDown = true;
        _this.startPos = _this.handle.position().top - Util.cursor.pageXY(e).y;
        _this.container.unbind("touchstart", _this.areaDragStart);
        _this.container.unbind('touchmove', _this.areaDrag);
        $(document).bind('touchmove mousemove', _this.onHandleMove);
        $(document).bind('touchend mouseup', _this.onHandleMouseUp);
        if (_this.isTouch) {
          e.preventDefault();
        }
        e.stopPropagation();
        return false;
      };
      this.onHandleMouseUp = function(e) {
        _this.isHandleMouseDown = false;
        if (_this.isAreaMouseEnter) {
          _this.container.mouseenter();
        } else {
          _this.container.mouseleave();
        }
        $(document).unbind('touchmove mousemove', _this.onHandleMove);
        $(document).unbind('touchend mouseup', _this.onHandleMouseUp);
        _this.container.bind("touchstart", _this.areaDragStart);
        if (_this.isTouch) {
          e.preventDefault();
        }
        e.stopPropagation();
        return false;
      };
      this.onHandleMove = function(e) {
        var barSize, pos, ratio;
        barSize = _this.bg.height() - _this.handle.height();
        pos = _this.startPos + Util.cursor.pageXY(e).y;
        ratio = pos / barSize;
        ratio = Math.max(0, Math.min(1, ratio));
        _this.targetPos = ratio * (_this.contents.outerHeight(true) - _this.container.height());
        _this.update();
        if (_this.isTouch) {
          e.preventDefault();
        }
        e.stopPropagation();
        return false;
      };
      this.onWheel = function(event, delta, deltaX, deltaY) {
        if (_this.enable && _this.need) {
          _this.wheelForce -= delta * 1;
          _this.update();
        }
        return false;
      };
      this.areaDragStart = function(e) {
        if (_this.need && _this.enable) {
          _this.touchPos = Util.cursor.pageXY(e);
          _this.container.unbind("touchstart", _this.areaDragStart);
          $(document).bind('touchmove', _this.areaDrag);
          return $(document).bind('touchend', _this.areaDragEnd);
        }
      };
      this.areaDrag = function(e) {
        var oldy;
        if (_this.need && _this.enable) {
          oldy = _this.touchPos.y;
          _this.touchPos = Util.cursor.pageXY(e);
          _this.wheelForce += (oldy - _this.touchPos.y) * 0.5;
          _this.update();
          e.preventDefault();
          e.stopPropagation();
        }
        return false;
      };
      this.areaDragEnd = function(e) {
        _this.container.bind("touchstart", _this.areaDragStart);
        $(document).unbind('touchmove', _this.areaDrag);
        return $(document).unbind('touchend', _this.areaDragEnd);
      };
      this.update = function() {
        if (!_this.ticking && _this.enable) {
          _this.ticking = true;
          requestAnimationFrame(function() {
            var dist, maxT, t, top;
            _this.wheelForce *= 0.8;
            maxT = _this.contents.outerHeight(true) - _this.container.height();
            _this.targetPos += _this.wheelForce;
            t = _this.targetPos;
            if (_this.targetPos < 0) {
              _this.wheelForce = 0;
              _this.targetPos = 0;
            }
            if (_this.targetPos > maxT) {
              _this.wheelForce = 0;
              _this.targetPos = maxT;
            }
            top = _this.container.scrollTop();
            dist = (_this.targetPos - top) * _this.options.speed;
            _this.container.scrollTop(top + dist);
            _this.posFix();
            if (typeof _this.onScroll === "function") {
              _this.onScroll();
            }
            _this.ticking = false;
            if (((dist ^ (dist >> 31)) - (dist >> 31)) > 0.1) {
              return _this.update();
            }
          });
        }
        return null;
      };
      this.resize = function() {
        var areah, bodyh, pageh, pagey, ratio;
        if (typeof _this.onResize === "function") {
          _this.onResize();
        }
        areah = _this.container.height();
        pageh = _this.contents.outerHeight(true);
        pagey = _this.container.scrollTop();
        if (pagey > pageh - areah) {
          _this.container.scrollTop(pageh - areah);
        }
        _this.bg.height(areah);
        ratio = areah / pageh;
        if (ratio < 1) {
          _this.need = true;
        } else {
          ratio = 1;
          _this.need = false;
        }
        if (_this.need && _this.enable) {
          _this.bg.css("display", "block");
          _this.container.bind("mousewheel", _this.onWheel);
        } else {
          _this.bg.css("display", "none");
          _this.container.unbind("mousewheel", _this.onWheel);
        }
        bodyh = Math.max(_this.options.minHeight, ratio * areah);
        _this.handle.height(bodyh);
        return _this.posFix();
      };
      this.posFix = function() {
        var ratio;
        ratio = _this.container.scrollTop() / (_this.contents.outerHeight(true) - _this.container.height());
        _this.handle.css('top', ratio * (_this.bg.height() - _this.handle.height()));
        if (_this.bg.css("position") === "absolute") {
          return _this.bg.css('top', _this.container.scrollTop());
        }
      };
      defaultConfig = {
        speed: 0.2,
        minHeight: 100,
        bg_class: "scrollBarBg",
        handle_class: "scrollBarHandle"
      };
      this.options = $.extend(true, {}, defaultConfig, config);
      this.container = container;
      this.contents = contents;
      this.onScroll = onScroll;
      this.targetPos = 0;
      this.startPos = 0;
      this.wheelForce = 0;
      this.enable = false;
      this.need = false;
      this.isHandleMouseDown = false;
      this.isAreaMouseEnter = false;
      this.isTouch = "ontouchstart" in window;
      if (this.container.css("position") === "static") {
        this.container.css("position", "relative");
      }
      bgpos = "absolute";
      if (!Util.UA.isIE6) {
        if (this.container === window || this.container === document || this.container === $("body")) {
          this.container = $("body");
          bgpos = "fixed";
        }
      }
      bgCss = {
        position: bgpos,
        zIndex: 0x7FFFFFFF,
        top: 0,
        right: 0,
        height: this.container.height()
      };
      handleCss = {
        cursor: "pointer",
        position: 'absolute',
        top: 0,
        right: 0
      };
      this.bg = $('<div class="' + this.options["bg_class"] + '" />').css(bgCss).appendTo(this.container);
      this.handle = $('<div class="' + this.options["handle_class"] + '" />').css(handleCss).appendTo(this.bg);
      this.container.mouseleave(function() {
        _this.isAreaMouseEnter = false;
        if (!_this.isHandleMouseDown) {
          _this.handle.stop().queue([]);
          return _this.handle.fadeTo(100, 0.3);
        }
      }).mouseenter(function() {
        _this.isAreaMouseEnter = true;
        if (!_this.isHandleMouseDown) {
          _this.handle.stop().queue([]);
          return _this.handle.fadeTo(100, 0.3);
        }
      });
      this.bg.mouseenter(function() {
        if (!_this.isHandleMouseDown) {
          _this.handle.stop().queue([]);
          return _this.handle.fadeTo(100, 0.6);
        }
      });
      this.handle.bind('touchstart mousedown', this.onHandleMouseDown);
      this.container.bind("mousewheel", this.onWheel);
      this.container.bind("scroll", this.update);
      this.container.bind("touchstart", this.areaDragStart);
      Util.window.bindResize(this.resize);
      setTimeout(function() {
        return _this.resize();
      }, 0);
      this;

    }

    return minScrollBar;

  })();

}).call(this);
