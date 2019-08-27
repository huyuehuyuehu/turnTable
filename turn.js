// JavaScript Document

//添加zepto fx modules
(function($,undefined){var prefix="",eventPrefix,endEventName,endAnimationName,vendors={Webkit:"webkit",Moz:"",O:"o"},document=window.document,testEl=document.createElement("div"),supportedTransforms=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,transform,transitionProperty,transitionDuration,transitionTiming,transitionDelay,animationName,animationDuration,animationTiming,animationDelay,cssReset={};function dasherize(str){return str.replace(/([a-z])([A-Z])/,"$1-$2").toLowerCase()}function normalizeEvent(name){return eventPrefix?eventPrefix+name:name.toLowerCase()}$.each(vendors,function(vendor,event){if(testEl.style[vendor+"TransitionProperty"]!==undefined){prefix="-"+vendor.toLowerCase()+"-";eventPrefix=event;return false}});transform=prefix+"transform";cssReset[transitionProperty=prefix+"transition-property"]=cssReset[transitionDuration=prefix+"transition-duration"]=cssReset[transitionDelay=prefix+"transition-delay"]=cssReset[transitionTiming=prefix+"transition-timing-function"]=cssReset[animationName=prefix+"animation-name"]=cssReset[animationDuration=prefix+"animation-duration"]=cssReset[animationDelay=prefix+"animation-delay"]=cssReset[animationTiming=prefix+"animation-timing-function"]="";$.fx={off:(eventPrefix===undefined&&testEl.style.transitionProperty===undefined),speeds:{_default:400,fast:200,slow:600},cssPrefix:prefix,transitionEnd:normalizeEvent("TransitionEnd"),animationEnd:normalizeEvent("AnimationEnd")};$.fn.animate=function(properties,duration,ease,callback,delay){if($.isFunction(duration)){callback=duration,ease=undefined,duration=undefined}if($.isFunction(ease)){callback=ease,ease=undefined}if($.isPlainObject(duration)){ease=duration.easing,callback=duration.complete,delay=duration.delay,duration=duration.duration}if(duration){duration=(typeof duration=="number"?duration:($.fx.speeds[duration]||$.fx.speeds._default))/1000}if(delay){delay=parseFloat(delay)/1000}return this.anim(properties,duration,ease,callback,delay)};$.fn.anim=function(properties,duration,ease,callback,delay){var key,cssValues={},cssProperties,transforms="",that=this,wrappedCallback,endEvent=$.fx.transitionEnd,fired=false;if(duration===undefined){duration=$.fx.speeds._default/1000}if(delay===undefined){delay=0}if($.fx.off){duration=0}if(typeof properties=="string"){cssValues[animationName]=properties;cssValues[animationDuration]=duration+"s";cssValues[animationDelay]=delay+"s";cssValues[animationTiming]=(ease||"linear");endEvent=$.fx.animationEnd}else{cssProperties=[];for(key in properties){if(supportedTransforms.test(key)){transforms+=key+"("+properties[key]+") "}else{cssValues[key]=properties[key],cssProperties.push(dasherize(key))}}if(transforms){cssValues[transform]=transforms,cssProperties.push(transform)}if(duration>0&&typeof properties==="object"){cssValues[transitionProperty]=cssProperties.join(", ");cssValues[transitionDuration]=duration+"s";cssValues[transitionDelay]=delay+"s";cssValues[transitionTiming]=(ease||"linear")}}wrappedCallback=function(event){if(typeof event!=="undefined"){if(event.target!==event.currentTarget){return}$(event.target).unbind(endEvent,wrappedCallback)}else{$(this).unbind(endEvent,wrappedCallback)}fired=true;$(this).css(cssReset);callback&&callback.call(this)};if(duration>0){this.bind(endEvent,wrappedCallback);setTimeout(function(){if(fired){return}wrappedCallback.call(that)},(duration*1000)+25)}this.size()&&this.get(0).clientLeft;this.css(cssValues);if(duration<=0){setTimeout(function(){that.each(function(){wrappedCallback.call(this)})},0)}return this};testEl=null})(Zepto);
//触摸事件
function Touch(){this._initX=0;this._finishX=0;this._startX=0;this._startY=0}Touch.prototype.touchStart=function(event){this._startX=event.touches[0].clientX;this._startY=event.touches[0].clientY;this._initX=this._startX};Touch.prototype.touchMove=function(event){var touches=event.touches;var _endX=event.touches[0].clientX;var _endY=event.touches[0].clientY;if(Math.abs(_endY-this._startY)>Math.abs(_endX-this._startX)){return}event.preventDefault();this._finishX=_endX;var _absX=Math.abs(_endX-this._startX);if(this._startX>_endX){_absX=-_absX}this._startX=_endX;return _absX};Touch.prototype.touchEnd=function(event){if(this._finishX==0){return}return this._initX-this._finishX;this._initX=0;this._finishX=0};

