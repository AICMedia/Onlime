$(document).ready(function() {
	   
	var officeMap;
   var officeCoverMap;
    
	function initOfficeMap() { 
		officeMap = new ymaps.Map('office-map', {
			center: [55.72346180, 37.61652990],
			zoom: 12,
			controls: []
		}),
		officeMap.behaviors.disable('scrollZoom');
		// Задаем свои икноки увеличения и уменьшения
		ZoomLayout = ymaps.templateLayoutFactory.createClass("<div>" +
		"<div id='zoom-in' class='zoom-in coating-btn'><i class='icon-plus'></i></div><br>" +
		"<div id='zoom-out' class='zoom-out coating-btn'><i class='icon-minus'></i></div>" +
		"</div>", {
		build: function () {
			ZoomLayout.superclass.build.call(this);
			this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
			this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);
			$('.zoom-in').bind('click', this.zoomInCallback);
			$('.zoom-out').bind('click', this.zoomOutCallback);
		},
		clear: function () {
			$('.zoom-in').unbind('click', this.zoomInCallback);
			$('.zoom-out').unbind('click', this.zoomOutCallback);
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
					bottom: 30,
					right: 49
				}
			}
		});
		officeMap.controls.add(zoomControl);
        
		// Создаем макет балуна
		MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="office-area" style="left:-40px;top:-20px;position:absolute">' +
				'<div class="popover-inner">' +
				'$[[options.contentLayout mapAutoPan=0]]' +
				'</div>' +
				'</div>', {
               build: function () {
                  this.constructor.superclass.build.call(this);
               },
               /*getShape: function () {
                  $('.office-area').parent().parent().css({left:0,top:0});
               }*/
                
			}),

		// Создание вложенного макета содержимого балуна.
		MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
			'<h4>$[properties.balloonOffice]</h4>' +
			'<div class="office-address">$[properties.balloonAddress]</div>' +
			'<div class="office-metro"><strong>$[properties.balloonMetro],</strong> <span>$[properties.balloonMetroCar]</span></div>' +
			'<div class="office-work"><span>Режим работы:</span> <strong>$[properties.balloonMetroTimes]</strong></div>' +
			'<div class="office-services"><a class="fake-link">Услуги офиса</a></div>' +
            '<ul class="office-services-list">' +
              '{% for service in properties.balloonServices %}' +
                '<li class="office-service">{{ service }}</li>' +
              '{% endfor %}' +
            '</ul>' +
            '<div class="office-not-service">' +
			'<h4>Дополнительные офисы</h4><div class="offices-other">' +
              '{% for number, address in properties.balloonOtherAddresses %}' +
                 '<div class="office-other"><div class="office-other-circle-number">{{ number }}</div><a class="fake-link">{{ address }}</a></div>' +
              '{% endfor %}</div>' +
			'<div class="office-phone-fullday"><h4>Круглосуточная служба поддержки</h4>' +
			'<div class="office-phone">$[properties.balloonPhone]</div>' + 
            '</div></div>'
		),

		officeMap.geoObjects
		// Добавляем офис на Киевской
		.add(new ymaps.Placemark([55.74404428, 37.56284700], {
				balloonOffice: 'Центральный офис', // Название офиса
				balloonAddress: 'ул. Брянская, д. 3', // Адрес офиса
                balloonOtherAddresses: {
                                '1': 'ул. Нагатинская, д. 1, стр. 23',
                                '2': 'ул. Арбат, д. 46',
                                '4': 'ул. Гончарная, д. 26'
                               }, //Адреса других офисов
				balloonMetro: 'Нагатинская', // Станция метро
				balloonMetroCar: 'последний вагон из центра', // Вагон
				balloonMetroTimes: 'с 9:00 до 20:30 без выходных', // Время работы
                balloonServices: {
                	'1': 'Прием платежей за наличный расчет',
                	'2': 'Прием заявок на подключение Домашнего Интернета, Домашнего ТВ, Телефонии',
                	'3': 'Консультирование, обслуживание абонентов по тарифам, услугам и оборудованию',
                	'4': 'Выдача и активация Сертификата «Переезд»',
                	'5': 'Смена тарифного плана'
                	}, //Услуги
                balloonPhone: '8-800-707-12-12'
			}, {
				iconNumber: '3',
				iconLayout: 'default#image',
				iconImageHref: 'images/mark-3.png',
				iconImageSize: [31, 48],
				iconImageOffset: [-15, -48],
				balloonLayout: MyBalloonLayout,
				balloonContentLayout: MyBalloonContentLayout,
            hideIconOnBalloonOpen: false
		}))
		// Добавляем офис на Смоленской
		.add(new ymaps.Placemark([55.74792028, 37.58571850], {
				balloonOffice: 'Центральный офис', // Название офиса
				balloonAddress: 'ул. Арбат, д. 46', // Адрес офиса
                balloonOtherAddresses: {
                                '1': 'ул. Нагатинская, д. 1, стр. 23',
                                '3': 'ул. Брянская, д. 3',
                                '4': 'ул. Гончарная, д. 26'
                               }, //Адреса других офисов
				balloonMetro: 'Смоленская', // Станция метро
				balloonMetroCar: 'последний вагон из центра', // Вагон
				balloonMetroTimes: 'с 9:00 до 20:30 без выходных', // Время работы
                balloonServices: {
                	'1': 'Прием платежей за наличный расчет',
                	'2': 'Прием заявок на подключение Домашнего Интернета, Домашнего ТВ, Телефонии',
                	'3': 'Консультирование, обслуживание абонентов по тарифам, услугам и оборудованию',
                	'4': 'Выдача и активация Сертификата «Переезд»',
                	'5': 'Смена тарифного плана'
                	}, //Услуги
                balloonPhone: '8-800-707-12-12'
			}, {
				iconNumber: '2',
				iconLayout: 'default#image',
				iconImageHref: 'images/mark-2.png',
				iconImageSize: [31, 48],
				iconImageOffset: [-15, -48],
				balloonLayout: MyBalloonLayout,
				balloonContentLayout: MyBalloonContentLayout,
            hideIconOnBalloonOpen: false
		}))
		// Добавляем офис на Таганской
		.add(new ymaps.Placemark([55.74290428, 37.64916650], {
				balloonOffice: 'Центральный офис', // Название офиса
				balloonAddress: 'ул. Гончарная, д. 26', // Адрес офиса
                balloonOtherAddresses: {
                                '1': 'ул. Нагатинская, д. 1, стр. 23',
                                '2': 'ул. Арбат, д. 46',
                                '3': 'ул. Брянская, д. 3',
                               }, //Адреса других офисов
				balloonMetro: 'Таганская', // Станция метро
				balloonMetroCar: 'последний вагон из центра', // Вагон
				balloonMetroTimes: 'с 9:00 до 20:30 без выходных', // Время работы
                balloonServices: {
                	'1': 'Прием платежей за наличный расчет',
                	'2': 'Прием заявок на подключение Домашнего Интернета, Домашнего ТВ, Телефонии',
                	'3': 'Консультирование, обслуживание абонентов по тарифам, услугам и оборудованию',
                	'4': 'Выдача и активация Сертификата «Переезд»',
                	'5': 'Смена тарифного плана'
                	}, //Услуги
                balloonPhone: '8-800-707-12-12'
			}, {
				iconNumber: '4',
				iconLayout: 'default#image',
				iconImageHref: 'images/mark-4.png',
				iconImageSize: [31, 48],
				iconImageOffset: [-15, -48],
				balloonLayout: MyBalloonLayout,
				balloonContentLayout: MyBalloonContentLayout,
            hideIconOnBalloonOpen: false
		}))
		// Добавляем офис на Нагатинской
		.add(new ymaps.Placemark([55.68247328, 37.62714850], {
				balloonOffice: 'Центральный офис', // Название офиса
				balloonAddress: 'ул. Нагатинская, д. 1, стр. 23', // Адрес офиса
                balloonOtherAddresses: {
                                '2': 'ул. Арбат, д. 46',
                                '3': 'ул. Брянская, д. 3',
                                '4': 'ул. Гончарная, д. 26'
                               }, //Адреса других офисов
				balloonMetro: 'Нагатинская', // Станция метро
				balloonMetroCar: 'последний вагон из центра', // Вагон
				balloonMetroTimes: 'с 9:00 до 20:30 без выходных', // Время работы
                balloonServices: {
                	'1': 'Прием платежей за наличный расчет',
                	'2': 'Прием заявок на подключение Домашнего Интернета, Домашнего ТВ, Телефонии',
                	'3': 'Консультирование, обслуживание абонентов по тарифам, услугам и оборудованию',
                	'4': 'Выдача и активация Сертификата «Переезд»',
                	'5': 'Смена тарифного плана'
                	}, //Услуги
                balloonPhone: '8-800-707-12-12'
			}, {
				iconNumber: '1',
				iconLayout: 'default#image',
				iconImageHref: 'images/mark-1.png',
				iconImageSize: [31, 48],
				iconImageOffset: [-15, -48],
				balloonLayout: MyBalloonLayout,
				balloonContentLayout: MyBalloonContentLayout,
            hideIconOnBalloonOpen: false
		})).events
        .add('click', function (e) {
            //возвращаем метки к обычному виду
            officeMap.geoObjects.each(function (geoObject) {
                if (geoObject.options.get('iconImageHref') && 
                    geoObject.options.get('iconImageHref').indexOf('big') != -1) {
                    geoObject.options.set('iconImageHref', 'images/mark-' + geoObject.options.get('iconNumber') + '.png');
                    geoObject.options.set('iconImageSize', [31, 48]);
                    geoObject.options.set('iconImageOffset', [-15, -48]);
                }
            });
            // Ссылку на объект, вызвавший событие,
            // можно получить из поля 'target'.
            var targetOptions = e.get('target').options;
            targetOptions.set('iconImageHref', 'images/mark-' + targetOptions.get('iconNumber') + '-big.png');
            targetOptions.set('iconImageSize', [62, 96]);
            targetOptions.set('iconImageOffset', [-31, -96]);
        });
        
        $('.office-map').on('click', '.office-services a', function() { //событие для раскрытия услуг
            if ($('.office-services-list').is(':visible')) {
                $('.office-services-list').slideUp();
                $('.office-not-service').slideDown();
            } else {
                $('.office-services-list').slideDown();
                $('.office-not-service').slideUp();
            }
        });
        
        $('.office-map').on('click', '.office-other a', function() { //событие для перехода к другим офисам
            var self = $(this);
            officeMap.geoObjects.each(function (geoObject) {
                if (geoObject.properties.get('balloonAddress') == self.text()) {
                    geoObject.balloon.open();
                    geoObject.options.set('iconImageHref', 'images/mark-' + geoObject.options.get('iconNumber') + '-big.png');
                    geoObject.options.set('iconImageSize', [62, 96]);
                    geoObject.options.set('iconImageOffset', [-31, -96]);
                }
                else {
                    geoObject.balloon.close();
                    if (geoObject.options.get('iconImageHref')) {
                        geoObject.options.set('iconImageHref', 'images/mark-' + geoObject.options.get('iconNumber') + '.png');
                        geoObject.options.set('iconImageSize', [31, 48]);
                        geoObject.options.set('iconImageOffset', [-15, -48]);
                    }
                }
            });
        });
        
        officeCoverMap = new ymaps.Map('office-cover-map', {
			center: [55.72346180, 37.61652990],
			zoom: 12,
			controls: []
		  });
        officeCoverMap.behaviors.disable('scrollZoom');
        // Создаем многоугольник, используя вспомогательный класс Polygon.
        var TVPolygon = new ymaps.Polygon([
            // Указываем координаты вершин многоугольника.
            [
                [55.75, 37.50],
                [55.80, 37.60],
                [55.75, 37.70],
                [55.70, 37.70],
                [55.70, 37.50]
            ]
        ], {
            // Описываем свойства геообъекта.
            // Содержимое балуна.
            hintContent: ""
        }, {
            // Задаем опции геообъекта.
            // Цвет заливки.
            fillColor: '#00FF0088',
            opacity: 0.5,
            strokeWidth: 0
        });

        // Добавляем многоугольник на карту.
        officeCoverMap.geoObjects.add(TVPolygon);
        //добавляем кнопки зума
        zoomCoverControl = new ymaps.control.ZoomControl({
           options: {
              layout: ZoomLayout,
              float: 'none',
              position: {
                 bottom: 30,
                 right: 49
              }
           }
        });
        officeCoverMap.controls.add(zoomCoverControl);
        var inetPolygon = new ymaps.Polygon([
            // Указываем координаты вершин многоугольника.
            [
                [55.85, 37.60],
                [55.90, 37.70],
                [55.75, 37.50],
                [55.60, 37.30],
                [55.60, 37.60],
                [55.80, 37.70]
            ]
        ], {
            // Описываем свойства геообъекта.
            // Содержимое балуна.
            hintContent: ""
        }, {
            // Задаем опции геообъекта.
            // Цвет заливки.
            fillColor: '#00FF0088',
            opacity: 0.4,
            strokeWidth: 0
        });

        // Добавляем многоугольник на карту.
        officeCoverMap.geoObjects.add(inetPolygon);
                                
        //переключение между картами
        $('.office-tab1').on('click', function() {
            if ($('#office-cover-map').is(':visible')) {
                $('#office-cover-map').hide();
                $('#office-map').show();
                $('.office-tab2').removeClass('current');
                $('.office-tab1').addClass('current');
            }
        });
        
        var balloonCoverContent = ymaps.templateLayoutFactory.createClass(
            '<div class="office-address office-address-title">Проверьте ваш адрес</div>' +
            '<input type="text" class="office-search form-text" placeholder="Название улицы">' +
            '<button class="office-search-button"><img src="images/search-submit-office.jpg"></button>' +
            '<div class="office-checkbox"><input type="checkbox" id="office-inet" checked="checked"/>' +
            '<label class="office-label" for="office-inet">Интернет</label>' +
            '<input type="checkbox" id="office-TV" checked="checked"/><label class="office-label" for="office-TV">ТВ</label></div>'
        );
            
        $('.office-tab2').on('click', function() {
            if ($('#office-map').is(':visible')) {
                $('#office-map').hide();
                $('#office-cover-map').show();
                $('.office-tab2').addClass('current');
                $('.office-tab1').removeClass('current');
            }
            setTimeout(function() {
                officeCoverMap.balloon.open([55.72346180, 37.61652990], '', {
                closeButton: false,
                layout: MyBalloonLayout,
                contentLayout: balloonCoverContent
                });
            }, 200);
        });
        
        //убираем/ставим многоугольники по клику на чекбоксы
        $('#office-cover-map').on('click', '#office-inet', function() {
            if ($('#office-inet').prop("checked")) {
                 officeCoverMap.geoObjects.add(TVPolygon);
            } else {
                 officeCoverMap.geoObjects.remove(TVPolygon);
            }
        });
        
        $('#office-cover-map').on('click', '#office-TV', function() {
            if ($('#office-TV').prop("checked")) {
                 officeCoverMap.geoObjects.add(inetPolygon);
            } else {
                 officeCoverMap.geoObjects.remove(inetPolygon);
            }
        });
	// Конец функции initOfficeMap
	}



	ymaps.ready(initOfficeMap);

});