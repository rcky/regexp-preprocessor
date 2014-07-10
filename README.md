regexp-preprocessor
===================

Preprocessor to create extended Javascript RegularExpressions.

Adds labelled capturing groups to your regexes.The implementation has the advantage that one can work with native RegExp objects at any time, since the proposed syntax does not contradict the native grammar. The preprocessor compiles your regular expression to an equivalent expression without any labels and returns an extended RegExp object (the basic interface does not change). To access the groups,the resulting match object is enhanced by a `group(id)` method, which also works for the numeric grouping.

#Caveats
  - The behavior of global matches (repeated matches) is untested/unknown.
  - The preprocessing has a high overhead.
  - Replacement using a named syntax is not yet supported.

##Installation

    npm install {name}

##Syntax
To add a named group to your regular expression, mark the group with a label embraced by colons `(:label:pattern)`.
Labelled and numeric indexed groups can be arbitrarily nested and combined. Consider the following examples:

    // e.g. /root/files/Readme.md
    /\/root\/files\/(:filename:\w+\.\w+)/

    // e.g. /root/files/Readme.md
    /\/root\/files\/(:filename:\w+\.(:fileextension:\w+))/

    // e.g. /somewhere/files/subfolder/Readme.md
    /\/(\w+)\/files\/(\w+)\/(:filename:\w+\.(:fileextension:\w+))/

    // e.g. /someRoot/files/subfolder/Readme10.md
    /\/(\w+)\/files\/(\w+)\/(:filename:\w+(\d)\.(:fileextension:\w+))/

##Usage
Instantiate the preprocessor and pass the Regexp which should be processed.

    var Preprocessor = require('{name}');

    var   proc = new Preprocessor()
        , extended = proc.preprocess(/regex(:type:\w+)/);

    var match = extended.exec('regexSuper');
    if(match){
        match.group('type'); // Super
        match.group(1);      // Super
        match[1];            // Super
    }

