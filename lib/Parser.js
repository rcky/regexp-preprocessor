"use strict";

var Class   = require('ee-class')
  , log     = require('ee-log')
  , nodes   = require('./nodes');


/**
 * A simple stateless island parser that extracts groups from a string and creates an intermediate representation.
 *
 * The fact that it is stateless makes it reusable in concurrent/asynchronous contexts. Further, the parser never fails.
 */

module.exports = new Class({

      T_OPEN:           '('
    , T_CLOSE:          ')'
    , T_ESCAPE:         '\\'
    , T_CAPTURE_NOT:    '?:'
    , T_NAMED_GROUP_DELIMITER: ':'

    /**
     * Recursively parses a group prefix (water) followed by an optional group.
     * @param stream ParseStream
     */
    , parse: function(stream) {
        // parse anything before the first group
        var result = [this.parseGroupPrefix(stream)];
        // is the next token a group opening
        if(stream.currentIs(this.T_OPEN)){
            result.push(this.parseGroup(stream));
        }

        // there is more, parse and append it to the result
        if(stream.hasNext()){
            result = result.concat(this.parse(stream));
        }

        // else return what we have
        return result;
    }

    /**
     * Collects everything in front of a group
     * @param stream ParseStream
     */
    , parseGroupPrefix: function(stream) {
        return this.skipWater(stream, this.T_OPEN);
    }

    /**
     * Parses a Group
     * @param stream ParseStream
     */
    , parseGroup: function(stream) {

        // skip the opening bracket
        stream.skip();

        // do a lookahead to get information about the capturing and the naming
        var   lookahead = stream.peek(2)
            , groupNode = new nodes.GroupNode();

        // non capturing group
        if(lookahead === this.T_CAPTURE_NOT) {
            groupNode.capture = false;
            stream.skip(2);
        } // possibly named group
        else if(lookahead[0] === this.T_NAMED_GROUP_DELIMITER) {

            // skip the colon
            stream.skip();

            // try to parse up to another colon -> named group
            var name = this.skipWater(stream, this.T_NAMED_GROUP_DELIMITER, this.T_OPEN, this.T_CLOSE);

            // no group delimiter but the end or the beginning of another group
            if(stream.currentIs(this.T_OPEN) || stream.currentIs(this.T_CLOSE)){
                // we dont want to backtrack, we just keep the result
                groupNode.add(name);
            } // found a group delimiter
            else if(stream.currentIs(this.T_NAMED_GROUP_DELIMITER)){
                groupNode.named = true;
                groupNode.name = name.content;

                // skip the colon
                stream.skip();
            }
        }
        // add everything that was parsed inside to the group node
        return groupNode.add(this.parseGroupContent(stream));
    }

    , parseGroupContent: function(stream){

        var   prefix    = this.skipWater(stream, this.T_OPEN, this.T_CLOSE)
            , content = [];

        content.push(prefix);

        // end of group skip closing bracket
        if(stream.currentIs(this.T_CLOSE)){
            stream.skip();
            return content;
        }

        // start of a new group, parse it and add it to the content
        if(stream.currentIs(this.T_OPEN)){
            content.push(this.parseGroup(stream));
        }

        // parse the rest of the content (after a nested group)
        if(stream.hasNext()){
            content = content.concat(this.parseGroupContent(stream));
        }

        return content;
    }

    , skipWater: function(stream) {
        var   water = ''
            , tokens = Array.prototype.slice.call(arguments, 1)
            , current = stream.current;

        while(current){
            switch(current){
                case this.T_ESCAPE:
                    water += current;
                    water += stream.next;
                    break;
                default:
                    if(tokens.length > 0 && tokens.indexOf(current) !== -1) return new nodes.WaterNode(water);
                    water += current;
            }
            current = stream.next;
        }
        return new nodes.WaterNode(water);
    }
});