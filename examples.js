var log = require('ee-log');

var   Preprocessor  = require('./lib/Preprocessor');

var regex     = /u(n)im(:nested:\d+(:supernested:(\w))\.json)\/(?:\d+)remainder/;

var proc        = new Preprocessor();
var extended    = proc.preprocess(regex);
var match       = extended.exec('unim10w.json/42remainder');

log(extended);
log(match);
log(match.group('nested'));
log(match.group(2));
log(match[2]);

var simple = proc.preprocess(/(:testgroup:\d+(:lastdigit:\d))/);

log(simple);
log(simple.replace('100', 'The last digit of the number is $:lastdigit:'));