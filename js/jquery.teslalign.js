(function( $ ){
	jQuery.fn.teslalign = function(options){
		var options = $.extend( {
			children: false,
			items: false
		}, options);
		options = $.extend({
			children: false,
			items: false
		}, options);
		var make = function(){    
			// Проверяем указаны ли свойства
			if(options.children && options.items) {
				var children = options.children, // Блок, который нужно выровнять
				line_items = options.items; // Количество блоков в строке
				$(this).each(function() {
			 		var $this = $(this),
			 			$child = $this.find(children),
			 			child_num = $child.length;
			 		for(var i = 0, line_item_count = 0, child_height = 0, child_item_array = []; i <= child_num; i++) {
			 			if( line_item_count == line_items || i == child_num) {
							var forchild_height = 0;
							for(var count = 0; count <= child_item_array.length; count++) {
								var $forchild = $child.eq(child_item_array[count-1]);
								if( $forchild.height() > forchild_height ) {
									forchild_height = $forchild.height();
								}
							}
							for(var count = 0; count <= child_item_array.length; count++) {
								$child.eq(child_item_array[count-1]).height(forchild_height);
							}
			 				line_item_count = 0;
			 				child_item_array = [];
			 			}
			 			child_item_array.push(i);
			 			line_item_count++;
			 		}
				});
			} else { console.log('Не указаны свойства для плагина teslalign'); }
		};
		return this.each(make); 
	};
})( jQuery );