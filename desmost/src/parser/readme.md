# Parser

This module implements the Desmost -> AST parser.


## Structure

The parser is split into `DesmostParser` and `GenericParser`.

`GenericParser` implements the skeleton common to any parser, while `DesmostParser` implements Desmost-specific logic. (Think of `GenericParser` as the library, while `DesmostParser` is the application).

The parser is stateful, tracking its current position in the source text with its `.i` field.


## Backtracking

The parser often backtracks. For instance, if the source code is `/unknown`, the parser will first check if it's a global incantation with `try_parse_global_incantation()`, scanning through `/desmos`, `/viewport`, etc. Since none match, it backtracks and returns `NO_MATCH`.

It then tries `try_parse_local_incantation()`, again backtracking because none match. Finally, it falls back to `parse_line()`, producing a LaTeX expression `/unknown`.

Methods that may backtrack start with `try_` and may return `NoMatch`.
