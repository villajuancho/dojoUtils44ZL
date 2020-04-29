

/**
 * Floating pane widget
 */

define([
    "dojo/_base/array",
    "dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dnd/move",
	"dojo/dom",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/on",
	"dojo/mouse",
	"dojo/query",
	"dojo/topic",
	"dijit/focus",
	"dijit/form/Button",
	"dojox/layout/FloatingPane",
	"dijit/layout/ContentPane",
	"./load-css",
	"dojo/text!./templates/FloatingMini44zl.css",
	"./constants"
],
function (
	array, declare, lang, dndMove, dom, domAttr, domClass, domConstruct, domGeometry, domStyle, on, mouse, query, topic,
	focusUtil, Button,
	xFloatingPane,
	ContentPane,
	//Library, 
	LoadCss,
	css, 
	constants
) {	
	return declare("dojoUtils44zl.util.FloatingMini44zl", [xFloatingPane], {
		
		_buttonsDiv: null,
		_closeButton: null,
		_top: null,
		_left: null,
		_resizeIcon: false,
		
		constructor: function(kwArgs, otro) {
		
			//cambiar container
			//this.container = dom.byId("cysPrincipal");
			
			var baseURLdojoUtils44zl = '';

			for(i=0;i<dojoConfig.packages.length;i++){
				if(dojoConfig.packages[i].location.indexOf("dojoUtils44zl")>=0){
					baseURLdojoUtils44zl = dojoConfig.packages[i].location;
					break;
				}
			}

			var css2 = css.replace(/baseURLdojoUtils44zl/gi,baseURLdojoUtils44zl);
			LoadCss.text(this,css2);
			//this.style = "position:absolute;top:500;left:500;width:200px;height:200px;visibility:hidden;",
        
			//propiedades por defecto
			this.closable = false;
			this.resizable = true;
			this.maxable = false;
			this.dockable = false;

			topic.subscribe(constants.topics.windowsResize, lang.hitch(this, function(){
				//setTimeout(lang.hitch(this, this._resize), 1000);  
				this._resize();
			}));
			
              
              
		},
		
		postCreate: function() {
			this.inherited(arguments);
			
			domClass.add(this.domNode, "FloatingMini44zl");
			
			this._style = {
				//position: "relative",
				top: "50px",
				left: "50px",
				width: "200px",
				height: "200px",
				visibility: "hidden"
			};
            
            this.paneStyle = this._getStyle();
            
			this._resize();
			
			this.titleNode.innerHTML = "xxxx";
			domClass.add(this.titleNode, "FloatingMiniTitle44zl");

			//crea el boton de cerrar
			this.own(this._buttonsDiv = domConstruct.create("div", {
				className: "FloatingMiniActions44zl"
			//}, this.canvas, "last"));
			}, this.focusNode, "last"));

			this.own(this._closeButton = domConstruct.create("div", {
				className: "FloatingMiniClose44zl"
			//}, this.canvas, "last"));
			}, this._buttonsDiv, "last"));

			on(this._closeButton, "click", lang.hitch(this,this.onClick_closeButton));
			this._closeButton.innerHTML = '<svg height="16" width="16">' +
				'<path d="M1 1 L15 15 M1 15 L15 1" stroke="var(--cys-icon-color)" stroke-width="2" fill="none" />'+
			'</svg>';
			

			if (this.container) {
				this.moveable = new dndMove.boxConstrainedMoveable(
					this.domNode, {
						handle: this.focusNode,
						within: true
					}
				);
				this.moveable.constraints = lang.hitch(this, function(info) {
					var box = domGeometry.getContentBox(this.container);
					return box;
				});
				
				
				topic.subscribe("/dnd/move/stop", lang.hitch(this, function(Node) {
					console.log("MOVE STOP: " + Node.node.id);
					if (this.domNode.id == Node.node.id) {
						var pos = domGeometry.position(this.domNode);
						var x = pos.x;
						var y = pos.y;
						var w = pos.w;
						var h = pos.h;
						
						if (x != 0 && y != 0 && w != 0 && h != 0) {
							// guarda la ultima posicion
							var cstyle = domStyle.getComputedStyle(this.domNode);
							this.paneStyle.top = cstyle.top;
							this.paneStyle.left = cstyle.left;
						}

						this._setNewPos(pos);
					}

				}));
				/*
				this.moveable.onMoveStop = function(x,y){
					
					
				};
				*/

			}
			
			

			this._resize();
			
			console.log("dojoConfig");
			console.log(dojoConfig);
			
		},
		

		onClick_closeButton: function() {
			this.hide();
		},

		hide: function() {
			
			this.inherited(arguments);
			this.paneStyle.visibility = "hidden";
			this._resize();
		},
		
		show: function() {
			if(!this._resizeIcon){
				//dojoxResizeHandle dojoxResizeNW
				/*
				this.own(this._resizeHandler = domConstruct.create("div", {
					className: "dojoxResizeHandle dojoxResizeNW"
				}, this.canvas, "last"));
				*/
				this._resizeIcon = true;
				var resizeHandle = query(".dojoxResizeHandle", this.canvas);
				resizeHandle[0].innerHTML = '<svg height="13" width="13">'+
					'<path d="M0 13 L13 13 L13 0" stroke="var(--cys-icon-color)" stroke-width="2" fill="none" />'+
					'<path d="M3 9 L9 9 L9 3" stroke="var(--cys-icon-color)" stroke-width="2" fill="none" />'+
				'</svg>';
			}
			this.inherited(arguments);
			this.paneStyle.visibility = "visible";
			this._resize();
		},

		updateSize: function(kwArgs) {
			this.inherited(arguments);
			this._resize();
		},

		resize: function(kwArgs) {
			
			this.inherited(arguments);
			
			var pos = domGeometry.position(this.domNode);
			if (pos.w != 0 && pos.h != 0) {
				this.paneStyle.width = pos.w + "px";
				this.paneStyle.height = pos.h + "px";
			}
			
			this._setSizeBloque();
			
		},
		
		startup: function() {
			this.inherited(arguments);
			this._resize();
		},
		
		focus: function() {
			this.inherited(arguments);
		},
        
		_resize: function(){
			var style = this._getStyle();
			domStyle.set(this.domNode, style);

			//this.resize();
			//this._forceSizeIfOffScreen();
		},

		_setNewPos: function(local){
			var objectList = query(".FloatingMini44zl", this.container);
			var gap = 15; //gap para comparar
			var setGap = 5; //gap de sistancia entre elementos
			var x = 0;
			var y = 0;
			var setItem = false;
			local.sx = local.x + local.w;
			local.sy = local.y + local.h;
			this.bloque = null;
			objectList.forEach(element => {
				if(element.id != this.domNode.id){
					var pos = domGeometry.position(element);
					pos.sx = pos.x + pos.w;
					pos.sy = pos.y + pos.h;
					
					if(pos.sx-gap < local.x && local.x < pos.sx+gap){
						if(pos.y-gap < local.y && local.y < pos.y+gap){
							x = pos.x + pos.w + setGap;
							y = pos.y;
							setItem = true;
						}else if(pos.sy-gap < local.sy && local.sy < pos.sy+gap){
							x = pos.x + pos.w + setGap;
							y = pos.y + pos.h - local.h;
							setItem = true;
						}
					}else if(pos.x-gap < local.sx && local.sx < pos.x+gap){
						if(pos.y-gap < local.y && local.y < pos.y+gap){
							x = pos.x - local.w - setGap;
							y = pos.y;
							setItem = true;
						}else if(pos.sy-gap < local.sy && local.sy < pos.sy+gap){
							x = pos.x - local.w - setGap;
							y = pos.y + pos.h - local.h;
							setItem = true;
						}
					}else if(pos.sx-gap < local.sx && local.sx < pos.sx+gap){
						if(pos.sy-gap < local.y && local.y < pos.sy+gap){
							x = pos.x + pos.w - local.w;
							y = pos.y + pos.h + setGap;
							setItem = true;
						}else if(pos.y-gap < local.sy && local.sy < pos.y+gap){
							x = pos.x + pos.w - local.w;
							y = pos.y - local.h - setGap;
							setItem = true;
						}
					}else if(pos.x-gap < local.x && local.x < pos.x+gap){
						if(pos.sy-gap < local.y && local.y < pos.sy+gap){
							x = pos.x;
							y = pos.y + pos.h + setGap;
							setItem = true;
						}else if(pos.y-gap < local.sy && local.y < pos.sy+gap){
							x = pos.x;
							y = pos.y - local.h - setGap;
							setItem = true;
						}
					}
					
					if(setItem){
						this.bloque = element;
						this.paneStyle.left = x + "px";
						this.paneStyle.top = y + "px";
						this._resize();
					}

				}
			});
		},

		_setSizeBloque: function(){
			
			var objectList = query(".FloatingMini44zl", this.container);
			var gap = 15;
			var x = 0;
			var y = 0;
			var setItem = false;
			
			var local = domGeometry.position(this.domNode);
			local.sx = local.x + local.w;
			local.sy = local.y + local.h;


			objectList.forEach(element => {
				if(element.id != this.domNode.id){
					var pos = domGeometry.position(element);
					pos.sx = pos.x + pos.w;
					pos.sy = pos.y + pos.h;
					
					if(pos.sx-gap < local.sx && local.sx < pos.sx+gap){
						x = pos.sx - local.x - 2; 
						this.paneStyle.width = x + "px";
					}else if(pos.sy-gap < local.sy && local.sy < pos.sy+gap){
						y = pos.sy - local.y - 2;
						this.paneStyle.height = y + "px";
					}

					this._resize();
				}
			});
			
		},

		_getStyle: function() {
			// summary:
			//		Return the floating pane style based on the pane's current visibility
			
			var style = lang.clone(this._style);
			//lang.mixin(style, {top: this._top, left: this._left});
			//lang.mixin(style, {height: this._height, width: this._width});
			//lang.mixin(style, {visibility: this._visibility});
			
			lang.mixin(style, this.paneStyle);
			return style;
		},

		_forceSizeIfOffScreen: function() {
			// summary:
			//		Force the pane size if not completely visible
			
			var top = parseInt(this._top);
			var left = parseInt(this._left);
			var height = parseInt(this._height);
			var width = parseInt(this._width);
			if (this._isMinimal) {
				height = parseInt(this._minimalHeight);
				width = parseInt(this._minimalWidth);
			}
			if (this._isEdit) {
				height = parseInt(this._editHeight);
				width = parseInt(this._editWidth);
			}
			var box = domGeometry.getContentBox(this.container);
			
		}
		
	});
});
