var log = require('ee-log');

var   Parser        = require('./lib/Parser')
    , ParseStream   = require('./lib/ParseStream')
    , visitors      = require('./lib/visitors');

var   p         = new Parser()
    , regex     = /unim(:nested: \d+(:supernested: (\w))\.json)\/(?:\d+)remainder/
    , stream    = new ParseStream(regex)
    , parse     = p.parse(stream)
    , visitor   = new visitors.PrettyPrintingVisitor();

visitor.visit(parse);
log(visitor.toString());