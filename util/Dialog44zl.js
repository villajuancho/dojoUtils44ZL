

/**
 * Dialog widget
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
	"dijit/Dialog",
	"./load-css",
	"dojo/text!./templates/Dialog44zl.css",
	"./constants"
],
function (
	array, declare, lang, dndMove, dom, domAttr, domClass, domConstruct, domGeometry, domStyle, on, mouse, query, topic,
	focusUtil, Button,
	dDialog,
	LoadCss,
	css, 
	constants
) {	
	return declare("dojoUtils44zl.util.Dialog44zl", [dDialog], {
		
		_buttons: {},
		
		constructor: function(kwArgs) {

              LoadCss.text(this,css);
		},
		
		postCreate: function() {
			this.inherited(arguments);
			domClass.add(this.domNode, "Dialog44zl");
			
			//this.containerNode.innerHTML = "HOLA MUNDO";
			this.cysDialogButtons = domConstruct.create("div", {
				className: "DialogButtons44zl"
			},this.domNode,'last');
		
			this._style = {
				position: "absolute",
				top: "50px",
				left: "50px",
				width: "200px",
				height: "200px",
				visibility: "hidden"
			};

			var style = this._getStyle(this.cysDialogButtons, this.buttonContainerStyle);
			domStyle.set(this.cysDialogButtons, style);

			this.closeButtonNode.innerHTML = "";
			domStyle.set(this.closeButtonNode, {display: "none"});


			
			var cerrar = true;

			array.forEach(this.buttons,lang.hitch(this,function(boton){
				if(boton.name && boton.name == 'cerrar'){
					cerrar = false;
				}
				this._crearBoton(this.cysDialogButtons, boton);
			}));

			if(cerrar){
				this._crearBoton(this.cysDialogButtons, {
					label: "Cerrar",
					onClick: lang.hitch(this, function(){
						this.hide();
					}) 
				});
			}
			
			this.paneStyle = this._getStyle(this._style, this.paneStyle);
			this._resize();

			
		},
		
		_setContainerSize: function(){
			var posT = domGeometry.position(this.titleBar);
			var posD = domGeometry.position(this.domNode);
			var posB = domGeometry.position(this.cysDialogButtons);
			
			var h = posD.h - posT.h - posB.h;
			
            domStyle.set(this.containerNode, "height", h +"px");
			
		},

		_crearBoton: function(parentDom, info){
			var container = domConstruct.create("div", {},parentDom,'first');

			this._buttons[info.label] =  new Button(info, container);
			this._buttons[info.label].startup();
			

		},	

		hide: function() {
			this.inherited(arguments);
			this.paneStyle.visibility = "hidden";
			this._resize();
		},
		
		show: function() {

			this.inherited(arguments);
			this.paneStyle.visibility = "visible";
			this._setContainerSize();
			this._resize();
		},

		startup: function() {
			this.inherited(arguments);
			
		},
		
		focus: function() {
			this.inherited(arguments);
		},
		
		_resize: function(){
			var style = this._getStyle(this._style, this.paneStyle);
			domStyle.set(this.domNode, style);

			//this.resize();
			//this._forceSizeIfOffScreen();
		},

		_getStyle: function(base, more) {
			
			//var style = lang.clone(this._style);
			var style = lang.clone(base);
			
			//lang.mixin(style, this.paneStyle);
			lang.mixin(style, more);
			return style;
		}
		
	});
});