//焦点图
function Rotator(config){this.config=config;this.currentIndex=0;this.elem=$("#"+this.config.id);this.item=this.elem.find(".pic li");this.len=this.item.length;this.isNext=null;this.scrollTimer=null}Rotator.prototype.init=function(){if(this.elem.find(".dot").length>0){this.dotInit()}if(this.len>1){this.touchEvent()}if(this.config.is_autoplay&&this.len>1){this.autoplay()}};Rotator.prototype.dotInit=function(){var $dot=this.elem.find(".dot");var _txt="";for(var i=0;i<this.len;i++){_txt+="<li>"+i+"</li>"}$dot.html(_txt).find("li").eq(0).addClass("current");this.dotEvent()};Rotator.prototype.dotSet=function(){var $dot=this.elem.find(".dot");$dot.find("li").removeClass("current").eq(this.currentIndex).addClass("current")};Rotator.prototype.dotEvent=function(){var self=this;var $dot=self.elem.find(".dot");$dot.find("li").on("click",function(){self.currentIndex=$dot.find("li").index(this);self.picAnimate("dotClick")})};Rotator.prototype.touchEvent=function(){var self=this;var touch_elem=document.getElementById(self.config.id);var $pic=self.elem.find(".pic");var touch=new Touch();touch_elem.ontouchstart=function(event){touch.touchStart(event);if(self.config.is_autoplay){clearTimeout(self.scrollTimer)}};touch_elem.ontouchmove=function(event){var lastX=parseInt($pic.css("left"));var moveX=touch.touchMove(event);$pic.css("left",lastX+moveX+"px")};touch_elem.ontouchend=function(event){var client_width=document.documentElement.clientWidth;self.isNext=touch.touchEnd(event);if(self.config.is_onlyMovePic!=false){self.picAnimate()}else{if(client_width-parseInt($pic.find("li").width())*self.len-parseInt($pic.css("padding-left"))*2<0){self.picAnimate("nonLoop")}else{$pic.animate({"left":0})}}if(self.config.is_autoplay){self._slide()}};if(self.config.is_onlyMovePic==false){var orientationChange=function(){switch(window.orientation){case 0:$pic.css("left",0);this.currentIndex=0;break;case -90:$pic.css("left",0);this.currentIndex=0;break;case 90:$pic.css("left",0);this.currentIndex=0;break;case 180:$pic.css("left",0);this.currentIndex=0;break}};orientationChange();window.onorientationchange=orientationChange}};Rotator.prototype.picAnimate=function(type,callback){var $pic=this.elem.find(".pic");var _width=parseInt($pic.find("li").width());if(typeof type=="undefined"){var lastX=parseInt($pic.css("left"));var _index=0;if(lastX>0){_index=this.len-1}else{_index=Math.abs(lastX/_width);if(this.isNext>0){_index=Math.ceil(_index);if(_index==this.len){_index=0}}else{_index=Math.floor(_index)}}this.currentIndex=_index}else{if(type=="nonLoop"){var lastX=parseInt($pic.css("left"));var _index=0;var client_width=document.documentElement.clientWidth;var fix_width=parseInt($pic.css("padding-left"));var fix_index=Math.floor((client_width-fix_width)/_width);if(lastX>0){_index=0}else{_index=Math.abs(lastX/_width);if(this.isNext>0){_index=Math.ceil(_index);if(_index>this.len-fix_index){_index=this.len-fix_index}}else{_index=Math.floor(_index)}}this.currentIndex=_index}}if(this.elem.find(".dot").length>0){this.dotSet()}$pic.animate({"left":-_width*this.currentIndex+"px"},400,function(){if(typeof callback==="function"){callback()}})};Rotator.prototype.loadImg=function(img,callback){if(typeof img==="string"){img=[img]}var len=img.length;var i=0;var done=function(){if(i===len){if(typeof callback==="function"){callback()}}};$.each(img,function(index,el){var $img=$("<img />");$img.one("load",function(){i++;done()}).one("error",function(){i++;done()});$img.attr("src",el)})};Rotator.prototype._slide=function(){var self=this;self.scrollTimer=setTimeout(function(){var index=self.currentIndex;self.currentIndex++;if(index+1==self.len){self.currentIndex=0}var index2=self.currentIndex;var $item=self.item.eq(index);var $item2=self.item.eq(index2);var callback=function(){self.picAnimate("autoplay",function(){self._slide()})};if($item.data("imgLoaded")&&$item2.data("imgLoaded")){callback()}else{var src=$item.find("img").attr("src");var src2=$item2.find("img").attr("src");self.loadImg([src,src2],function(){$item.data("imgLoaded",true);$item2.data("imgLoaded",true);callback()})}},5000)};Rotator.prototype.autoplay=function(){var self=this;self._slide();self.elem.bind({"mouseover":function(){clearTimeout(self.scrollTimer)},"mouseleave":function(){self._slide()}})};



