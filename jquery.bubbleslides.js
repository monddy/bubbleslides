/*!
 * bubbleslides - jQuery plugin
 * @version: 1.5.0 - (2011/04/10)
 * @author Monddy (monddy.na@gmail.com)
 * Copyright (c) 2011 ASYP (http://www.asyp.com)
 * Licensed under the GPL (LICENSE) licens.
 * Requires: jQuery v1.4+
 */
 
(function($){
	$.fn.bubbleslides = function(options){

		var pluginObj = this;
		var pModelArr = [];
		var pModelLinkArr = [];
		var pRelaArr = [];
		var pRelaGroupArr = [];
		var pRelaGroupLinkArr = [];
		var pRelaGroupPriceArr = [];
		var pRelaGroupPriceItemArr = [];
		var pTipLabelArr = [];
		var pTipPddrArr = [];
		var pTipPriceArr = [];
		var opts = $.extend({}, $.fn.bubbleslides.defaults, options), tip = null, w = null;
		
		$.ajax({
			url:opts.xmlUrl,
			dataType:'xml',
			async:false,
			success: function(data){
				$(data).find('product').each(function(index, elem) {
					var pModel = $(elem).find('model').attr('normal');
					var pModelLink = $(elem).find('model').attr('link');
					var pRela = $(elem).find('item').eq(0).attr('url');
					$(elem).find('thumbList').find('item').each(function(index,elem){
						pRelaGroupArr.push($(this).attr('url'));
						pRelaGroupLinkArr.push($(this).attr('link'));
					});
					$(elem).find('thumbList').each(function(index,elem){
						pRelaGroupPriceArr.push($(this).find('price').first().text());
					});
					$(elem).find('thumbList').find('item').each(function(index,elem){
						pRelaGroupPriceItemArr.push($(this).find('price').text());
					});
					var pTipLabel = $(elem).find('priceTab').find('label').text();
					var pTipPddr = $(elem).find('priceTab').find('pddr').text();
					var pTipPrice = $(elem).find('priceTab').find('price').text();
					pModelArr.push(pModel);
					pModelLinkArr.push(pModelLink);
					pRelaArr.push(pRela);
					pTipLabelArr.push(pTipLabel);
					pTipPddrArr.push(pTipPddr);
					pTipPriceArr.push(pTipPrice);
				});
			}
		});
		pluginObj.each(function(i,e){
			$(e).attr('src',pModelArr[i]);
			$(e).closest('a').attr('href',pModelLinkArr[i]);
		})		
		pluginObj.closest('ul').next('ul').find('img').each(function(i,e){
			$(e).attr('src',pRelaArr[i]);
			$(e).closest('a').attr('href',pRelaGroupLinkArr[i]);
			$(e).closest('a').attr('target','blank');
			$(e).closest('li').append('<div class="subTip" style="position:absolute;left:0;bottom:4px;width:100%;background-color:#333;color:#fff;display:none;text-align:center;filter:alpha(opacity=60);opacity:0.6;">￥'+pRelaGroupPriceArr[i]+'</div>');
			if(opts.tooltip){
				$(e).closest('li').hover(function(){$(this).find('.subTip').css('display','block')},function(){$(this).find('.subTip').css('display','none')});
			}
		})	
		
		function slides(n, self, that){
			if(opts.tooltip){
				tip = $('<div>' + '<p>' + pTipLabelArr[n] + '</p>' + '<p>' + pTipPddrArr[n] + '</p>' + '<p>' + pTipPriceArr[n] + '</p>' + '</div>').css({
					fontFamily: opts.fontFamily,
					color:      opts.color, 
					fontSize:   opts.fontSize, 
					fontWeight: opts.fontWeight, 
					position:   'absolute', 
					zIndex:     100000
				}).remove().addClass('pluginTip').css({top:0,left: 0,visibility:'hidden',display:'block',border:'solid #ccc 3px',backgroundColor:'#fafafa',padding:'0 5px'}).appendTo(document.body);
				var position = $.extend({},self.offset(),{width:that.offsetWidth,height:that.offsetHeight}),tipWidth = tip[0].offsetWidth, tipHeight = tip[0].offsetHeight;
				tip.stop().css({
					top: position.top + position.height - tipHeight, 
					left: (n < 3 ? position.left + position.width*1.5 : position.left - position.width*2),
					visibility: 'visible'
				}).animate({top:'-='+(opts.scale/2-w/2)},opts.inSpeed); 
			}
			self.stop().animate({left:-opts.scale/2+w/2,top:-opts.scale/2+w/2,width:opts.scale},opts.inSpeed);
			
			self.closest('ul').next('ul').find('li').each(function(ind,e){
				if(ind==n){
					$(e).animate({marginRight:'12px',marginLeft:'263px'},'fast').clearQueue();
				} 
				$(e).animate({marginRight:'12px'},'fast').clearQueue();
			});
			self.closest('ul').next('ul').find('img').each(function(ind,e){
				$(e).attr('src',pRelaGroupArr[ind+(n*5)]);
				$(e).closest('li').find('.subTip').text('￥'+pRelaGroupPriceItemArr[ind+(n*5)])
			});
		}
		
		function clearslides(n, self, that){
			if(opts.tooltip){
				if($('.pluginTip').length!=1){
					$('.pluginTip').first().remove();
				}
			}
			self.stop().animate({left:0,top:0,width:w},opts.outSpeed,function(){
				self.css({'z-index':0});
			});
			
			self.closest('ul').next('ul').find('li').each(function(ind,e){
				if(ind==n){
					$(e).animate({marginRight:'12px',marginLeft:'0px'},'fast').clearQueue();
				} 
				$(e).animate({marginRight:'12px'},'fast').clearQueue();
			});
		}
		
		function unslides(n, self, that){
			if(opts.tooltip && tip){tip.remove()}
			self.stop().animate({left:0,top:0,width:w},opts.outSpeed,function(){
				self.css({'z-index':0});
			});
			self.closest('ul').next('ul').find('li').each(function(ind,e){
				$(e).stop().animate({marginRight:'38px',marginLeft:'0'},'fast').clearQueue();
			});
			self.closest('ul').next('ul').find('img').each(function(i,e){
				$(e).attr('src',pRelaArr[i]);
				$(e).closest('li').find('.subTip').text('￥'+pRelaGroupPriceArr[i])
			})	
		}
		
		var totalItems = pluginObj.length;
		var m = opts.startItem;
		var timer = null;
		
		if(opts.autoPlay){
			timer = setInterval(function () {
				slides(m,$(pluginObj[m]),pluginObj[m]);
				if(m==0){
					clearslides(totalItems-1,$(pluginObj[totalItems-1]));
				} else{
					clearslides(m-1,$(pluginObj[m-1]));
				}
				m = m >= totalItems-1 ? 0 : ++m;
			}, opts.pInterval);
		}
		
		return this.each(function(i){
			w = $(this).width();
			$(this).mouseover(function(){
				clearInterval( timer );
				slides(i,$(this),this);
				if(m==i+1 || m==i-5){
					if($('.pluginTip').length!=1){
						$('.pluginTip').last().remove();
					}
				} else {
					if(m==0){
						clearslides(totalItems-1,$(pluginObj[totalItems-1]));
					} else{
						clearslides(m-1,$(pluginObj[m-1]));
					}
				}
			}).mouseout(function(){
				unslides(i,$(this));
				$('.pluginTip').first().remove();
				clearInterval( timer );
				if(opts.autoPlay){
					timer = setInterval(function () {
						slides(m,$(pluginObj[m]),pluginObj[m]);
						if(m==0){
							clearslides(totalItems-1,$(pluginObj[totalItems-1]));
						} else{
							clearslides(m-1,$(pluginObj[m-1]));
						}
						m = m >= totalItems-1 ? 0 : ++m;
					}, opts.pInterval);
				}
			})
		})
	}
	$.fn.bubbleslides.defaults = {
		xmlUrl:    'productList.xml',
		tooltip:   true,
		autoPlay:  true, 
		scale:     155,
		fontFamily:'microsoft YaHei',
		color:     '#333333',
		fontSize:  12,
		fontWeight:'bold',
		inSpeed:   'slow',
		outSpeed:  'fast',
		pInterval: 5000,
		startItem: 0
	}
})(jQuery);