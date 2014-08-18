var   assert            = require('assert')

    , log               = require('ee-log')

    , Parser            = require('../lib/Parser')
    , TokenStream       = require('../lib/TokenStream');

/**
 * These tests are not considered to be complete, but at least
 * they provide a certain insight and security.
 */
describe('The Parser', function(){

    var parser          = new Parser();

    describe('parse', function(){

        it('works with strings (by converting them) and token streams.', function(){
            parser.parse('halo');
            parser.parse(new TokenStream(['halo']));
        });

        it('parses also expressions without groups (water)', function(){
            var result = parser.parse('some\d+without groups');
            assert.equal(result.length, 1);
            assert.equal(result[0].content, 'some\d+without groups');
        });

        it('also captures groups without names', function(){
            var str = 'some (\w+) words';
            var result = parser.parse(str);
            assert.equal(result.length, 3);
        });

        it('collects groups with names', function(){
            var str = 'some (:adjective:\w+) words';
            var result = parser.parse(str);
            assert.equal(result.length, 3);
            assert(result[1].named === true);
            assert.equal(result[1].name, 'adjective');
        });

        it('collects mixed groups', function(){
            var str = 'ali baba and the (\d+) (:gangster:\w+)';
            var result = parser.parse(str);

            // includes the whitespace between the groups
            assert.equal(result.length, 4);
            assert(!result[1].named);
            assert(result[3].named === true);
        });

        it('collects nested groups', function(){
            var str = 'ali baba and the ((:first:\d)\d*) (:gangster:\w*(:plural:s?)';
            var result = parser.parse(str);

            assert(result[1].content[0].named);
            assert.equal(result[1].content[0].name, 'first');
            assert(!result[1].content[1].named);

            assert(result[3].named);
            assert(!result[3].content[0].named);

            assert.equal(result[3].content[1].name, 'plural');
        });

        it('should respect non capturing groups', function(){
            var   str    = '(?:nonCap)'
                , result = parser.parse(str);

            assert(result[0].capture === false);
        });

        it('should respect but not inherit capturing', function(){
            var   str = '(?:nonCap (cap))'
                , result = parser.parse(str);

            assert(result[0].capture === false);
            assert(result[0].content[1].capture === true);
        });
    });

    it('should be able to recursively parse complex groups (for the records)', function(){
        var   str       = '/unim(:nested: \d+(:supernested: (\w))\.json)\/(?:\d+)remainder/'
            , result    = parser.parse(str);

        assert(result[1].named === true);
        assert.equal('remainder/', result[4].content);
    });
});