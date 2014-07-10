var   assert          = require('assert')
    , Parser        = require('../lib/Parser2')
    , ParseStream   = require('../lib/ParseStream');

/**
 * These tests are not considered to be complete, but at least
 * they provide a certain insight and security.
 */
describe('The Parser', function(){
    var parser = new Parser();

    describe('parseGroupPrefix', function(){
        var   prefixWithGroup       = new ParseStream('can be anything that ends with a (')
            , prefixWithoutGroups   = new ParseStream('can be anything else')
            , resultWG              = parser.parseGroupPrefix(prefixWithGroup)
            , resultWOG             = parser.parseGroupPrefix(prefixWithoutGroups);

        it('should be able to parse a group prefix without following group', function(){
            assert.equal(resultWOG.content, 'can be anything else');
        });

        it('should be able to parse a group prefix with following group', function(){
            assert.equal(resultWG.content, 'can be anything that ends with a ');
        });
        it('should stop at the group delimiter', function(){
            assert.equal(prefixWithGroup.current, parser.T_OPEN);
        });
    });

    describe('skipWater', function(){
        var   water = new ParseStream("A woman is like a tea bag - you can't tell how strong she is until you put her in hot water.");

        it('collects the stream content up to the specified token', function(){
            var result = parser.skipWater(water, '-');
            assert.equal(result.content, "A woman is like a tea bag ");
            assert.equal(water.current, '-');
        });

        it('stops at the first occurring token', function(){
            var result = parser.skipWater(water, 'l', "'");
            assert.equal(result.content, '- you can');
            assert.equal(water.current, "'");
        });
    });


    describe('parse group', function(){
        it('should be able to parse a simple group', function(){
            var   stream = new ParseStream('(group)')
                , result = parser.parseGroup(stream);

            assert(result.content.length == 1);
            assert.equal('group', result.content[0].content);
        });

        it('should be able to parse a named group', function(){
            var   stream = new ParseStream('(:thename:group)')
                , result = parser.parseGroup(stream);

            assert(result.content.length == 1);
            assert.equal('group', result.content[0].content);
            assert(result.named);
            assert.equal('thename', result.name);
            assert(!stream.hasNext());
        });

        it('should be able to parse nested groups 1', function(){
            var   stream = new ParseStream('(:thename:group(\w+))')
                , result = parser.parseGroup(stream);

            assert(result.content.length == 2);
            assert.equal('w+', result.content[1].content[0].content);
            assert(result.content[1].named === false);
        });

        it('should be able to parse nested groups 2', function(){
            var   stream = new ParseStream('(group(:suffix:\w+)(\d)))')
                , result = parser.parseGroup(stream);

            var     nestedGroup1 = result.content[1]
                ,   nestedGroup2 = result.content[3];

            assert.equal(nestedGroup1.name, 'suffix');
            assert.equal(nestedGroup1.content[0].content, '\w+');
            assert(nestedGroup2.named === false);
            assert.equal(nestedGroup2.content[0].content, '\d');
        });

        it('should respect non capturing groups', function(){
            var   stream = new ParseStream('(?:nonCap)')
                , result = parser.parseGroup(stream);

            assert(result.capture === false);
        });

        it('should respect not inherit capturing', function(){
            var   stream = new ParseStream('(?:nonCap (cap))')
                , result = parser.parseGroup(stream);

            assert(result.capture === false);
            assert(result.content[1].capture === true);
        });
    });

    describe('parse', function(){
        it('should be able to recursively parse complex groups', function(){
            var   stream = new ParseStream(/unim(:nested: \d+(:supernested: (\w))\.json)\/(?:\d+)remainder/)
                , result = parser.parse(stream);

            assert(result[1].named === true);
            assert.equal('remainder/', result[4].content);
        });
    });
});