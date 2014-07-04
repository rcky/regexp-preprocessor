var   assert        = require('assert')

    , ParseStream   = require('../lib/ParseStream');

describe('The Parse Stream', function(){

    var   stream    = new ParseStream('A testing parse stream.')
        , atEnd     = new ParseStream('Halo', 3)
        , numeric   = new ParseStream(0);

    describe('init', function(){
        it('should by default start at position 0', function(){
            assert.equal(0, stream.position);
        });

        it('or at the specified one', function(){
            assert.equal(3, atEnd.position);
        });

        it('should expose the passed string as stream', function(){
            assert.equal('A testing parse stream.', stream.stream);
        });

        it('should properly expose the current char', function(){
            assert.equal('A', stream.current);
        });
    });

    describe('next', function(){
        it('next should return the next character and increase the position', function(){
            assert.equal(' ', stream.next);
            assert.equal(1, stream.position);

            assert.equal('t', stream.next);
            assert.equal(2, stream.position);
        });

        it('and current should reflect that properly', function(){
            assert.equal('t', stream.current);
        });
    });

    describe('skip', function(){
        it('should increase the position by 1 if no parameter is passed', function(){
            stream.skip();
            assert.equal(3, stream.position);
        });
        it('should increase the position by n otherwise', function(){
            stream.skip(2);
            assert.equal(5, stream.position);
        });
    });

    describe('hasNext', function(){

        it('should return true if the stream has more characters', function(){
            assert(stream.hasNext());
        });

        it('and false otherwise', function(){
            assert(!atEnd.hasNext());
        });

    });

    describe('peek', function(){

        it('should return the current character if no parameters are passed', function(){
            assert.equal('t', stream.peek());
        });

        it('should return the following substring if length is specified', function(){
            assert.equal('tin', stream.peek(3));
        });


        it('it should return the rest of the string if length is too big', function(){
            assert.equal('ting parse stream.', stream.peek(100));
        });

        it('should not modify the position', function(){
            assert.equal(5, stream.position);
        });

    });

    describe('currentIs', function(){
        it('should return true if the current character matches the passed one', function(){
            assert(stream.currentIs('t'));
        });
        it('should return false otherwise', function(){
            assert(!stream.currentIs('i'));
        });
        it('should compare strictly', function(){
            assert(!numeric.currentIs(0));
        });
    });
});