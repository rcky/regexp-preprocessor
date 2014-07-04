"use strict";

var   Class = require('ee-class')
    , log   = require('ee-log');

module.exports = new Class({
      formatted: ''
    , level: 0

    , visit: function(nodes, keepResults){

        if(keepResults !== true){
            this.formatted = '';
        }
        nodes.forEach(function(node){
            node.accept(this);
        }.bind(this));
    }

    , visitWaterNode: function(node){
        this.formatted += node.content;
    }

    , visitGroupNode: function(node){

        this.push('(');

        if(node.capture === false){
            this.push('?:');
        }

        if(node.named){
            this.push(':').push(node.name).push(':');
        }

        this.visit(node.content, true);

        this.push(')');
    }

    , pushIndent: function(levels){
        var i=levels;
        while(i--){
            this.push('\t')
        }
        return this;
    }

    , push: function(str){
        this.formatted += str;
        return this;
    }

    , toString: function(){
        return this.formatted;
    }
});