'use strict';
// 转盘js代码 开始
(function($) {
  var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
  for (var a=0;a<toCheck.length;a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];
  var IE = eval('"v"=="\v"');

  Zepto.extend(Zepto.fn, {
      rotate:function(parameters)
      {
          if (this.length===0||typeof parameters=="undefined") return;
              if (typeof parameters=="number") parameters={angle:parameters};
          var returned=[];
          for (var i=0,i0=this.length;i<i0;i++)
              {
                  var element=this.get(i);  
                  if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                      var paramClone = $.extend(true, {}, parameters); 
                      var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;

                      returned.push($(newRotObject));
                  }
                  else {
                      element.Wilq32.PhotoEffect._handleRotation(parameters);
                  }
              }
              return returned;
      },
      getRotateAngle: function(){
          var ret = [];
          for (var i=0,i0=this.length;i<i0;i++)
              {
                  var element=this.get(i);  
                  if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                      ret[i] = element.Wilq32.PhotoEffect._angle;
                  }
              }
              return ret;
      },
      stopRotate: function(){
          for (var i=0,i0=this.length;i<i0;i++)
              {
                  var element=this.get(i);  
                  if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                      clearTimeout(element.Wilq32.PhotoEffect._timer);
                  }
              }
      }
  });

  var Wilq32=window.Wilq32||{};
  Wilq32.PhotoEffect=(function(){

    if (supportedCSS) {
      return function(img,parameters){
        img.Wilq32 = {
          PhotoEffect: this
        };
              
              this._img = this._rootObj = this._eventObj = img;
              this._handleRotation(parameters);
      }
    } else {
      return function(img,parameters) {
        // Make sure that class and id are also copied - just in case you would like to refeer to an newly created object
              this._img = img;

        this._rootObj=document.createElement('span');
        this._rootObj.style.display="inline-block";
        this._rootObj.Wilq32 = 
          {
            PhotoEffect: this
          };
        img.parentNode.insertBefore(this._rootObj,img);
        
        if (img.complete) {
          this._Loader(parameters);
        } else {
          var self=this;
          // TODO: Remove jQuery dependency
          jQuery(this._img).bind("load", function()
          {
            self._Loader(parameters);
          });
        }
      }
    }
  })();

  Wilq32.PhotoEffect.prototype={
      _setupParameters : function (parameters){
      this._parameters = this._parameters || {};
          if (typeof this._angle !== "number") this._angle = 0 ;
          if (typeof parameters.angle==="number") this._angle = parameters.angle;
          this._parameters.animateTo = (typeof parameters.animateTo==="number") ? (parameters.animateTo) : (this._angle); 

          this._parameters.step = parameters.step || this._parameters.step || null;
      this._parameters.easing = parameters.easing || this._parameters.easing || function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }
      this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
          this._parameters.callback = parameters.callback || this._parameters.callback || function(){};
          if (parameters.bind && parameters.bind != this._parameters.bind) this._BindEvents(parameters.bind); 
    },
    _handleRotation : function(parameters){
            this._setupParameters(parameters);
            if (this._angle==this._parameters.animateTo) {
                this._rotate(this._angle);
            }
            else { 
                this._animateStart();          
            }
    },

    _BindEvents:function(events){
      if (events && this._eventObj) 
      {
              // Unbinding previous Events
              if (this._parameters.bind){
                  var oldEvents = this._parameters.bind;
                  for (var a in oldEvents) if (oldEvents.hasOwnProperty(a)) 
                          // TODO: Remove jQuery dependency
                          jQuery(this._eventObj).unbind(a,oldEvents[a]);
              }

              this._parameters.bind = events;
        for (var a in events) if (events.hasOwnProperty(a)) 
          // TODO: Remove jQuery dependency
            jQuery(this._eventObj).bind(a,events[a]);
      }
    },

    _Loader:(function()
    {
      if (IE)
      return function(parameters)
      {
        var width=this._img.width;
        var height=this._img.height;
        this._img.parentNode.removeChild(this._img);
                
        this._vimage = this.createVMLNode('image');
        this._vimage.src=this._img.src;
        this._vimage.style.height=height+"px";
        this._vimage.style.width=width+"px";
        this._vimage.style.position="absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
        this._vimage.style.top = "0px";
        this._vimage.style.left = "0px";

        /* Group minifying a small 1px precision problem when rotating object */
        this._container =  this.createVMLNode('group');
        this._container.style.width=width;
        this._container.style.height=height;
        this._container.style.position="absolute";
        this._container.setAttribute('coordsize',width-1+','+(height-1)); // This -1, -1 trying to fix ugly problem with small displacement on IE
        this._container.appendChild(this._vimage);
        
        this._rootObj.appendChild(this._container);
        this._rootObj.style.position="relative"; // FIXES IE PROBLEM
        this._rootObj.style.width=width+"px";
        this._rootObj.style.height=height+"px";
        this._rootObj.setAttribute('id',this._img.getAttribute('id'));
        this._rootObj.className=this._img.className;      
          this._eventObj = this._rootObj; 
          this._handleRotation(parameters); 
      }
      else
      return function (parameters)
      {
        this._rootObj.setAttribute('id',this._img.getAttribute('id'));
        this._rootObj.className=this._img.className;
        
        this._width=this._img.width;
        this._height=this._img.height;
        this._widthHalf=this._width/2; // used for optimisation
        this._heightHalf=this._height/2;// used for optimisation
        
        var _widthMax=Math.sqrt((this._height)*(this._height) + (this._width) * (this._width));

        this._widthAdd = _widthMax - this._width;
        this._heightAdd = _widthMax - this._height; // widthMax because maxWidth=maxHeight
        this._widthAddHalf=this._widthAdd/2; // used for optimisation
        this._heightAddHalf=this._heightAdd/2;// used for optimisation
        
        this._img.parentNode.removeChild(this._img);  
        
        this._aspectW = ((parseInt(this._img.style.width,10)) || this._width)/this._img.width;
        this._aspectH = ((parseInt(this._img.style.height,10)) || this._height)/this._img.height;
        
        this._canvas=document.createElement('canvas');
        this._canvas.setAttribute('width',this._width);
        this._canvas.style.position="relative";
        this._canvas.style.left = -this._widthAddHalf + "px";
        this._canvas.style.top = -this._heightAddHalf + "px";
        this._canvas.Wilq32 = this._rootObj.Wilq32;
        
        this._rootObj.appendChild(this._canvas);
        this._rootObj.style.width=this._width+"px";
        this._rootObj.style.height=this._height+"px";
              this._eventObj = this._canvas;
        
        this._cnv=this._canvas.getContext('2d');
              this._handleRotation(parameters);
      }
    })(),

    _animateStart:function()
    { 
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._animateStartTime = +new Date;
      this._animateStartAngle = this._angle;
      this._animate();
    },
      _animate:function()
      {
           var actualTime = +new Date;
           var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

           // TODO: Bug for animatedGif for static rotation ? (to test)
           if (checkEnd && !this._parameters.animatedGif) 
           {
               clearTimeout(this._timer);
           }
           else 
           {
               if (this._canvas||this._vimage||this._img) {
                   var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                   this._rotate((~~(angle*10))/10);
               }
               if (this._parameters.step) {
                  this._parameters.step(this._angle);
               }
               var self = this;
               this._timer = setTimeout(function()
                       {
                       self._animate.call(self);
                       }, 10);
           }

           // To fix Bug that prevents using recursive function in callback I moved this function to back
           if (this._parameters.callback && checkEnd){
               this._angle = this._parameters.animateTo;
               this._rotate(this._angle);
               this._parameters.callback.call(this._rootObj);
           }
       },

    _rotate : (function()
    {
      var rad = Math.PI/180;
      if (IE)
      return function(angle)
      {
              this._angle = angle;
        this._container.style.rotation=(angle%360)+"deg";
      }
      else if (supportedCSS)
      return function(angle){
              this._angle = angle;
        this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";
      }
      else 
      return function(angle)
      {
              this._angle = angle;
        angle=(angle%360)* rad;
        // clear canvas 
        this._canvas.width = this._width+this._widthAdd;
        this._canvas.height = this._height+this._heightAdd;
              
        // REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..
        this._cnv.translate(this._widthAddHalf,this._heightAddHalf);  // at least center image on screen
        this._cnv.translate(this._widthHalf,this._heightHalf);      // we move image back to its orginal 
        this._cnv.rotate(angle);                    // rotate image
        this._cnv.translate(-this._widthHalf,-this._heightHalf);    // move image to its center, so we can rotate around its center
        this._cnv.scale(this._aspectW,this._aspectH); // SCALE - if needed ;)
        this._cnv.drawImage(this._img, 0, 0);             // First - we draw image
      }

    })()
  }

  if (IE)
  {
  Wilq32.PhotoEffect.prototype.createVMLNode=(function(){
  document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
      try {
        !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
        return function (tagName) {
          return document.createElement('<rvml:' + tagName + ' class="rvml">');
        };
      } catch (e) {
        return function (tagName) {
          return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
        };
      }   
  })();
  }
})(Zepto);
// JavaScript Document
// 转盘js代码 结束
/*
  $.fn.dataNew
  $.fn.removeDataNew
  As the data method in zepto is not good
*/
;(function($, undefined){
  var store = [];

  var getData = function(name, el){
    var item, objArr;
    var result;
    $.each(store, function(i, v){
      item = v.el;
      if(item === el){
        objArr = v.obj;
        $.each(objArr, function(i, v){
          if(v.name === name){
            result = v.value;
            return false;
          }
        });
        return false;
      }
    });
    return result;
  }

  var setData = function(name, value){
    var found = false;
    var me = this;
    $.each(store, function(i, v){
      if(v.el === me){
        var obj = v.obj;
        var flag = false;
        $.each(obj, function(i2, v2){
          if(v2.name === name){ // the same name
            v2.value = value;
            flag = true;
            return false;
          }
        });
        if(!flag){ // not overwrite the name
          v.obj.push({
            name: name,
            value: value
          });
        }
        found = true;
        return false;
      }
    });
    if(!found){ // not found
      store.push({
        el: me,
        obj: [{
          name: name,
          value: value
        }]
      });
    }
  }

  var removeData = function(name){
    var me = this;
    $.each(store, function(i, v){
      if(v.el === me){
        var obj = v.obj;
        $.each(obj, function(i2, v2){
          if(v2.name === name){
            obj.splice(i2, 1);
            return false;
          }
        });
        return false;
      }
    })
  }

  $.fn.dataNew = function(name, value){
    if(value === undefined){
      return getData(name, this[0]);
    }else{
      return this.each(function(){
        setData.call(this, name, value);
      });
    }
  }

  $.fn.removeDataNew = function(name){
    return this.each(function(){
      removeData.call(this, name);
    });
  }

})(Zepto);

