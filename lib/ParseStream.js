"use strict";

var Class = require('ee-class')
    , Types = require('ee-types')
    , log = require('ee-log');

module.exports = new Class({

      stream: null
    , _pos: 0

    , current: {
        get: function(){
            return this.stream[this.position];
        }
    }

    , next: {
        get: function(){
            this._pos++;
            return this.current;
        }
    }

    , position: {
        get: function(){
            return this._pos;
        }
    }

    , length: {
        get: function(){
            return this.stream.length;
        }
    }

    , indexOf: function(char){
        return this.stream.indexOf(char);
    }

    , init: function(string, position){
        this.stream = string.toString();
        this._pos   = position || 0;
    }

    , hasNext: function() {
        return this.position < this.stream.length - 1;
    }

    , skip: function(n){
        n = n || 1;
        this._pos += n;
    }

    , peek: function(k) {
        if(!k){
            return this.current;
        }
        return this._slice(this.position, this.position + k);
    }

    , _slice: function(from, to) {
        return this.stream.slice(from, to);
    }

    , currentIs: function(character){
        return this.current === character;
    }

    , toString: function(){
        return this.stream;
    }
});