$(document).ready(function() {
// start

	$(document).on('click', '.movies-filter__handle-btn', function (event) {
		event.preventDefault();
		$('.movies-filter__properties-wrapper').toggleClass('visible');


	});

	$(document).on('click', '.movies-filter__overlay, .movies-filter__apply-btn', function (event) {
		event.preventDefault();
		$('.movies-filter__properties-wrapper').removeClass('visible');
	});


	$(document).on('focusin', '.search', function (event) {
		$(this).addClass('search_focusin');
	}).on('focusout', '.search', function (event) {
		$(this).removeClass('search_focusin');
	})

	$('.movies-filter__slider').slider({
		range: true,
		min: 1920,
		max: 2016,
		values: [1980, 2010],
		slide: function (event, ui) {
			$('.movies-filter__range-from').html(ui.values[0]);
			$('.movies-filter__range-to').html(ui.values[1]);
		}
	});

	$('.movies-group__carousel').slick({});
	$('.movies__carousel').slick({
		dots: true
	});
	$('.tariff-small__carousel').slick({
		dots: true,
		arrows: false
	});

	$(document).on('click', '.tariff-line_radio', function () {
		$(this).addClass('tariff-line_selected').siblings().removeClass('tariff-line_selected')
	});

	$(document).on('click', '.tariff-gift', function (e) {
		e.preventDefault();
		$(this).parent().find('.tariff-small__gallery').toggleClass('tariff-small__gallery_visible');
		$(this).parent().find('.tariff-small__carousel').get(0).slick.setPosition();

		console.log();
	});


	var myMap;
	function initMap() {
		if (!myMap) {
			myMap = new ymaps.Map('coating', {
					center: [55.75081328, 37.57935800],
					zoom: 16,
					controls: []
				}),
				ZoomLayout = ymaps.templateLayoutFactory.createClass("<div>" +
					"<div id='zoom-in' class='coating-btn'><i class='icon-plus'></i></div><br>" +
					"<div id='zoom-out' class='coating-btn'><i class='icon-minus'></i></div>" +
					"</div>", {
					build: function () {
						ZoomLayout.superclass.build.call(this);
						this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
						this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);
						$('#zoom-in').bind('click', this.zoomInCallback);
						$('#zoom-out').bind('click', this.zoomOutCallback);
					},
					clear: function () {
						$('#zoom-in').unbind('click', this.zoomInCallback);
						$('#zoom-out').unbind('click', this.zoomOutCallback);
						ZoomLayout.superclass.clear.call(this);
					},

					zoomIn: function () {
						var map = this.getData().control.getMap();
						this.events.fire('zoomchange', {
							oldZoom: map.getZoom(),
							newZoom: map.getZoom() + 1
						});
					},
					zoomOut: function () {
						var map = this.getData().control.getMap();
						this.events.fire('zoomchange', {
							oldZoom: map.getZoom(),
							newZoom: map.getZoom() - 1
						});
					}
				}),
				zoomControl = new ymaps.control.ZoomControl({
					options: {
						layout: ZoomLayout,
						float: 'none',
						position: {
							bottom: 15,
							left: 15
						}
					}
				});
			myMap.controls.add(zoomControl);


			// Создаем многоугольник, используя вспомогательный класс Polygon.
			var myPolygon = new ymaps.Polygon([
				// Указываем координаты вершин многоугольника.
				// Координаты вершин внешнего контура.
				[
					[55.75, 37.50],
					[55.80, 37.60],
					[55.75, 37.70],
					[55.70, 37.70],
					[55.70, 37.50]
				],
				// Координаты вершин внутреннего контура.
				[
					[55.75, 37.52],
					[55.75, 37.68],
					[55.65, 37.60]
				]
			], {
				// Описываем свойства геообъекта.
				// Содержимое балуна.
				hintContent: ''
			}, {
				// Задаем опции геообъекта.
				// Цвет заливки.
				fillColor: '#89d30a',
				// Ширина обводки.
				strokeWidth: 0,
				opacity: 0.5,
				draggable: false,
				editorDrawingCursor: "crosshair"
			});
			// Добавляем многоугольник на карту.
			myMap.geoObjects.add(myPolygon);

			var stateMonitor = new ymaps.Monitor(myPolygon.editor.state);
				stateMonitor.add("drawing", function (newValue) {
					myPolygon.options.set("strokeColor", newValue ? '#89d30a' : '#0000FF');
				});

				// Включаем режим редактирования с возможностью добавления новых вершин.
			   //myPolygon.editor.startDrawing();
			myMap.behaviors.disable(['scrollZoom']);

			// Создание макета балуна на основе Twitter Bootstrap.
			MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
				'<div class="popover top">' +
					'<a class="close" href="#">&times;</a>' +
					'<div class="arrow"></div>' +
					'<div class="popover-inner">' +
					'$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
					'</div>' +
					'</div>', {
					/**
					 * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
					 * @function
					 * @name build
					 */
					build: function () {
						this.constructor.superclass.build.call(this);

						this._$element = $('.popover', this.getParentElement());

						this.applyElementOffset();

						this._$element.find('.close')
							.on('click', $.proxy(this.onCloseClick, this));
					},

					/**
					 * Удаляет содержимое макета из DOM.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
					 * @function
					 * @name clear
					 */
					clear: function () {
						this._$element.find('.close')
							.off('click');

						this.constructor.superclass.clear.call(this);
					},

					/**
					 * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name onSublayoutSizeChange
					 */
					onSublayoutSizeChange: function () {
						MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

						if(!this._isElement(this._$element)) {
							return;
						}

						this.applyElementOffset();

						this.events.fire('shapechange');
					},

					/**
					 * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name applyElementOffset
					 */
					applyElementOffset: function () {
						this._$element.css({
							left: -(this._$element[0].offsetWidth / 2),
							top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
						});
					},

					/**
					 * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name onCloseClick
					 */
					onCloseClick: function (e) {
						e.preventDefault();

						this.events.fire('userclose');
					},

					/**
					 * Используется для автопозиционирования (balloonAutoPan).
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
					 * @function
					 * @name getClientBounds
					 * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
					 */
					getShape: function () {
						if(!this._isElement(this._$element)) {
							return MyBalloonLayout.superclass.getShape.call(this);
						}

						var position = this._$element.position();

						return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
							[position.left, position.top], [
								position.left + this._$element[0].offsetWidth,
								position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
							]
						]));
					},

					/**
					 * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
					 * @function
					 * @private
					 * @name _isElement
					 * @param {jQuery} [element] Элемент.
					 * @returns {Boolean} Флаг наличия.
					 */
					_isElement: function (element) {
						return element && element[0] && element.find('.arrow')[0];
					}
				}),

		// Создание вложенного макета содержимого балуна.
			MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
				'<h3 class="popover-title">$[properties.balloonHeader]</h3>' +
					'<div class="popover-content">$[properties.balloonContent]</div>'
			),

		// Создание метки с пользовательским макетом балуна.
			myPlacemark = window.myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
				//balloonHeader: 'Заголовок балуна',
				balloonContent: 'К сожалению, Ваш дом еще не подключен к сети ОнЛайм. Вы можете оставить предварительную заявку на подключение.'
			}, {
				iconLayout: 'default#image',
				iconImageHref: 'images/pin.png',
				iconImageSize: [31, 48],
				iconImageOffset: [-16, -48],
				balloonShadow: false,
				balloonLayout: MyBalloonLayout,
				balloonContentLayout: MyBalloonContentLayout,
				balloonPanelMaxMapArea: 0,
				// Не скрываем иконку при открытом балуне.
				hideIconOnBalloonOpen: false,
				// И дополнительно смещаем балун, для открытия над иконкой.
				balloonOffset: [0, -55],
				autoFitToViewport: 'always'
			});

			myMap.geoObjects.add(myPlacemark);
			myPlacemark.balloon.open();
			myMap.container.fitToViewport();

		} else {
			//myMap.destroy();// Деструктор карты
			//myMap = null;
		}
	}

	$('#set-balloon-header').click(function () {
		 console.log(1);
		window.myPlacemark.properties.set(
			'balloonHeader',
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
				+ 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
		);
	});
	$('#set-balloon-content').click(function () {
		console.log(2);
		window.myPlacemark.properties.set(
			'balloonContent',
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
				+ 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
		);
	});


	alignNews();
	alignBonus();
	alignServ();
	alignPrize();
	checker();
	eachOtherItem();
	checkOther();
	toggleBlockPrice();
	alignPocket();

	$('body').on('click', '.map-link, .coating-close', toggleCoating);

	$('.disabled-block').find('input[type="checkbox"]').prop('disabled', true);
	$('.disabled-block').on('click', '.checkbox, a', function() {
		return false;
	});

	function toggleCoating() {
		var $coating = $('.coating'),
			$close = $coating.siblings('.coating-close');
		console.log($coating);
		if( $coating.is(':visible') ) {
			initMap();
			$coating.slideUp();
			$close.hide();
		} else {
			initMap();
			$coating.slideDown();
			$close.show();
		}
	}
	$('.coating-return-search').on('click', function() {
		$(this).parents('.coating-connect').slideUp().siblings('form').slideDown();
	});

	$('.other-item').children('.checkbox').on('change', 'input[type="checkbox"], input[type="radio"]', checkOther);
	$('.toggle-block .radiobox').on('click', '.checker', toggleBlockPrice);

	$('.topbar-support span').on('click', 'span:not(.current)', function() {
	   $(this).addClass('current').siblings().removeClass('current').parent('span')
		   .siblings('strong').eq( $(this).index()).addClass('current').siblings('strong').removeClass('current');
	});

	var userAgent = navigator.userAgent,
		isOpera = userAgent.indexOf('Opera'),
		version = userAgent.split('/');
		version = parseFloat(version[version.length-1]),
		old = false;
	if(isOpera != -1) isOpera = true;
	if(version < 13) old = true;

	function circleLight() {
		$('.num-circle-animate').each(function() {
			var $this = $(this),
				text = $this.attr('data-text');
			$this.after('<span class="num">' + text + '</span>');
			$this.remove();
		});
	}

	if( isOpera &&  old) {
		circleLight();
	} else if (!document.createElement('canvas').getContext) {
		circleLight();
	} else {
		$('.num-circle-animate').circliful({
			dimension: 66,
			width: 1,
			fontsize: 24,
			fgcolor: '#81ca23',
			bgcolor: '#dfe5e7',
			border: 'inline',
			bordersize: 1
		});
		$('.num-circle-animate').each(function() {
			var $this = $(this),
				total = $this.attr('data-total'),
				part = $this.attr('data-part'),
				proc = part * 100 / total,
				rad = (proc * 360 / 100).toFixed();
			$this.append('<span class="dot" style="-webkit-transform: rotate(' + rad + 'deg);"></div>');
			setTimeout(
				function() {
					$this.find('.dot').fadeIn(1000);
				}, 1000
			);
		});
	}


	$('body').on('click', '.open-link', function() {
		clickMenu( $(this), false );
		return false;
	});


	$('.topbar-more-link').on('click', function() {
		$(this).siblings('.topbar-more-popup').slideToggle();
	});

	$(document).click(function(event) {
		if ($(event.target).closest('.topbar-more-link, .topbar-more-popup').length) return;
		$('.topbar-more-popup').fadeOut();
		event.stopPropagation();
	});

	$('.topbar-more-popup')


	$('body').on('click', '.fill, .popup-nav-close', closeMenu);

	function clickMenu(elem, close) {
		var $this = $(elem),
			hash = $this.attr('href').substring(1),
			$sub = $('#' + hash + ''),
			$head = $this.parents('.header');
		if( $sub.hasClass('popup-nav') ) {
			if( $this.hasClass('opened') || close == true ) {
				closeMenu();
			} else {
				$this.addClass('opened');
				$sub.slideDown();
				if( ! $head.siblings('.fill').length ){
					$head.addClass('dropdown').after('<div class="fill"></div>');
				}

				$head.siblings('.fill').fadeIn();
			}
		}
	}
	function closeMenu() {
		var $this = $('.header-menu').find('.opened'),
			hash = $this.attr('href').substring(1),
			$sub = $('#' + hash + ''),
			$head = $this.parents('.header');
		if( $sub.hasClass('popup-nav') ) {
			$this.removeClass('opened');
			$sub.slideUp();
			$head.removeClass('dropdown').siblings('.fill').fadeOut(500)
		}

	}

	$('.checker').on('click', function() {
		var $this = $(this);
		if($this.hasClass('disabled')) {
			$this.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
			$this.removeClass('checked');
			return false;
		}
	});


	$('.arrow-section').on('click', function() {
		var $this = $(this),
			$parent = $this.parents('.tariff-section'),
			$content = $parent.find('.tariff-section-content');
		if($parent.hasClass('hidden')) {
			$parent.removeClass('hidden');
			$content.slideDown();
		} else {
			$parent.addClass('hidden');
			$content.slideUp();
		}
	});



	$('.equip-little').on('click', '.equip-desc-link', function() {
		$(this).hide().parents('.equip-little').siblings('.equip-full').slideDown();
		return false;
	});
	$('.equip-full').on('click', '.equip-desc-link', function() {
		$(this).parents('.equip-full').slideUp().siblings('.equip-little').find('.equip-desc-link').show();
		return false;
	});

	$('.tabs-nav').on('click', 'a:not(.current)', function() {
		$(this)
		.addClass('current').siblings().removeClass('current')
		.closest('.tabs-block').find('.tabs-outline-toggle .tab-area')
		.removeClass('current').eq($(this).index()).addClass('current');

		$('.equip-full').hide();
		$('.equip-little').find('.equip-desc-link').show();
		alignServ();
		changeChannelList();
		return false;
	});


	$('.serv article .list').each(function() {
		var $this = $(this),
			$li = $this.find('li'),
			num = $li.size(),
			$more = $this.siblings('.more');
		if(num > 3) {
			$li.each(function(i) {
				i++;
				if(i>3) $(this).addClass('hidden').hide();
			});
			num = num - 3;
			$more.text('Показать еще ' + num + ' ' + persuadeWords(num, 'впечатление', 'впечателения', 'впечателний') + '');
		} else {
			$more.remove();
		}
		alignServ();
	});

	$('.serv article .more').on('click', function() {
		var $this = $(this),
			$list = $this.siblings('.list'),
			num = $list.find('li').size() - 3;

		if( $this.hasClass('opened') ) {
			$this.removeClass('opened').text('Показать еще ' + num + ' ' + persuadeWords(num, 'впечатление', 'впечателения', 'впечателний') + '');
			$list.find('.hidden').hide();
		} else {
			$this.addClass('opened').text('Скрыть');
			$list.find('li').show();
		}

		alignServ();
	});




	$('.toltip').hover(
		function() {
			closeToltip();
			$(this).addClass('hover');
			return false;
		},
		function() {
			closeToltip();
		}
	);

	$(document).click(function(event) {
		if ($(event.target).closest('.toltip').length) return;
		closeToltip();
		event.stopPropagation();
	});


	$('.form-block .other-content').on('click', '.title', function() {
	   var $input = $(this).parents('.other-content').siblings('.checkbox').find('input[type="checkbox"], input[type="radio"]');
	   if($input.attr('type') == 'checkbox') {
		   console.log( $input.is(':checked') );
			if($input.is(':checked')) {
			   $input.prop('checked', false);
			} else {
			   $input.prop('checked', true);
			}
	   } else {
			if($input.not(':checked')) {
				$input.prop('checked', true);
			}
	   }
	   checker();
	   checkOther();
	});

	$('.popup-link').on('click', function() {
		var $this = $(this),
			hash = $this.attr('data-id'),
			$parent = $this.parents('.popup-parent');
		$this.siblings('.fill-background').fadeIn();
		$('#' + hash + '').fadeIn();
		$('body').addClass('wrapper-slide');

		if( $parent.length ) {
			$parent.hide();
			$('body').append('<div class="popup-children-arrow"></div>');
			$('body').find('.popup-children-arrow').fadeIn();
		}

		return false;
	});
	$('body').on('click', '.popup-close, .fill-background', function() {
		$('.fill-background, .popup').fadeOut();
		$('body').removeClass('wrapper-slide');
	});

	$('body').on('click', '.popup-children-arrow', function() {
		$(this).remove();
		$('.popup').fadeOut();
		$('.popup-parent').fadeIn();
	});


	$('.works-list-link').on('click', function() {
		var $this = $(this),
			$block = $('.works-list');
		if($block.is(':visible')) {
			$this.text('Перечень работ');
			$block.slideUp();
		} else {
			$this.text('Скрыть перечень');
			$block.slideDown();
			$('.extract-link').text('Подробная выписка');
			$('.works-extract').hide();
		}
		return false;
	});

	$('.extract-link').on('click', function() {
		var $this = $(this),
			$block = $('.works-extract');
		if($block.is(':visible')) {
			$this.text('Подробная выписка');
			$block.slideUp();
		} else {
			$this.text('Скрыть выписку');
			$block.slideDown();
			$('.works-list-link').text('Перечень работ');
			$('.works-list').hide();
		}
		return false;
	});

	$('.description .blue-link.hidden').on('click', function() {
		$(this).parents('.description').addClass('opened');
		alignOther();
		return false;
	});


	$('.dropdown-link').on('click', function() {
		var $this = $(this),
			$popup = $this.siblings('.dropdown-popup'),
			top = $this.position().top,
			left = $this.position().left;
		if( !$this.parents('.tariff-section').hasClass('disabled-block') ) {
			$popup.css({
				'top': top,
				'left': left
			});
			$popup.fadeToggle(300);
		}
		return false;
	});

	$('.tab-accord').each(function() {
		var $this = $(this);
		if( ! $this.hasClass('opened') ) $this.find('.accord-content').hide();
	});
	$('.tab-accord .title').on('click', function() {
		var $parent = $(this).parents('.tab-accord'),
			$content = $parent.find('.accord-content');
		if( $parent.hasClass('opened') ) {
			$parent.removeClass('opened');
			$content.slideUp();
		} else {
			$parent.addClass('opened');
			$content.slideDown();
			alignServ();
		}
	});


	$('.help-item', '.help-list-hide').each(function(i) {
		if(i > 4) $(this).addClass('hidden').hide();
	});

	$('.help-list').on('click', '.help-item h3', function() {
		var $this = $(this),
			$parent = $this.parent(),
			$answer = $this.siblings('.answer');
		if( $parent.hasClass('visible') ) {
			$parent.removeClass('visible');
			$answer.slideUp();
		} else {
			$parent.addClass('visible');
			$answer.slideDown();
		}
	});

	$('.help-more').on('click', '.btn-light', function() {
		var $this = $(this),
			$parent = $this.parents('.help-list');

		if( $parent.hasClass('visible') ) {
			$parent.removeClass('visible').find('.hidden').slideUp();
			$this.find('span').text('Показать все вопросы');
		} else {
			$parent.addClass('visible').find('.hidden').slideDown();
			$this.find('span').text('Скрыть вопросы');
		}
		return false;
	});


	$('.styler').styler();


	$('.form-search').on('focus', function() {
		$(this).parents('.search-form-block').addClass('focused');
	}).on('blur', function() {
		$(this).parents('.search-form-block').removeClass('focused');
	});

	$('.dropdown-item').on('click', 'h4', function() {
		var $this = $(this);

		if( $this.parents('.dropdown-item').hasClass('opened') ) {
			$this.siblings('article').slideUp().parents('.dropdown-item').removeClass('opened');
		} else {
			$this.siblings('article').slideDown().parents('.dropdown-item').addClass('opened')
			.siblings().removeClass('opened').find('article').slideUp();
		}
	});


	changeChannelList();


	var $startBanners = $('.start-banners-list');

	if($startBanners.length) {
		$startBanners.carouFredSel({
			responsive: true,
			items: {
				visible: 1
			},
			auto: {
				play: true,
				delay: 0,
				timeoutDuration: 8000
			},
			prev: {
				button: '.start-banner-prev'
			},
			next: {
				button: '.start-banner-next'
			}
		});
	}

	function loadPopupList() {
		var $popup = $('.channals-popup');
		if($popup.length) {
			$popup.find('select').styler();
		}
	}

	$('body').on('click', '.channals-popup table .description .arrow', function() {
		var $this = $(this),
			$parent = $this.parents('.description'),
			$article = $parent.find('article');
		if( $parent.hasClass('opened') ) {
			$parent.removeClass('opened');
			$article.slideUp();
		} else {
			$parent.addClass('opened');
			$article.slideDown();
		}
	})

	window.onresize = function()  {
		$('.topbar-more-popup, .popup, .fill, .fill-background, .popup-nav').fadeOut();
		$('body').removeClass('wrapper-slide');
		$('.open-link').removeClass('opened');
		$('body').find('.popup-children-arrow').fadeOut();
		alignPocket();
	}

	var $various = $('.various');
	if($various.length) {
		$various.fancybox({
			maxWidth: 900,
			minWidth: 900,
			maxHeight: 560,
			fitToView: false,
			width: 'auto',
			autoSize: true,
			padding: 0,
			afterShow: function(current, previous) {
				loadPopupList();
			}
		});
	}



