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
		    this.$itemsQty = this.$element.find( "#itemsQty", "#itemsQtyPdp" );




			this.currency = "&pound;"; // HTML entity of the currency to be displayed in the layout
			this.currencyString = "£"; // Currency symbol as textual string
			
			// Method invocation
			
			this.createCart();
			this.handleAddToCartForm();
			this.emptyCart();
			this.updateCart();
			this.displayCart();
			this.deleteProduct();
			this.changeQty();
			this.getSize();
			//this.deleteConfirm();
		},
		
		createCart: function() {
			$('.confirmed').hide();
			if( this.storage.getItem( this.cartName ) == null ) {

				var cart = {};
				cart.items = [];

				this.storage.setItem( this.cartName, this._toJSONString( cart ) );
				this.storage.setItem( this.total, "0" );
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

					$('.confirmed').show();


						
						var productName = $( this ).data( "product" );
						var newItems = [];
						for( var i = 0; i < items.length; ++i ) {
							var item = items[i];
							var product = item.product;	
							if( product == productName ) {
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
						$('#yes').click(function(){
							{
							self.storage.setItem( self.total, self._convertNumber( Math.round(updatedTotal) ) );


						self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );
						$( this ).children( ".item" ).remove();
						self.$subTotal[0].innerHTML = self.currency + " " + self.storage.getItem( self.total );
							$('.confirmed').hide();
						}
						})

						
						
						
						
					
					$('#no').click(function(){
						$('.confirmed').hide();
						return false;
					})
					
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
					$tableCartBody.html( "" );	
				} else {

					for( var i = 0; i < items.length; ++i ) {
						var item = items[i];
						var product = item.product;
						var price = this.currency + " " + item.price;
						var qty = item.qty;
						var color = item.color;
						var size = item.size;


						var html = '<div class="item"> <figure> <img src="img/items/1.png" alt=""><figcaption class="product-price">' + price + ' </figcaption>';
						html += '</figure> <p class="product-name">' + product + '</p> <p class="color">Color: ' + color + '</p> <p class="size">Size: ' + size + '</p>'; 
						html += '<p class="quantity">Quantity: ' + qty + '</p> <a class="remove">Remove item</a> </div>';
						//var html = "<tr><td class='pimage'><img src='img/detail/1.jpg' /></td><td class='pname'>" + product + "<br/>" + "<p style='font-size:8px'> Ref:2124123</p>" + "</td><td class='pcolor'>" + 'One color' + "</td><td class='psize'>" + size + "</td>" + "<td class='pqty'><input type='text' value='" + qty + "' class='qty'><div id='plus-minus'><div class='plus'>&#9652;</div><div class='minus'>&#9662;</div></div></td>";
						//html += "<td class='pprice'>" + price + "</td><td class='pdelete'><a href='' data-product='" + product + "'>&times;</a></td></tr>";
						
						var itemsArea = document.getElementById('itemsArea');
						itemsArea.innerHTML += html;
						
						//$tableCartBody.html( $tableCartBody.html() + html );
					}

				}

				if( items.length == 0 ) {
					this.$subTotal[0].innerHTML = this.currency + " " + 0.00;
				} else {	

					var total = Math.round(this.storage.getItem( this.total ));         
					this.$subTotal[0].innerHTML = this.currency + " " + total;  // subtotal updater

					var qItems = items.length;					
					//this.$itemsQty[0].innerHTML = qItems++; 					// basket(0) updater
				}
			} 
		},
		
		emptyCart: function() {
			var self = this;
			if( self.$emptyCartBtn.length ) {
				self.$emptyCartBtn.on( "click", function() {
					self._emptyCart();
				});
			}
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
						var cartObj = {
							size: psize,
							color: pcolor,
							qty: pqty,
							product: pname,
							price: pprice
							
						};

						updatedCart.items.push( cartObj );

						var subTotal = Math.round(pqty * pprice);
						updatedTotal += subTotal;
						totalQty += pqty;
					});


					self.storage.setItem( self.total, self._convertNumber( updatedTotal ) );
					self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );

				});
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
				
				$form.on( "submit", function() {
					var size = self._convertString($form.find("#go").attr("atr"));
					var qty = 1;
					var subTotal = qty * price;
					var total = self._convertString( self.storage.getItem( self.total ) );
					var sTotal = total + subTotal;
					self.storage.setItem( self.total, sTotal );
					self._addToCart({
						size: size,
						//color: color,
						product: name,
						price: price,
						qty: qty
					});
				});
			});
		},

		// Changes items quantity

		changeQty: function(){
			var localQty = parseInt($('.qty').val());
			$('.plus').click(function(){
				$('.qty').val(++localQty);
			});
			$('.minus').click(function(){
				if(localQty <= 1){
					localQty = 1;
				} else
				$('.qty').val(--localQty);
			});
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
		/*deleteConfirm: function(){
			$('.pdelete').click(function(){
				var x = '';
				if(confirm(x) == false){
					return false;
				}
			});
		},*/

		/*deleteConfirm: function(){
			$('.pdelete').click(function(){
				$('.confirmed').toggleClass('.confirmed-t');
			})
		},*/

		// Empties the session storage
		
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

		/* Converts a numeric string into a number
		 * @param numStr String the numeric string to be converted
		 * @returns num Number the number
		 */

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