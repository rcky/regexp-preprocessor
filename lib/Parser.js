"use strict";

var   Class       = require('ee-class')
    , log         = require('ee-log')
    , Types     = require('ee-types')

  , nodes       = require('./nodes')
  , TokenStream = require('./TokenStream');


/**
 * A simple stateless island parser that extracts groups from a string and creates an intermediate representation.
 *
 * The fact that it is stateless makes it reusable in concurrent/asynchronous contexts. Further, the parser never fails.
 *
 * T_WATER
 * T_OPEN
 * T_CLOSE
 * T_COLON
 * T_NON_CAPTURE
 * T_ESCAPE
 *
 * start ->         water
 * group ->         T_OPEN group_start start T_CLOSE
 * group_start ->   T_COLON T_WATER T_COLON
 *                  | T_NON_CAPTURE
 *                  | e
 * water -> T_WATER water
 *          | T_ESCAPE .
 *          | e
 */

var Parser = module.exports = new Class({

      T_OPEN:       '('
    , T_CLOSE:      ')'
    , T_COLON:      ':'
    , T_NON_CAPTURE: '?:'
    , T_ESCAPE:     '\\'
    , LEXER_PATTERN: /([)(:\\]|\?\:)/

    /**
     * (water | group)*
     */
    , parse: function(stream){
        if(Types.string(stream)) stream = TokenStream.lex(stream, this.LEXER_PATTERN);

        var result = [];

        while(!stream.atEnd()){
            switch(stream.current){
                case this.T_CLOSE:  // end of group
                    return result;
                case this.T_OPEN:   // beginning of group
                    result.push(this.group(stream));
                    break;
                default:
                    result = result.concat(this.water(stream));
            }
        }
        return result;
    }
    /**
     * ((T_ESCAPE T_WATER) | T_WATER)
     */
    , water: function(stream){
        var result = [];
        switch(stream.current){
            case this.T_ESCAPE:
                result.push(new nodes.WaterNode(stream.consume()));
            default:
                result.push(new nodes.WaterNode(stream.consume()));
        }
        return result;
    }

    , groupStart: function(stream){
        var group = new nodes.GroupNode();
        switch(stream.current){
            case this.T_COLON:
                if(stream.lookahead(3) === this.T_COLON){
                    group.named = true;
                    group.name = stream.next;
                    stream.consume();
                    stream.consume();
                }
                return group;
            case this.T_NON_CAPTURE:
                group.capture = false;
                stream.consume();
            default:
                return group;
        }
    }

    , group: function(stream){
        // opening bracket
        // this.match('(')
        stream.consume();

        var   group     = this.groupStart(stream)
            , content   = this.parse(stream);

        //this.match(')');
        stream.consume();

        return group.add(content);
    }
});