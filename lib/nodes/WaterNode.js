"use strict";

var Class = require('ee-class')
    , Types = require('ee-types')
    , log = require('ee-log');

module.exports = new Class({

    content: ''

    , init: function(content){
        this.content = content;
    }

    , accept: function(visitor){
        return visitor.visitWaterNode(this);
    }
});