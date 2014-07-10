"use strict";

var   Class = require('ee-class')
    , log   = require('ee-log');

module.exports = new Class({

      formatted:    ''
    , groups:       []

    , visit: function(nodes, keepResults){

        if(keepResults !== true){
            this.formatted = '';
            this.groups = [];
        }

        for(var i=0, l=nodes.length ; i<l ; i++){
            nodes[i].accept(this);
        }
    }

    , visitWaterNode: function(node){
        this.formatted += node.content;
    }

    , visitGroupNode: function(node){

        this.push('(');

        if(node.capture === false){
            this.push('?:');
        } else {
            this.groups.push(node);
        }

        this.visit(node.content, true);

        this.push(')');
    }

    , push: function(str){
        this.formatted += str;
        return this;
    }

    , toString: function(){
        return this.formatted;
    }
});