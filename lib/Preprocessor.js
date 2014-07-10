"use strict";

var Class = require('ee-class')
    , Types = require('ee-types')
    , log = require('ee-log')

    , Parser        = require('./Parser2')
    , ParseStream   = require('./ParseStream')
    , TokenStream   = require('./TokenStream')

    , visitors      = require('./visitors');

/**
 * todo: allow the injection of other rewriters
 * todo: add a cache
 */
module.exports = new Class({

      parser: null
    , cache: null
    , lexerPattern: /([)(:\\]|\?\:)/

    , init: function(){
        this.parser = new Parser();
    }

    , lex: function(str){
        return str.split(this.lexerPattern).filter(function(current){
            return current !== "";
        });
    }

    , preprocess: function(regexp){
        if(!Types.regexp(regexp)) return regexp;

        var   string = regexp.source
            , flags = this.getFlags(regexp);

        if(!this._hasGroups(string)){
            return this._extendWithoutGroups(regexp);
        }

        var parsed = this.parser.parse(new TokenStream(this.lex(string)));
        return this._toRegex(parsed, flags);
    }

    , getFlags: function(regexp){
        return    (regexp.global     ? 'g' : '')
                + (regexp.ignoreCase ? 'i' : '')
                + (regexp.multiline  ? 'm' : '')
                + (regexp.sticky     ? 'y' : ''); // experimental
    }

    , _hasGroups: function(regexp){
        return regexp.indexOf(this.parser.T_OPEN) !== -1;
    }

    , _extendWithoutGroups: function(regexp){
        return this._extend(regexp, []);
    }
    , _getIndex: function(groups){
        var index = {};
        for(var i=0; i < groups.length; i++){
            var group = groups[i];
            index[i+1] = i+1;
            if(group.named){
                index[group.name] = i+1;
            }
        }
        return index;
    }

    , _extend: function(regex, groups){
        var   exec = regex.exec.bind(regex)
            , index = this._getIndex(groups);
        // mark it as extended
        regex.extended = true;
        // hijack the exec method and modify the match
        regex.exec = function(str){
            var match = exec.call(null, str);
            if(match){
                match.group = function(id){
                    return match[index[id]];
                }.bind(match);
            }
            return match;
        };
        return regex;
    }

    , _toRegex: function(parsed, flags){
        var rewriter = new visitors.RewritingVisitor();
            rewriter.visit(parsed);

        var   groups = rewriter.groups
            , regex  = new RegExp(rewriter.toString(), flags);

        return this._extend(regex, groups);
    }
});