/*
  module fx
  $.fn.animate
  $.fn.stop -- by custom defined
*/
;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay,
    cssReset = {};
  var DATA_NAME = 'anim';

  function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionDelay    = prefix + 'transition-delay'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationDelay     = prefix + 'animation-delay'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.getComputedStyle = function(property){
    var element = this[0], computedStyle = getComputedStyle(element, '')
    if(!element) return
    if (typeof property == 'string')
      return computedStyle.getPropertyValue(property)
    else if (isArray(property)) {
      var props = {}
      $.each(isArray(property) ? property: [property], function(_, prop){
        props[prop] = computedStyle.getPropertyValue(prop);
      })
      return props
    }
  }

  $.fn.animate = function(properties, duration, ease, callback, delay){
    if ($.isFunction(duration))
      callback = duration, ease = undefined, duration = undefined
    if ($.isFunction(ease))
      callback = ease, ease = undefined
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    if (delay) delay = parseFloat(delay) / 1000
    return this.anim(properties, duration, ease, callback, delay)
  }

  $.fn.anim = function(properties, duration, ease, callback, delay){
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
        fired = false;

    if (duration === undefined) duration = $.fx.speeds._default / 1000
    if (delay === undefined) delay = 0
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event, flag){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      } else
        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

      fired = true;
      $(this).css(cssReset);
      $(this).removeDataNew(DATA_NAME);
      clearTimeout(timeout);

      if(flag === undefined || flag === true){ // it is used in $.fn.stop
        callback && callback.call(this);
      }
    }
    var timeout;
    if (duration > 0){
      this.bind(endEvent, wrappedCallback)
      // transitionEnd is not always firing on older Android phones
      // so make sure it gets fired
      timeout = setTimeout(function(){
        if (fired) return;
        wrappedCallback.call(that)
      }, (duration * 1000) + 25)
    }

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues);

    // store the animation para
    this.dataNew(DATA_NAME, {
      callback: wrappedCallback,
      properties: properties
    });

    if (duration <= 0){
      timeout = setTimeout(function() {
        that.each(function(){ wrappedCallback.call(this) })
      }, 0);
    }

    return this
  }

  testEl = null;

  !function(){
    var stopHandle = function(bool){
      bool = bool || false;
      var $this = $(this);
      var data = $this.dataNew(DATA_NAME);
      if(data === undefined){ // 说明已经调用过了 callback
        return;
      }
      var properties = data.properties;
      var callback = data.callback;
      if(typeof properties === 'string'){
        console.log('not support @keyframe patter')
        return;
      }
      if(bool === true){
        $this.css(properties);
      }else{
        for(var key in properties){
          if(supportedTransforms.test(key)){
            $this.css(transform, $this.getComputedStyle(transform));
          }else{
            $this.css(key, $this.getComputedStyle(key));
          }
        }
      }
      callback.call(this, undefined, bool);
    }
    $.fn.stop = function(bool){
      return this.each(function(){
        stopHandle.call(this, bool);
      });
    }
  }();
})(Zepto);

