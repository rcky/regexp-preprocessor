"use strict";

var Class = require('ee-class')
    , Types = require('ee-types')
    , log = require('ee-log');

module.exports = new Class({
      capture: true
    , named: false
    , name: ''
    , content: null

    , init: function(){
        this.content = []
    }

    , accept: function(visitor){
        return visitor.visitGroupNode(this);
    }

    , add: function(content){
        if(Types.array(content)){
            this.content = this.content.concat(content);
        } else {
            this.content.push(content);
        }
        return this;
    }
});