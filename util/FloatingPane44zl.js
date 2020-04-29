

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
	"dojo/text!./templates/FloatingPane44zl.css",
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
	return declare("dojoUtils44zl.util.FloatingPane44zl", [xFloatingPane], {
		
		_buttonsDiv: null,
		_closeButton: null,
		_top: null,
		_left: null,
		
		constructor: function(kwArgs, otro) {
		
			//cambiar container
			this.container = dom.byId("cysPrincipal");
			
			var baseURLdojoUtils44zl = '';

			for(i=0;i<dojoConfig.packages.length;i++){
				if(dojoConfig.packages[i].location.indexOf("dojoUtils44zl")>=0){
					baseURLdojoUtils44zl = dojoConfig.packages[i].location;
					break;
				}
			}

			var css2 = css.replace(/baseURLdojoUtils44zl/gi,baseURLdojoUtils44zl);
			LoadCss.text(this,css2);
			this.style = "position:absolute;top:500;left:500;width:200px;height:200px;visibility:hidden;",
        
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
			
			domClass.add(this.domNode, "FloatingPane44zl");
			
			this._style = {
				position: "absolute",
				top: "50px",
				left: "50px",
				width: "200px",
				height: "200px",
				visibility: "hidden"
			};
            
            this.paneStyle = this._getStyle();
            
			this._resize();
			
			//crea el boton de cerrar
			this.own(this._buttonsDiv = domConstruct.create("div", {
				className: "FloatingPaneActions44zl"
			}, this.focusNode, "last"));
			this._closeButton = new ContentPane({
				className: "FloatingPaneClose44zl",
				tabindex: "0",
				onClick: lang.hitch(this, "onClick_closeButton")
			});
			domConstruct.place(this._closeButton.domNode, this._buttonsDiv, "last");
			this._closeButton.startup();

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
			this.inherited(arguments);
			this.paneStyle.visibility = "visible";
			this._resize();
		},

		updateSize: function(kwArgs) {
			this.inherited(arguments);
			this._resize();
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