/*
  module callbacks
  $.Callbacks for use in "deferred" module
*/
;(function($){
  // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
  $.Callbacks = function(options) {
    options = $.extend({}, options)

    var memory, // Last fire value (for non-forgettable lists)
        fired,  // Flag to know if list was already fired
        firing, // Flag to know if list is currently firing
        firingStart, // First callback to fire (used internally by add and fireWith)
        firingLength, // End of the loop when firing
        firingIndex, // Index of currently firing callback (modified by remove if needed)
        list = [], // Actual callback list
        stack = !options.once && [], // Stack of fire calls for repeatable lists
        fire = function(data) {
          memory = options.memory && data
          fired = true
          firingIndex = firingStart || 0
          firingStart = 0
          firingLength = list.length
          firing = true
          for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
              memory = false
              break
            }
          }
          firing = false
          if (list) {
            if (stack) stack.length && fire(stack.shift())
            else if (memory) list.length = 0
            else Callbacks.disable()
          }
        },

        Callbacks = {
          add: function() {
            if (list) {
              var start = list.length,
                  add = function(args) {
                    $.each(args, function(_, arg){
                      if (typeof arg === "function") {
                        if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                      }
                      else if (arg && arg.length && typeof arg !== 'string') add(arg)
                    })
                  }
              add(arguments)
              if (firing) firingLength = list.length
              else if (memory) {
                firingStart = start
                fire(memory)
              }
            }
            return this
          },
          remove: function() {
            if (list) {
              $.each(arguments, function(_, arg){
                var index
                while ((index = $.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1)
                  // Handle firing indexes
                  if (firing) {
                    if (index <= firingLength) --firingLength
                    if (index <= firingIndex) --firingIndex
                  }
                }
              })
            }
            return this
          },
          has: function(fn) {
            return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
          },
          empty: function() {
            firingLength = list.length = 0
            return this
          },
          disable: function() {
            list = stack = memory = undefined
            return this
          },
          disabled: function() {
            return !list
          },
          lock: function() {
            stack = undefined;
            if (!memory) Callbacks.disable()
            return this
          },
          locked: function() {
            return !stack
          },
          fireWith: function(context, args) {
            if (list && (!fired || stack)) {
              args = args || []
              args = [context, args.slice ? args.slice() : args]
              if (firing) stack.push(args)
              else fire(args)
            }
            return this
          },
          fire: function() {
            return Callbacks.fireWith(this, arguments)
          },
          fired: function() {
            return !!fired
          }
        }

    return Callbacks
  }
})(Zepto);

/*
  module $.deferred
*/
;(function($){
  var slice = Array.prototype.slice

  function Deferred(func) {
    var tuples = [
          // action, add listener, listener list, final state
          [ "resolve", "done", $.Callbacks({once:1, memory:1}), "resolved" ],
          [ "reject", "fail", $.Callbacks({once:1, memory:1}), "rejected" ],
          [ "notify", "progress", $.Callbacks({memory:1}) ]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state
          },
          always: function() {
            deferred.done(arguments).fail(arguments)
            return this
          },
          then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
            var fns = arguments
            return Deferred(function(defer){
              $.each(tuples, function(i, tuple){
                var fn = $.isFunction(fns[i]) && fns[i]
                deferred[tuple[1]](function(){
                  var returned = fn && fn.apply(this, arguments)
                  if (returned && $.isFunction(returned.promise)) {
                    returned.promise()
                      .done(defer.resolve)
                      .fail(defer.reject)
                      .progress(defer.notify)
                  } else {
                    var context = this === promise ? defer.promise() : this,
                        values = fn ? [returned] : arguments
                    defer[tuple[0] + "With"](context, values)
                  }
                })
              })
              fns = null
            }).promise()
          },

          promise: function(obj) {
            return obj != null ? $.extend( obj, promise ) : promise
          }
        },
        deferred = {}

    $.each(tuples, function(i, tuple){
      var list = tuple[2],
          stateString = tuple[3]

      promise[tuple[1]] = list.add

      if (stateString) {
        list.add(function(){
          state = stateString
        }, tuples[i^1][2].disable, tuples[2][2].lock)
      }

      deferred[tuple[0]] = function(){
        deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
        return this
      }
      deferred[tuple[0] + "With"] = list.fireWith
    })

    promise.promise(deferred)
    if (func) func.call(deferred, deferred)
    return deferred
  }

  $.when = function(sub) {
    var resolveValues = slice.call(arguments),
        len = resolveValues.length,
        i = 0,
        remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
        deferred = remain === 1 ? sub : Deferred(),
        progressValues, progressContexts, resolveContexts,
        updateFn = function(i, ctx, val){
          return function(value){
            ctx[i] = this
            val[i] = arguments.length > 1 ? slice.call(arguments) : value
            if (val === progressValues) {
              deferred.notifyWith(ctx, val)
            } else if (!(--remain)) {
              deferred.resolveWith(ctx, val)
            }
          }
        }

    if (len > 1) {
      progressValues = new Array(len)
      progressContexts = new Array(len)
      resolveContexts = new Array(len)
      for ( ; i < len; ++i ) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise()
            .done(updateFn(i, resolveContexts, resolveValues))
            .fail(deferred.reject)
            .progress(updateFn(i, progressContexts, progressValues))
        } else {
          --remain
        }
      }
    }
    if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
    return deferred.promise()
  }

  $.Deferred = Deferred
})(Zepto);

/*
  module stack
*/
;(function($){
  $.fn.end = function(){
    return this.prevObject || $()
  }

  $.fn.andSelf = function(){
    return this.add(this.prevObject || $())
  }

  'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function(property){
    var fn = $.fn[property]
    $.fn[property] = function(){
      var ret = fn.apply(this, arguments)
      ret.prevObject = this
      return ret
    }
  })
})(Zepto);