// end
});


function changeChannelList() {
	$('.channels-parent').each(function() {
		var $channels = $(this),
			active = $channels.find('.tabs-nav').find('.current').attr('data-type');
		 $channels.find('.channels-list .channel').each(function() {
		 	var $this = $(this),
		 		types = $this.attr('data-type');
		 	if( types.indexOf(active) != -1) {
		 		$this.show();
		 	} else {
		 		$this.hide();
		 	}
		 });
	});
}

function closeToltip() {
	$('.toltip').removeClass('hover');
}


function toggleBlockPrice() {
	$('.toggle-block').find('.radiobox').each(function() {
		var $this = $(this),
			num = $this.find('input:checked').parents('.checker').index();
		$this.siblings('.toggle-block-price').eq(num).addClass('current')
			.siblings('.toggle-block-price').removeClass('current');
		alignOther();
	});
}


function checkOther() {
	$('.other-item').each(function() {
		var $this = $(this);
		$checkbox = $this.children('.checkbox').find('input[type="checkbox"]');
		if($checkbox.is(':checked')) {
			$this.addClass('checked');
		} else {
			$this.removeClass('checked');
		}
		alignOther();
	});
}



function alignNews() {
	$('.news .new').css('height','auto');
	$('.news .new').alignHeight();
}
function alignOther() {
	if( $('.other-list').length ) {
		$('.other-list').find('.title, .description, .other-item').css('height','auto');
		if( $(window).width() > 321) {
			$('.other-list').teslalign({'children': '.title','items': 2});
			$('.other-list').teslalign({'children': '.description','items': 2});
			$('.other-list').teslalign({'children': '.other-item','items': 2});
		} else {
			$('.other-list').find('.title, .description, .other-item').css('height','auto');
		}
	}
}
function alignPocket() {
	var $list = $('.pockets-list');
	if($list.length) {
		$list.find('.pocket-description').css('height','auto');
		$list.teslalign({'children': '.pocket-description','items': 2});
	}
}
function alignBonus() {
	var $bonus = $('.bonuses-list');
	if($bonus.length) {
		$bonus.find('h3, .text').css('height','auto');
		$bonus.teslalign({'children': 'h3','items': 2});
		$bonus.teslalign({'children': '.text','items': 2});
	}
}
function alignServ() {
	$('.serv-list').each(function() {
		var $serv = $(this);
		if($serv.length) {
			$serv.find('h4, article').css('height','auto');
			$serv.teslalign({'children': 'h4','items': 2});
			$serv.teslalign({'children': 'article','items': 2});
		}
	});
}
function alignPrize() {
	var $prize = $('.prizes-list');
	if($prize.length) {
		$prize.find('.prize').css('height','auto');
		$prize.teslalign({'children': '.prize','items': 3});
	}
}



