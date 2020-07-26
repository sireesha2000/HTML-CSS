(function( $ ) {
	$.Shop = function( element ) {
		this.$element = $( element );
		this.init();
	};
	$.Shop.prototype = { 

		init: function() {

		    // Properties

		    this.cartPrefix = "store-"; 
		    this.cartName = this.cartPrefix + "cart"; 
		    this.total = this.cartPrefix + "total"; 
		    this.storage = localStorage; 


		    this.$formAddToCart = this.$element.find( "form.add-to-cart" ); 
		    this.$formCart = this.$element.find( "#shopping-cart" ); 
		    this.$subTotal = this.$element.find( ".total-number" ); 
		    this.$shoppingCartActions = this.$element.find( ".buttons" ); 
		    this.$updateCartBtn = this.$shoppingCartActions.find( "#update-cart" ); 
		    this.$emptyCartBtn = this.$shoppingCartActions.find( ".empty" );
		    this.$orderCartBtn = this.$shoppingCartActions.find( ".order" ); 
		    this.$itemsQty = this.$element.find( ".itemsQty", ".itemsQtyPdp" );

		    this.$headerStotal = this.$element.find( ".header-stotal" );


			this.currency = "&pound;"; // HTML entity of the currency to be displayed in the layout
			this.currencyString = "£"; // Currency symbol as textual string
			
			// Method invocation
			
			this.createCart();
			this.handleAddToCartForm();
			this.emptyCart();
			this.orderedCart();
			this.updateCart();
			this.displayCart();
			this.deleteProduct();
			//this.changeQty();
			this.getSize();
			this.getColor();
			//this.deleteConfirm();



		},

				


		createCart: function() {
			$('.confirmed').hide();
			$('.ordered-bag').hide();
			$('.empty-bag').hide();
			if( this.storage.getItem( this.cartName ) == null ) {

				var cart = {};
				cart.items = [];

				this.storage.setItem( this.cartName, this._toJSONString( cart ) );
				this.storage.setItem( this.total, "0" );

				$('.empty-bag').show();
			}
		},


		// Delete a product from the shopping cart

		deleteProduct: function() {
			var self = this;
			if( self.$formCart.length ) {
				var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var items = cart.items;

				$( document ).on( "click", ".remove", function( e ) {
					e.preventDefault();

					//$('.confirmed').show();


						
						var productName = $( this ).data( "product" );
						var productSize = $( this ).data( "size" );
						var productColor = $( this ).data( "color" );
							
						var newItems = [];
						for( var i = 0; i < items.length; ++i ) {
							var item = items[i];
							var product = item.product;	
							var size = item.size;	
							var color = item.color;	
							
							if( product == productName && size == productSize && color == productColor) {
								items.splice( i, 1 );
							}
						}

						newItems = items;
						var updatedCart = {};
						updatedCart.items = newItems;

						var updatedTotal = 0;
						var totalQty = 0;
						if( newItems.length == 0 ) {
							updatedTotal = 0;
							totalQty = 0;
						} else {
							for( var j = 0; j < newItems.length; ++j ) {
								var prod = newItems[j];
								var sub = prod.price * prod.qty;
								updatedTotal += sub;
								totalQty += prod.qty;
							}
						}

						self.storage.setItem( self.total, self._convertNumber(updatedTotal ) );
						self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );
						$( this ).parents( ".item" ).remove();
						self.$subTotal[0].innerHTML = self.currency + self.storage.getItem( self.total );
						/*$('#yes').click(function(){
							{
							self.storage.setItem( self.total, self._convertNumber(updatedTotal ) );


						self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );
						$( this ).parents( ".item" ).remove();
						self.$subTotal[0].innerHTML = self.currency + self.storage.getItem( self.total );
							$('.confirmed').hide();
						}
						})


					
					$('#no').click(function(){
						$('.confirmed').hide();
						return false;
					})*/
					
				});
			}
		},



		// Displays the shopping cart
		
		displayCart: function() {
			if( this.$formCart.length ) {
				var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var items = cart.items;
				var $tableCart = this.$formCart.find( "#shopping-cart" );
				var $tableCartBody = $tableCart.find( ".items" );

				if( items.length == 0 ) {
					//$('.ordered-bag').hide();
					//$('.empty-bag').show();	
					$tableCartBody.html( "" );	
				} else {
					$('.ordered-bag').hide();
					$('.empty-bag').hide();	
					for( var i = 0; i < items.length; ++i ) {
						var item = items[i];
						var product = item.product;
						var price = this.currency + " " + item.price;
						var qty = item.qty;
						var color = item.color;
						var size = item.size;
						var image = item.image;


						var html = '<div class="item" data-product="'+product+'" data-size="'+size+'" data-color="'+color+'"> <figure> <img src="'+image+'" alt=""><figcaption class="product-price">' + price + ' </figcaption>';
						html += '</figure> <p class="product-name">' + product + '</p> <p class="pcolor">Color: ' + color + '</p> <p class="psize">Size: ' + size + '</p>'; 
						html += '<p class="quantity">Quantity: ' + qty + '</p> <a class="remove" data-product="'+product+'" data-size="'+size+'" data-color="'+color+'">Remove item</a> </div>';
						//var html = "<tr><td class='pimage'><img src='img/detail/1.jpg' /></td><td class='pname'>" + product + "<br/>" + "<p style='font-size:8px'> Ref:2124123</p>" + "</td><td class='pcolor'>" + 'One color' + "</td><td class='psize'>" + size + "</td>" + "<td class='pqty'><input type='text' value='" + qty + "' class='qty'><div id='plus-minus'><div class='plus'>&#9652;</div><div class='minus'>&#9662;</div></div></td>";
						//html += "<td class='pprice'>" + price + "</td><td class='pdelete'><a href='' data-product='" + product + "'>&times;</a></td></tr>";
						
						var itemsArea = document.getElementById('itemsArea');
						itemsArea.innerHTML += html;
						
						//$tableCartBody.html( $tableCartBody.html() + html );
					}

				}

				if( items.length == 0 ) {
					this.$subTotal[0].innerHTML = this.currency + "" + 0.00;
				} else {	

					var total = this.storage.getItem( this.total );         
					this.$subTotal[0].innerHTML = this.currency + total;  // subtotal updater
					this.$headerStotal[0].innerHTML = this.currency + total;

					var qItems = items.length;					
					this.$itemsQty[0].innerHTML = qItems++; 					// basket(0) updater
				}
			} else {
				var total = this.storage.getItem( this.total );         
					this.$headerStotal[0].innerHTML = this.currency + total;
				var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var items = cart.items;
				var qItems = items.length;					
					this.$itemsQty[0].innerHTML = qItems++; 	
			}
		},



		// Adds items to the shopping cart
		handleAddToCartForm: function() {
			var self = this;
			self.$formAddToCart.each(function() {
				var $form = $( this );
				var $product = $form.parent();
				var price = self._convertString( $product.data( "price" ) );
				var name =  $product.data( "name" );
				//var size = $(".size-toggled").val();
				//var color = $(".color-toggled").val();
				var image = $('.product-image').find('img').attr('src');
				






				$form.on( "submit", function() {
					//var size = self._convertString($form.find("#go").attr("atr"));
					//var color = self._convertString($form.find("#go").attr("atr"));
					var size = $(".size-toggled").val();
					var color = $(".color-toggled").val();
					var qty = 1;
					var subTotal = qty * price;
					var total = self._convertString( self.storage.getItem( self.total ) );
					var sTotal = total + subTotal;
					self.storage.setItem( self.total, sTotal );
					self._addToCart({
						size: size,
						product: name,
						color: color,
						image: image,
						price: price,
						qty: qty
					});
				});
			});

						/*var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
						var items = cart.items;
						var productName = $( this ).data( "product" );
						var productSize = $( this ).data( "size" );
						var productColor = $( this ).data( "color" );
							
						var newItems = [];
						for( var i = 0; i < items.length; ++i ) {
							var item = items[i];
							var product = item.product;	
							var size = item.size;	
							var color = item.color;	
							
							if( product == productName && size == productSize && color == productColor) {
								qty = qty + 1;
							}
						}*/
		},

		// Updates the cart
		updateCart: function() {
			var self = this;
			if( self.$updateCartBtn.length ) {
				self.$updateCartBtn.on( "click", function() {
					var $rows = self.$formCart.find( "form div.items" );
					var cart = self.storage.getItem( self.cartName );
					var total = self.storage.getItem( self.total );

					var updatedTotal = 0;
					var totalQty = 0;
					var updatedCart = {};
					updatedCart.items = [];

					$rows.each(function() {
						var $row = $( this );
						var pname = $.trim( $row.find( ".product-name" ).text() );
						var pqty = self._convertString( $row.find( ".quantity" ).val() );
						var pprice = self._convertString( self._extractPrice( $row.find( ".product-price" ) ) );
						var psize = self._convertString($row.find('.size').text());
						var pcolor = self._convertString($row.find('.color').text());
						var pimage = self._convertString($row.find('figure img').text());
						var cartObj = {
							size: psize,
							color: pcolor,
							qty: pqty,
							product: pname,
							price: pprice,
							image: pimage
							
						};

						updatedCart.items.push( cartObj );

						var subTotal = pqty * pprice;
						updatedTotal += subTotal;
						totalQty += pqty;
					});


					self.storage.setItem( self.total, self._convertNumber( updatedTotal ) );
					self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );

				});
			}
		},


		getSize: function(){
			$('.size').click(function(){
				var opt = $(this).val();
				$('#go').attr("atr", opt);
				var res = parseInt($('#go').attr("atr"));
				$('.psize').html('<span>'+ res +'</span>');
			})	
		},

		getColor: function(){
			$('.color').click(function(){
				var opt = $(this).val();
				$('#go').attr("atr", opt);
				var res = parseInt($('#go').attr("atr"));
				$('.pcolor').html('<span>'+ res +'</span>');
			})	
		},

		


		emptyCart: function() {
			var self = this;
			if( self.$emptyCartBtn.length ) {
				self.$emptyCartBtn.on( "click", function() {
					self._emptyCart();
					$('.empty-bag').show();	
					$('.ordered-bag').hide();
					$('.items').hide();
				});
			}
		},

		orderedCart: function() {
			var self = this;
			if( self.$orderCartBtn.length ) {
				self.$orderCartBtn.on( "click", function() {
					self._emptyCart();
					$('.ordered-bag').show();
					$('.empty-bag').hide();	
					$('.items').hide();
				});
			}
		},





		// Empties the storage
		_emptyCart: function() {
			this.storage.clear();
		},

		/* Format a number by decimal places
		 * @param num Number the number to be formatted
		 * @param places Number the decimal places
		 * @returns n Number the formatted number
		 */
		_formatNumber: function( num, places ) {
		 	var n = num.toFixed( places );
		 	return n;
		 },

		/* Extract the numeric portion from a string
		 * @param element Object the jQuery element that contains the relevant string
		 * @returns price String the numeric string
		 */
		 _extractPrice: function( element ) {
		 	var self = this;
		 	var text = element.text();
		 	var price = text.replace( self.currencyString, "" ).replace( " ", "" );
		 	return price;
		 },

		/* Converts a JSON string to a JavaScript object
		 * @param str String the JSON string
		 * @returns obj Object the JavaScript object
		 */
		 _toJSONObject: function( str ) {
		 	var obj = JSON.parse( str );
		 	return obj;
		 },

		 /* Converts a JavaScript object to a JSON string
		 * @param obj Object the JavaScript object
		 * @returns str String the JSON string
		 */
		 _toJSONString: function( obj ) {
		 	var str = JSON.stringify( obj );
		 	return str;
		 },
		 _convertString: function( numStr ) {
		 	var num;
		 	if( /^[-+]?[0-9]+\.[0-9]+$/.test( numStr ) ) {
		 		num = parseFloat( numStr );
		 	} else if( /^\d+$/.test( numStr ) ) {
		 		num = parseInt( numStr, 10 );
		 	} else {
		 		num = Number( numStr );
		 	}

		 	if( !isNaN( num ) ) {
		 		return num;
		 	} else {
		 		console.warn( numStr + " cannot be converted into a number" );
		 		return false;
		 	}
		 },

		/* Converts a number to a string
		 * @param n Number the number to be converted
		 * @returns str String the string returned
		 */
		 _convertNumber: function( n ) {
		 	var str = n.toString();
		 	return str;
		 },


		/* Add an object to the cart as a JSON string
		 * @param values Object the object to be added to the cart
		 * @returns void
		 */
		 _addToCart: function( values ) {
		 	var cart = this.storage.getItem( this.cartName );

		 	var cartObject = this._toJSONObject( cart );
		 	var cartCopy = cartObject;
		 	var items = cartCopy.items;
		 	items.push( values );

		 	this.storage.setItem( this.cartName, this._toJSONString( cartCopy ) );
		 },


	};

	$(function() {
			var shop = new $.Shop( ".wrapper" );
		});

})( jQuery );
