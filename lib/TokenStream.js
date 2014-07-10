"use strict";

var   Class = require('ee-class')
    , Types = require('ee-types')
    , log   = require('ee-log');
/**
 * Base class for a lexer.
 * EOF          -> undefined.
 *
 * current      -> 1 token lookahead
 * next         -> increases the position
 * atEnd        -> returns true if we have not consumed all tokens
 *
 * lookahead(k) -> returns the token k symbols ahead
 */
module.exports = new Class({

      tokens: null
    , _pos: 0

    , current: {
        get: function(){
            return this.tokens[this.position];
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

    , init: function(tokens){
        this.tokens = tokens || 0;
    }

    , atEnd: function() {
        // current is undefined
        return this.currentIs();
    }

    , lookahead: function(k) {
        return k ? this.tokens[this.position + k - 1] : this.tokens[this.position];
    }

    , currentIs: function(token){
        return this.current === token;
    }

    , consume: function(){
        var curr = this.current;
        this.next;
        return curr;
    }

});