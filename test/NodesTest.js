var   assert  = require('assert')
    , nodes   = require('../lib/nodes');

var visitor = {

      waterNodeVisits: 0
    , groupNodeVisits: 0

    , visitWaterNode: function(){
        this.waterNodeVisits++;
    }

    , visitGroupNode: function(){
        this.groupNodeVisits++;
    }
};

describe('WaterNode', function(){

    var wn = new nodes.WaterNode('contentoo');

    it('should set the content', function(){
        assert.equal('contentoo', wn.content);
    });

    it('accept should call visitWaterNode', function(){
        wn.accept(visitor);
    });
});

describe('GroupNode', function(){

    var gn = new nodes.GroupNode();

    it('should have empty content', function(){
        assert(gn.content.length == 0);
    });

    it('should be capturing by default', function(){
        assert(gn.capture);
    });

    it('should not be named by default', function(){
        assert(!gn.named);
        assert(!gn.name);
    });

    it('accept should call visitGroupNode', function(){
        gn.accept(visitor);
        assert.equal(1, visitor.groupNodeVisits);
    });

    describe('add', function(){
        it('should push literal results', function(){
            gn.add('zero');
            assert.deepEqual(['zero'], gn.content);
        });
        it('should append arrays', function(){
            gn.add([1,2]);
            assert.deepEqual(['zero', 1,2], gn.content);

            gn.add([1,2]);
            assert.deepEqual(['zero', 1,2,1,2], gn.content);
        });
        it('should return itself', function(){
            assert(gn.add(true) === gn);
        });
    });
});
