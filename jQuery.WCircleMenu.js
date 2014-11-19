/*
 * jQuery WCircleMenu
 * By: Wahyu Danarto
 * Version 0.1
 * Last Modified: 09/13/2014
 * 
 * Copyright 2014 Wahyu Danarto
 * You may use this project under MIT or GPL licenses.
 * 
 */
 
(function($) {

	$.fn.WCircleMenu = function( options ) {
		if(options=='open'){
			this.trigger('WCircleMenuOpen');
			return;
		}
		if(options=='close'){
			this.trigger('WCircleMenuClose');
			return;
		}
		var opts = $.extend({},$.fn.WCircleMenu.defaults,options);
		opts.easingFuncShow = getEasingFunc(opts.easingFuncShow);
		opts.easingFuncHide = getEasingFunc(opts.easingFuncHide);

		this.children('div.wcircle-icon').css({'position':'absolute','top':0,'height':0,'width':opts.width,'height':opts.height,'display':'block'});

		this.children('div.wcircle-menu').css({'width':opts.width,'height':opts.height,'position':'relative','display':'none'})
			.children('div').css({'position':'absolute','top':'0','left':'0','opacity':'0'});

		function openMenu(elem){
			if(elem.is('.wcircle-open')) return;
			var icon_wrapper = elem.children('div.wcircle-menu');
			icon_wrapper.show();
			var target = icon_wrapper.children('div');
			animateTranslateXYO({
						'objek':icon_wrapper.prev(),
						'targetX':0,
						'fromX':0,
						'targetY':0,
						'fromY':0,
						'targetO':1,
						'fromO':1,
						'targetRot':opts.iconRotation,
						'fromRot':0,
						'easingFunc':opts.easingFuncShow,
						'step':opts.step,
					});
			for (var i=0; i<target.length;i++)
			{
				(function(increment){
					var callback = false;
					if(increment == target.length-1) {
						callback = function(){
							elem.removeClass('wcircle-animating');
							elem.addClass('wcircle-open');
							if(typeof opts.openCallback == 'function')
							{
								opts.openCallback();
							}
						};
					}
					setTimeout(function(){
						animateTranslateXYO({
							'objek':target.eq(increment),
							'targetX':Math.round(Math.cos(opts.angle_interval*increment+opts.angle_start)*opts.distance),
							'fromX':0,
							'targetY':Math.round(Math.sin(opts.angle_interval*increment+opts.angle_start)*opts.distance),
							'fromY':0,
							'targetO':1,
							'fromO':0,
							'targetRot':0,
							'fromRot':opts.itemRotation,
							'easingFunc':opts.easingFuncShow,
							'step':opts.step,
							'callback':callback,
						});
					},opts.delay*increment);
				})(i);
			}
		};

		function closeMenu (elem) {
			if(!elem.is('.wcircle-open')) return;
			var icon_wrapper = elem.children('div.wcircle-menu');
			var target = icon_wrapper.children('div');
			animateTranslateXYO({
				'objek':icon_wrapper.prev(),
				'targetX':0,
				'fromX':0,
				'targetY':0,
				'fromY':0,
				'targetO':1,
				'fromO':1,
				'targetRot':0,
				'fromRot':opts.iconRotation,
				'easingFunc':opts.easingFuncHide,
				'step':opts.step,
			});
			for (var i=(target.length-1); i>=0;i--)
			{
				(function(increment){
					var callback = false;
					if(increment == 0) {
						callback = function(){
							icon_wrapper.hide();
							elem.removeClass('wcircle-animating');
							elem.removeClass('wcircle-open');
							if(typeof opts.closeCallback == 'function')
							{
								opts.closeCallback();
							}
						};
					}
					setTimeout(function(){
						animateTranslateXYO({
							'objek':target.eq(increment),
							'targetX':0,
							'fromX':Math.round(Math.cos(opts.angle_interval*increment+opts.angle_start)*opts.distance),
							'targetY':0,
							'fromY':Math.round(Math.sin(opts.angle_interval*increment+opts.angle_start)*opts.distance),
							'targetO':0,
							'fromO':1,
							'targetRot':opts.itemRotation,
							'fromRot':0,
							'easingFunc':opts.easingFuncHide,
							'step':opts.step,
							'callback':callback,
						});
					},opts.delay*(target.length-(increment+1)));
				})(i);
			}
		};

		this.off('WCircleMenuOpen').on('WCircleMenuOpen',function(){
			self = $(this);
			openMenu(self);
		});

		this.off('WCircleMenuClose').on('WCircleMenuClose',function(){
			self = $(this);
			closeMenu(self);
		});

		return this.off('click').on('click', function(e) {
			var self = $(this);
			if(self.is('.wcircle-animating')) return;
			self.addClass('wcircle-animating');
			var icon_wrapper = self.children('div.wcircle-menu');
			if(icon_wrapper.is(':visible'))
			{
				closeMenu(self);
			} else {
				openMenu(self);
			}
		});

	};

	$.fn.WCircleMenu.defaults = {
		width: '50px',
		height: '50px',
		angle_start : -Math.PI/2,
		delay: 50,
		distance: 100,
		angle_interval: Math.PI/6,
		easingFuncShow:"easeOutBack",
		easingFuncHide:"easeInBack",
		step:15,
		openCallback:false,
		closeCallback:false,
		itemRotation:360,
		iconRotation:180,
	};

	function animateTranslateXYO( param ) {
		if (typeof param['objek'] == 'undefined')
		{
			return false;
		}

		var objek = (param['objek'] instanceof jQuery)?param['objek']:$(param['objek']);

		if(objek.is('.animatingTranslateXYO'))
		{
			return false;
		}

		var targetX = (typeof param['targetX'] == 'undefined')?false:param['targetX'];
		var fromX = (typeof param['fromX'] == 'undefined')?false:param['fromX'];
		var targetY = (typeof param['targetY'] == 'undefined')?false:param['targetY'];
		var fromY = (typeof param['fromY'] == 'undefined')?false:param['fromY'];
		var targetO = (typeof param['targetO'] == 'undefined')?false:param['targetO'];
		var fromO = (typeof param['fromO'] == 'undefined')?false:param['fromO'];
		var targetRot = (typeof param['targetRot'] == 'undefined')?false:param['targetRot'];
		var fromRot = (typeof param['fromRot'] == 'undefined')?false:param['fromRot'];

		var callback = (typeof param['callback'] == 'undefined')?false:param['callback'];
		var easingFunc = (typeof param['easingFunc'] != 'function')?easeOutCirc:param['easingFunc'];
		var step = (typeof param['step'] == 'undefined')?15:param['step'];

		var xform = 'transform';
        ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
            var e = prefix + 'Transform';
            if (typeof document.body.style[e] !== 'undefined') {
                xform = e;
            }
        });

		objek.addClass('animatingTranslateXYO');
		processAnimateTranslateXYO(objek,targetX,fromX,targetY,fromY,targetO,fromO,targetRot,fromRot,step,0,callback,easingFunc,xform);		
	};

	function processAnimateTranslateXYO(objek, targetX, fromX, targetY, fromY, targetO, fromO, targetRot, fromRot, step, curStep, callback, easingFunc, xform) {
		if(objek.is('.animatingTranslateXYO'))
		{
			if(typeof fromX === 'undefined' || fromX === false)
			{
				fromX = parseInt(getTranslateX(objek[0]));
			}
			if(typeof targetX === 'undefined' || targetX === false)
			{
				targetX = fromX;
			}
			if(typeof fromY === 'undefined' || fromY === false)
			{
				fromY = parseInt(getTranslateY(objek[0]));
			}
			if(typeof targetY === 'undefined' || targetY === false)
			{
				targetY = fromY;
			}
			if(typeof fromO === 'undefined' || fromO === false)
			{
				fromO = parseFloat(getOpacity(objek[0]));
			}
			if(typeof targetO === 'undefined' || targetO === false)
			{
				targetO = fromO;
			}
			if(typeof fromRot === 'undefined' || fromRot === false)
			{
				fromRot = 0;
			}
			if(typeof targetRot === 'undefined' || targetRot === false)
			{
				targetRot = fromRot;
			}
			var options = {};

			if(curStep <= step)
			{
				var currentTargetX = easingFunc(curStep,fromX,targetX-fromX,step);
				var currentTargetY = easingFunc(curStep,fromY,targetY-fromY,step);
				var currentTargetO = easingFunc(curStep,fromO,targetO-fromO,step);
				var currentTargetRot = easingFunc(curStep,fromRot,targetRot-fromRot,step);

				options[xform] = 'translate3d('+currentTargetX+'px, '+currentTargetY+'px, 0)'+
										'rotate('+currentTargetRot+'deg)';
				options['opacity'] = currentTargetO;
				curStep = curStep+1;
				window.requestAnimationFrame(function() {
					processAnimateTranslateXYO(objek,targetX,fromX,targetY,fromY,targetO,fromO,targetRot,fromRot,step,curStep,callback,easingFunc,xform);
				});
				objek.css(options);
			}
			else
			{
				options[xform] = 'translate3d('+targetX+'px, '+targetY+'px, 0)'+
									'rotate('+targetRot+'deg)';
				options['opacity'] = targetO;
				objek.css(options);
				objek.removeClass('animatingTranslateXYO');
				if(typeof callback == 'function')
				{
					callback();
				}
			}
		}
	};

	function getTranslateX (el) {
		var m = new WebKitCSSMatrix(window.getComputedStyle(el, null).webkitTransform);
		return m.m41;
	};

	function getTranslateY (el) {
		var m = new WebKitCSSMatrix(window.getComputedStyle(el, null).webkitTransform);
		return m.m42;
	};

	function getOpacity (el) {
		return window.getComputedStyle(el).opacity;
	};

	function getEasingFunc(easingFunc) {
		switch(easingFunc) {
			case "linearEase":
			{
				return linearEase;
			}
			case "easeInQuad":
			{
				return easeInQuad;
			}
			case "easeOutQuad":
			{
				return easeOutQuad;
			}
			case "easeInOutQuad":
			{
				return easeInOutQuad;
			}
			case "easeInCubic":
			{
				return easeInCubic;
			}
			case "easeOutCubic":
			{
				return easeOutCubic;
			}
			case "easeInOutCubic":
			{
				return easeInOutCubic;
			}
			case "easeInQuart":
			{
				return easeInQuart;
			}
			case "easeOutQuart":
			{
				return easeOutQuart;
			}
			case "easeInOutQuart":
			{
				return easeInOutQuart;
			}
			case "easeInQuint":
			{
				return easeInQuint;
			}
			case "easeOutQuint":
			{
				return easeOutQuint;
			}
			case "easeInOutQuint":
			{
				return easeInOutQuint;
			}
			case "easeInSine":
			{
				return easeInSine;
			}
			case "easeOutSine":
			{
				return easeOutSine;
			}
			case "easeInOutSine":
			{
				return easeInOutSine;
			}
			case "easeInExpo":
			{
				return easeInExpo;
			}
			case "easeOutExpo":
			{
				return easeOutExpo;
			}
			case "easeInOutExpo":
			{
				return easeInOutExpo;
			}
			case "easeInCirc":
			{
				return easeInCirc;
			}
			case "easeOutCirc":
			{
				return easeOutCirc;
			}
			case "easeInOutCirc":
			{
				return easeInOutCirc;
			}
			case "easeInElastic":
			{
				return easeInElastic;
			}
			case "easeOutElastic":
			{
				return easeOutElastic;
			}
			case "easeInOutElastic":
			{
				return easeInOutElastic;
			}
			case "easeInBack":
			{
				return easeInBack;
			}
			case "easeOutBack":
			{
				return easeOutBack;
			}
			case "easeInOutBack":
			{
				return easeInOutBack;
			}
			case "easeInBounce":
			{
				return easeInBounce;
			}
			case "easeOutBounce":
			{
				return easeOutBounce;
			}
			case "easeInOutBounce":
			{
				return easeInOutBounce;
			}
			defaults :
			{
				return false;
			}
		}
	};

	function linearEase(t, b, c, d) {
	    return c * t / d + b;
	};


	function easeInQuad(t, b, c, d) {
	    return c * (t /= d) * t + b;
	};


	function easeOutQuad(t, b, c, d) {
	    return -c * (t /= d) * (t - 2) + b;
	};


	function easeInOutQuad(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	        return c / 2 * t * t + b;
	    }
	    return -c / 2 * ((--t) * (t - 2) - 1) + b;
	};


	function easeInCubic(t, b, c, d) {
	    return c * Math.pow(t / d, 3) + b;
	};


	function easeOutCubic(t, b, c, d) {
	    return c * (Math.pow(t / d - 1, 3) + 1) + b;
	};


	function easeInOutCubic(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	        return c / 2 * Math.pow(t, 3) + b;
	    }
	    return c / 2 * (Math.pow(t - 2, 3) + 2) + b;
	};


	function easeInQuart(t, b, c, d) {
	    return c * Math.pow (t / d, 4) + b;
	};


	function easeOutQuart(t, b, c, d) {
	    return -c * (Math.pow(t / d - 1, 4) - 1) + b;
	};


	function easeInOutQuart(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	        return c / 2 * Math.pow(t, 4) + b;
	    }
	    return -c / 2 * (Math.pow(t - 2, 4) - 2) + b;
	};


	function easeInQuint(t, b, c, d) {
	    return c * Math.pow (t / d, 5) + b;
	};


	function easeOutQuint(t, b, c, d) {
	    return c * (Math.pow(t / d - 1, 5) + 1) + b;
	};


	function easeInOutQuint(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	        return c / 2 * Math.pow(t, 5) + b;
	    }
	    return c / 2 * (Math.pow(t - 2, 5) + 2) + b;
	};


	function easeInSine(t, b, c, d) {
	    return c * (1 - Math.cos(t / d * (Math.PI / 2))) + b;
	};


	function easeOutSine(t, b, c, d) {
	    return c * Math.sin(t / d * (Math.PI / 2)) + b;
	};


	function easeInOutSine(t, b, c, d) {
	    return c / 2 * (1 - Math.cos(Math.PI * t / d)) + b;
	};


	function easeInExpo(t, b, c, d) {
	    return c * Math.pow(2, 10 * (t / d - 1)) + b;
	};


	function easeOutExpo(t, b, c, d) {
	    return c * (-Math.pow(2, -10 * t / d) + 1) + b;
	};


	function easeInOutExpo(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	    }
	    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	};


	function easeInCirc(t, b, c, d) {
	    return c * (1 - Math.sqrt(1 - (t /= d) * t)) + b;
	};


	function easeOutCirc(t, b, c, d) {
	    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	};


	function easeInOutCirc(t, b, c, d) {
	    if ((t /= d / 2) < 1) {
	        return c / 2 * (1 - Math.sqrt(1 - t * t)) + b;
	    }
	    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	};
	
	function easeInElastic(t, b, c, d) {
		var s = 1.70158, p = 0, a = c;

		if(c == 0) return b;
		if(t == 0) return b;
		if((t /= d) == 1) return b+c;
		if(!p) p=d*0.3;
		if(a < Math.abs(c)) {
			a = c;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin( (t * d - s) * (2 * Math.PI) / p )) + b;
	};

	function easeOutElastic(t, b, c, d) {
		var s = 1.70158, p = 0, a = c;

		if(c == 0) return b;
		if(t == 0) return b;
		if((t /= d) == 1) return b+c;
		if(!p) p=d*0.3;
		if(a < Math.abs(c)) {
			a = c;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return a * Math.pow(2, -10 * t) * Math.sin( (t * d - s) * (2 * Math.PI) / p ) + c + b;
	};

	function easeInOutElastic(t, b, c, d) {
		var s = 1.70158, p = 0, a = c;

		if(c == 0) return b;
		if(t == 0) return b;
		if((t /= d / 2) == 2) return b + c;
		if(!p) p = d * ( 0.3 * 1.5 );
		if(a < Math.abs(c)) {
			a = c;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(c / a);
		}

		if(t < 1) {
			return -0.5 * (a * Math.pow(2, 10 * ( t -= 1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p) ) + b;
		}
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin( (t * d - s) * (2 * Math.PI) / p ) * 0.5 + c + b;
	};

	function easeInBack(t, b, c, d, overShoot) {
		var s = (typeof overShoot == 'undefined')?1.70158:overShoot;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	};

	function easeOutBack(t, b, c, d, overShoot) {
		var s = (typeof overShoot == 'undefined')?1.70158:overShoot;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	};

	function easeInOutBack(t, b, c, d, overShoot) {
		var s = (typeof overShoot == 'undefined')?1.70158:overShoot;
		if((t /= d / 2) < 1) {
			return c / 2 * (c * c * (((s *= (1.525)) + 1) * t)) + b;
		}
		return c / 2 *((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	};

	function easeInBounce(t, b, c, d) {
		return c - easing.easeOutBounce(d-t,0,c,d) + b;
	};

	function easeOutBounce(t, b, c, d) {
		if((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if(t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
		} else if(t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) +b;
		}
	};

	function easeInOutBounce(t, b, c, d) {
		if(t < d/2) {
			return easing.easeOutBounce(t*2,0,c,d) * 0.5 + b;
		} else {
			return easing.easeOutBounce(t*2-d,0,c,d) * 0.5 + c * 0.5 + b;
		}
	};

})(jQuery);
