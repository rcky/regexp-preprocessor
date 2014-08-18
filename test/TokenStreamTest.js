var   assert        = require('assert')

    , TokenStream   = require('../lib/TokenStream');

describe('The TokenStream', function(){

    var   stream    = new TokenStream('A testing parse stream my friend.'.split(' '))
        , atEnd     = new TokenStream(['Halo'])
        , numeric   = new TokenStream([0]);

    describe('init', function(){
        it('should by default start at position 0', function(){
            assert.equal(0, stream.position);
        });

        it('should properly expose the current token', function(){
            assert.equal('A', stream.current);
        });

        it('should not be at the end', function(){
            assert(!stream.atEnd());
        });
    });

    describe('next', function(){
        it('next should return the next character and increase the position', function(){
            assert.equal('testing', stream.next);
            assert.equal(1, stream.position);

            assert.equal('parse', stream.next);
            assert.equal(2, stream.position);
        });

        it('and current should reflect that properly', function(){
            assert.equal('parse', stream.current);
        });
    });

    describe('lookahead(k)', function(){
        it('should return the current token if no parameter is passed', function(){
            assert.equal('parse', stream.lookahead());
        });

        it('should return the current token if 0 or 1 is passed', function(){
            assert.equal('parse', stream.lookahead(0));
            assert.equal('parse', stream.lookahead(1));
        });

        it('should return the tokens k steps ahead without modifying the internal position', function(){
            assert.equal('friend.', stream.lookahead(4));
            assert.equal(2, stream.position);
        });
    });

    describe('currentIs', function(){

        it('should return true if the current item equals the passed', function(){
            assert(stream.currentIs('parse'));
        });

        it('and false if not', function(){
            assert(!stream.currentIs('friend.'));
        });

        it('compares strictly', function(){
            assert(!numeric.currentIs('0'));
        });

    });

    describe('consume', function(){

        it('returns the current element', function(){
            assert.equal('parse', stream.consume());
        });

        it('increases the internal pointer', function(){
            assert.equal(3, stream.position);
            assert.equal('stream', stream.current);
        });

    });

});