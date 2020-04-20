define([
    'dojo/on',
    'dojo/query',
    'dojo/_base/window',
    'dojo/dom-construct',
    'dojo/Deferred'
], function (
    on,
    query,
    win,
    domConstruct,
    Deferred
) {
    'use strict';
    
    function loadCss (url) {
        var deferred = new Deferred();
        
        var link = domConstruct.create('link', {
            rel: 'stylesheet',
            type: 'text/css',
            href: url
        }, win.body());
        
        on(link, 'load', function () {
            deferred.resolve();
        });
        
        return deferred.promise;
    }

    function loadCssText (parent, cssin) {
        
        
        var css = cssin || "";
        if (css == "") {
            return;
        }
        
        var tag = "style";
        var attributes = {media: "all"};
        var refNode = query("head script")[0];
        var position = "before";
            
        if (parent.cssNode) {
            domConstruct.destroy(parent.cssNode);
        }
        
        // place it before the first <script>
        parent.cssNode = domConstruct.create(tag, attributes, refNode, position);

        if (parent.cssNode.styleSheet) {
            parent.cssNode.styleSheet.cssText = css; // IE
        } else {
            parent.cssNode.innerHTML = css; // the others
        }
    }
    
    return {
        file: loadCss,
        text: loadCssText 
    };
})