;(function($){
  var $valentineMain = $(".popupTurntable");                //页面主体
  var $qxPopup       = $(".popup");                      //所有弹框
  var $playBtn       = $valentineMain.find(".play_btn");    //开始抽奖按钮
  var $btnTurntable  = $(".btnTurntable");    //转盘按钮
  var $btnRank       = $(".btnRank");     //排行榜按钮
  var $btnRule       = $(".rightIcon"); //活动规则按钮
  var $btnExplain    = $(".activity_btn");//活动说明
  var $btnList       =$(".btn_list ul li");//切换按钮
  var $contentList   =$(".content_list");
  var $btnMessList   =$(".mess");
  var $btnSelectAll  =$(".btnSelectAll");//全选
  var $btnDeleteSelect  =$(".btnDeleteSelect");//删除所选

  /*弹框初始化*/
  var $popnode = {};
  var LightboxV2 = PA.ui.LightboxV2;
  $popnode.popupTurntable      = new LightboxV2({target: $(".popupTurntable")});     //转盘弹层
  $popnode.popupGetPrize       = new LightboxV2({target: $(".popupGetPrize")});  //获得奖励弹层
  $popnode.popupRechargeTips   = new LightboxV2({target: $(".popupRechargeTips")});  //充值提示弹层
  $popnode.popupMessageList    = new LightboxV2({target: $(".popupMessageList")});            //消息列表弹层
  $popnode.popupMessage        = new LightboxV2({target: $(".popupMessage")});     //通用弹窗消息弹层
  $popnode.popupExplain        = new LightboxV2({target: $(".popupExplain")});     //活动说明弹层
  $popnode.popupRule           = new LightboxV2({target: $(".popupRule")});     //活动规则弹层
  $popnode.popupRank           = new LightboxV2({
    target: $(".popup_rank"),
    positionMiddle: false
  });     //排行榜
  $popnode.tongyong            = new LightboxV2({target: $(".popupTips")});     //


  if(isHideTip == 0){
    $btnTurntable.hide();
  }
  if(isPlay == 1){//明日再来
    $('.play_btn .allbtn-dec').removeClass('raffle-btn').addClass('tomorrow-btn');
    $('.btnTurntable .red').hide();
  }else{
    $('.play_btn .allbtn-dec').removeClass('tomorrow-btn').addClass('raffle-btn');
    $('.btnTurntable .red').show();
  }
  if(msgNum == 0){
    $('.mess .redIcon').hide();
  }
  if(prizeList && prizeList.length > 0){
    var temp = $('.zhuanpan .prizeList div em');
    for (var i = 0; i < prizeList.length; i++) {
      temp.eq(i).html(prizeList[i].prize_amount);
    }
  }
  function mar(){
    //顶部跑马灯轮播效果
    var speed=40;
    var tab=document.getElementById("scroll");
    var tab1=document.getElementById("scroll1");
    var tab2=document.getElementById("scroll2");
    var MyMar=setInterval(Marquee,speed);
    tab2.innerHTML=tab1.innerHTML;  

    function Marquee(){      
        if(tab2.offsetWidth-tab.scrollLeft<=0)
            tab.scrollLeft-=tab1.offsetWidth;
        else{
            tab.scrollLeft++;
        }
    }

    tab.ontouchmove = function() {
        clearInterval(MyMar)
    }

    tab.ontouchend = function() {
        MyMar=setInterval(Marquee,speed)
    };
  }

  function marData(callback){      
    if ( $(this).data("isAjaxing") == true) { return; }
    $(this).data("isAjaxing",true);
    $.ajax({
        type: 'GET',
        url: '?act=activity_pkdomsdraw_act&st=get_scroll',
        dataType: 'json',
        timeout: 20000,
        success: function success(data) {
          if(data.code == 1000){
            var scroll1 = $("#scroll1");
            var html = '';
            if(data.msg.length > 0){
              for (var i = 0; i < data.msg.length; i++) {
                html += "<span>" + data.msg[i] +"</span>";
              }
            }else{
              html = '暂无数据~'
            }
            scroll1.html(html);
            mar();            
          }
        }
    });
  }
  
  //滚动公告先请求数据，再执行滚动
  marData(mar());

  //转盘
  function panelBoard(){
    var $cover = $(".popup");
    var $playBoard = $('.zhuanpan');
    // var Cover = new PA.ui.LightboxV2({target: $cover});
    var $lock = $("#lock");
    var rotateTimeOut = function (msg){
      $playBoard.rotate({
        angle:0,
        animateTo:24,
        duration:2000,
        callback:function (){
          $lock.val("0");
        }
      });
    };
    var bRotate = false;
    var rotateFn = function (awards, angles, alert){
      bRotate = !bRotate;
      var angleNow = Math.floor($playBoard.getRotateAngle());
      var re = Math.floor(angleNow % 360);
      re = 360 - re + angleNow + Number(angles) + 1800;
      $playBoard.stopRotate();
      $playBoard.rotate({
        angle:angleNow,
        animateTo:re,
        duration:6000,
        callback:function (){
          alert.show().hideDelay(5000);
          bRotate = !bRotate;
          //rotateTimeOut();
        }
      })
    };

    var rotateAjax = function(){
      $lock.val("1");
      var angleNow = Math.floor($playBoard.getRotateAngle());
      $playBoard.rotate({
        angle:angleNow,
        animateTo:angleNow + 180000,
        duration:600000,
        callback:function (){
          bRotate = !bRotate;
        }
      })
      var aj = $.ajax({
          url: '?act=activity_pkdomsdraw_act&st=play',
          dataType: 'json',
          type: 'POST',
          timeout: 20000
      });
      var done = function(data){
        $lock.val("0");
        var code = data.code;
        if(code == '1000'){            
            $('.popupTurntable .play_btn .days').html('('+ data.resetDay +'天)');
            var item = data.prizeId;
            var curAlert = $popnode.popupGetPrize;
            $popnode.popupGetPrize.getDom().find(".getPrize").html(data.prizeName);
            $popnode.popupTurntable.hookHidden(function(){
              rotateTimeOut();
              document.location.reload();
            });
            setTimeout(function(){
              if(data.isPlay == 1){
                $('.play_btn .allbtn-dec').removeClass('raffle-btn').addClass('tomorrow-btn');
                $('.btnTurntable .red').hide();
              }else{
                $('.play_btn .allbtn-dec').removeClass('tomorrow-btn').addClass('raffle-btn');
                $('.btnTurntable .red').show();
              }
            }, 3000);
            //0默认1下载2分享
            switch (item) {
                case '1'://100欢乐值
                  rotateFn(1, 316, curAlert);
                  break;
                case '2'://200欢乐值
                  rotateFn(2, 272, curAlert);
                  break;
                case '3'://500欢乐值
                  rotateFn(3, 225, curAlert);
                  break;
                case '4'://2000欢乐值
                  rotateFn(4, 180, curAlert);
                  break;
                case '5'://10000欢乐值
                  rotateFn(5, 135, curAlert);
                  break;
                case '6'://0.1元现金券
                  rotateFn(6, 90, curAlert);
                  break;
                case '7'://0.2元现金券
                  rotateFn(7, 45, curAlert);
                  break;
                case '8'://1元现金券
                  rotateFn(8, 0, curAlert);
                  break;
                default:
                  rotateFn(0, 24, $popnode.tongyong);
                  $popnode.tongyong.getDom().find(".tips").html('此奖品不存在，您有篡改数据的嫌疑，您的账号有可能会被禁用。');
                  break;
            }
        }else if(code == '3001'){//充值提示弹层
            $popnode.popupRechargeTips.show();
            rotateTimeOut();
            $popnode.popupTurntable.hide();
        }else{//其他异常，例如参数错误，网络异常！
            $popnode.tongyong.getDom().find("p").html(data.msg);
            $popnode.tongyong.show();
            rotateTimeOut();
        }
      }
      aj.done(done);
    }
    $playBtn.click(function (){
      if(isLogin == 0){
          $popnode.tongyong.getDom().find("p").html("您还未登录，请先去登录！");
          $popnode.tongyong.show();
          $popnode.popupTurntable.hide();
          return;
      }
      var $this = $(this);
      if($this.find(".participation").length > 0){
        return;
      }
      var lock = $lock.val();
      if(lock == "0"){//可以抽奖
          if(bRotate){return;}
          rotateAjax();
      }
    });
  }
  //渲染排行今日榜数据
  function renderData_t(){
      
      $.ajax({
          	type:'get',
            url:'/?act=activity_pkdomsdraw_rank&st=getRank',
            dataType:'json',
            success:function(data){
            	$("#T_data").html('');
              var   _html = '';
              var rankNum = "--";
              var subCoin = 0;
              var payAmount = 0;
            	if (data.code == 0000) {
                  if(data.data.islogin == 0){
                    rankNum = '未登录';
                    subCoin = 0;
                    payAmount = 0;
                  }else{
                    rankNum = data.data.my_info.rank;
                    subCoin = parseInt(data.data.my_info.subCoin);
                    payAmount = parseInt(data.data.my_info.payAmount);
                  }

                  $("#myRank").html(rankNum);
                  renderNum(subCoin,$("#myRank_coin"));
                  renderNum(payAmount,$("#achive_coin"));
                  if(data.data.rankList.length>0){
                  	for (var i = 0; i < data.data.rankList.length; i++) {
      	                _html += '<li class="clearfix">';
      	                if (data.data.rankList[i].rank < 4){
      	                    _html += '<span class="ra_'+data.data.rankList[i].rank+'"><i></i></span>';
      	                }else{
      	                    _html += '<span>'+data.data.rankList[i].rank+'</span>';
      	                }
                        _html += '<span>'+data.data.rankList[i].userName+'</span>'
                        _html += '<span>'+data.data.rankList[i].subCoin+'</span>'
      	                _html += '<span>'+data.data.rankList[i].payAmount+'</span></li>';
      	            };
                  	$("#T_data").html(_html);
                  }else{
                  	 _html = '<p>暂无数据~</p>';
                     $("#T_data").html(_html);
                  }
              }else if(data.code == 001){
                    _html = '<p>暂无数据~</p>';
                    $("#T_data").html(_html);
              };
          },

      })
  }

   //渲染排行昨日榜数据
  function renderData_yes(){
      
      $.ajax({
          	type:'get',
            url:'/?act=activity_pkdomsdraw_rank&st=getYesRank',
            dataType:'json',
            success:function(data){
            	$("#yt_data").html('');
              var   _html = '';
            	if (data.code == 0000) {
                  if(data.data.length>0){
                  	for (var i = 0; i < data.data.length; i++) {
      	                _html += '<li class="clearfix">';
      	                if (data.data[i].rank < 4){
      	                    _html += '<span class="ra_'+data.data[i].rank+'"><i></i></span>';
      	                }else{
      	                    _html += '<span>'+data.data[i].rank+'</span>';
      	                }
                        _html += '<span>'+data.data[i].userName+'</span>'
                        _html += '<span>'+data.data[i].subCoin+'</span>'
      	                _html += '<span>'+data.data[i].payAmount+'</span></li>';
      	            };
                  	$("#yt_data").html(_html);
                  }else{
                  	 _html = '<p>暂无数据~</p>';
                     $("#yt_data").html(_html);
                  }
              }else if(data.code == 001){
                    _html = '<p>暂无数据~</p>';
                    $("#yt_data").html(_html);
              };
          },

      })
  }


  //渲染数字分奖金额
  function renderNum(num,$dom){
      var num = num.toString();
        $dom.empty();
      for (var i = 0; i < num.length; i++) {
          $dom.append('<i class=num_' + num[i] + '></i>');
      }
  }

  //渲染消息列表数据
  function renderMessageData(){
      var msg = $('.popupMessageList .bgMiddle ul');
      $.ajax({
          type:'get',
          url:'?act=managemsg&st=getList',
          dataType:'json',
          timeout: 20000,            
          success:function(data){
              msg.html('');
              if(data.code == '0000') {
                  msg.html('');
                  var _html = '';
                  if(data.data.length>0){
                    var list = data.data;
                    for (var i = 0; i < list.length; i++) {
                      _html += '<li class="listBg" id='+ list[i].id +'>';
                      if(list[i].is_read == 0){
                        _html += '<span class="red"></span>';
                      }
                      _html += '<div class="middle" id='+ list[i].id +'>';
                      _html += '<p class="mes">'+ list[i].title +'</p>';
                      _html += '<p class="informTime">'+ list[i].raw_add_time +'</p>';
                      _html += '</div>';
                      _html += '<span class="kmh_icons btnDelete"></span>';
                      _html += '</li>';
                    }
                    msg.html(_html);
                    $('.popupMessageList .listBg .middle').on('click', function(){
                      var id = $(this).attr('id');
                      messageDetail(id);
                      //console.log(id);
                    });

                    $(".popupMessageList .listBg .btnDelete").on('click', function(){
                      if($(this).hasClass("checked")){
                        $(this).removeClass("checked");
                      }else{
                        $(this).addClass("checked");
                      }
                    });
                    
                  }else{
                    _html = '<p class="tip">暂无消息~</p>';
                    msg.html(_html);
                    $(".btnDeleteSelect,.btnSelectAll").hide();
                  }
              }else{
                  _html = '<p class="tip">暂无消息~</p>';
                  msg.html(_html);
              }
          }
      });
  }  
  //消息详情
  function messageDetail(id){
      var msg = $('.popupMessageList .bgMiddle ul');
      $.ajax({
          type:'get',
          url:'?act=managemsg&st=detail',
          data:{id:id},
          dataType:'json',
          timeout: 20000,
          success:function(data){
              if(data.code == '0000') {
                  $('.mess .redIcon').html(data.msgNum);
                  if(data.msgNum == 0){
                    $('.mess .redIcon').hide();
                  }
                  $('.popupMessage .msgTitle').html(data.data.title);
                  $('.popupMessage .curTime').html(data.data.raw_add_time);
                  $('.popupMessage .bgMiddle').html(data.data.content);
                  $popnode.popupMessage.show();
              }else{
                  $popnode.tongyong.getDom().find(".tips").html('网络异常，请重试！');
                  $popnode.tongyong.show();                
              }
              $popnode.popupMessageList.hide();
          }
      });
  }
  //删除消息
  function deleteMessage(id){
      var msg = $('.popupMessageList .bgMiddle ul');
      $.ajax({
          type:'POST',
          url:'?act=managemsg&st=delMsg',
          data:{id:id},
          dataType:'json',
          timeout: 20000,            
          success:function(data){
              if(data.code == '0000') {
                  $('.mess .redIcon').html(data.msgNum);
                  if(data.msgNum == 0){
                    $('.mess .redIcon').hide();
                  }
                  $popnode.tongyong.getDom().find(".tips").html('删除消息成功！');
                  $popnode.tongyong.show();
              }else{
                  $popnode.tongyong.getDom().find(".tips").html('网络异常，请重试！');
                  $popnode.tongyong.show();                
              }
              $popnode.popupMessageList.hide();
          }
      });
  }
  //倒计时
  nowTime = nowTime*1000;
  function getCountDown(){
      nowTime = nowTime + 1000;

      var date = new Date(nowTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
       var Y = date.getFullYear() + '-';
       var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
       var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
       var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
       var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
       var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
      var countDownTime = Y+M+D+h+m+s;
      $(".kmh_icons .time,.bottom_time .time").html(countDownTime);
  }
  getCountDown();
  clearTime = setInterval(function(){
    getCountDown();
  },1000)

  //全选
  $btnSelectAll.on("click",function(){
    var _this = $(this);
    if(_this.hasClass('cancelBtn')){
      _this.removeClass('cancelBtn');
      $(".popupMessageList ul li").each(function(){
        if($(this).find(".btnDelete").hasClass("checked")){
          $(this).find(".btnDelete").removeClass("checked");
        }else{
          return;
        }
      })
    }else{
      _this.addClass('cancelBtn');
      $(".popupMessageList ul li").each(function(){
        if($(this).find(".btnDelete").hasClass("checked")){
          return;
        }else{
          $(this).find(".btnDelete").addClass("checked");
        }
      })
    }
  })
  //删除所选
  $btnDeleteSelect.on("click",function(){
    var arr = [];
    var len = $(".popupMessageList ul li").length;
    return new Promise(function(resolve,reject){
      $(".popupMessageList ul li").each(function(index,item){
        if($(this).find(".btnDelete").hasClass("checked")){
            arr.push($(this).attr('id'));
            $(this).remove();
          }
          if(len-1 == index){
            resolve(arr);
          }
      })
    })
    .then((res)=>{
        deleteMessage(res);
        //console.log(res);
    })
  })
  $btnTurntable.on('click', function(){
    $popnode.popupTurntable.show();
  });
  $btnRule.on('click', function(){
    $popnode.popupRule.show();
  });
  $btnExplain.on('click',function(){
    $popnode.popupExplain.show();
  })
  $btnRank.on('click', function(){
     renderData_t();
     renderData_yes();
     $popnode.popupRank.show();
  });
  $btnMessList.on('click', function(){
    renderMessageData();
    $popnode.popupMessageList.show();
  });
  //切换点击事件
  $btnList.on("click",function(){
      var index = $(this).index();
      $(this).addClass("hover").siblings().removeClass("hover");
      $contentList.eq(index).addClass("cur").siblings().removeClass("cur");
  })

  function QXinit(){   
    panelBoard();
  }

  QXinit();
})(Zepto);





