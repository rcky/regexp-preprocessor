var   assert         = require('assert')
    , Types         = require('ee-types')
    , log           = require('ee-log')
    , Preprocessor   = require('../lib/Preprocessor');

describe('The Preprocessor', function(){

    var   proc = new Preprocessor()
        , regex = /\/\w+\/(files)\/(\w+)\/(:filename:\w+(\d)\.(:fileextension:\w+))/i

        , withoutGroups     = proc.preprocess(/halo/)
        , extended          = proc.preprocess(regex)
        , match             = extended.exec('/root/FILES/somewhere/Readme1.md')
        , match2            = withoutGroups.exec('halo');

    it('should preserve flags', function(){
        assert(match !== null);
        assert.equal('FILES', match[1]);
    });

    it('should mark it as extended', function(){
        assert(extended.extended);
    });

    it('should modify the exec method to return an appropriate match object', function(){
        assert(Types.function(match['group']));
    });

    it('should allow the match to access the groups by name', function(){
        assert.equal(match.group('filename'), 'Readme1.md');
        assert.equal(match.group('fileextension'), 'md');
    });

    it('should allow the match to access the groups numerically', function(){
        assert.equal(match.group(3), 'Readme1.md');
        assert.equal(match.group(4), '1');
    });

    it('adds a replace method to the regex', function(){
        assert(Types.function(extended.replace));
    });

    it('which allows to replace with named groups', function(){
        var replaced = extended.replace('/root/files/somewhere/index1.js', 'File base: $:filename:/$:fileextension:');
        assert.equal('File base: index1.js/js', replaced);
    });

});