// Плагин, который выравнивает высоту элементов
jQuery.fn.alignHeight = function(){
	var max = 0;
	this.each(function() {
		var $this = $(this),
			height = $this.height();
		if( height > max ) max = height;
	});
	this.height(max);
};


function checker() {
	var $elem = $('.checker');
	$('.check-radio').find('input[type="radio"], input[type="checkbox"]').on('change', check);

	$elem.on('click', function(){
		var $input = $(this).find('input[type="radio"], input[type="checkbox"]');

		if($input.attr('type') == 'checkbox') {
			if($input.is(':checked')) {
				$input.prop('checked', false);
			} else {
				$input.prop('checked', true);
			}
		} else {
			if($input.not(':checked')) {
				$input.prop('checked', true);
			}
		}
		check();
	});

	function check() {
		$('.checker').each(function() {
			var $this = $(this),
				$inp = $this.find('input[type="radio"], input[type="checkbox"]');
			if($inp.is(':checked')) {
				$this.addClass('checked');
			} else {
				$this.removeClass('checked');
				if($inp.is(':disabled')) $this.addClass('disabled');
			}

			if($this.hasClass('check-radio')) {
				if($inp.is(':checked')) {
					$this.find('.check-radio-container span').text('Выбран');
				} else {
					$this.find('.check-radio-container span').text('Выбрать');
				}
			}
		});
	}
	check();
}


function eachOtherItem() {
	$('.other-item').each(function(i) {
		if( (i++%2) != 0 ) $(this).addClass('even');
	});
}


function persuadeWords(number, one, two, five) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
        return five;
    }
    number %= 10;
    if (number == 1) {
        return one;
    }
    if (number >= 2 && number <= 4) {
        return two;
    }
    return five;
}
