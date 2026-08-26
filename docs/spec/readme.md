# Grammar Specification

Desmost is a tiny DSL, so we’ll keep this short and sweet!


## Overview

Desmost works in blocks. A block may contain one of the following:

- 1 line of plain LaTeX
- 1 expression incantation
- 1+ local incantations, followed by `::` and one of the above
- 1 global incantation
- Line break

Each block must start on a new line to a preceding block (if any).


## Parsing Expression Grammar

Desmost is whitespace-insensitive, but *newline*-sensitive.

```hs
Program := (Body)?

Body    := (Block) (NEWLINE Block)*

Block   := ""
         | Expression
         | (LocalIncantation (NEWLINE)*)+ "::" (NEWLINE)* Expression
         | GlobalIncantation

Expression := <latex>
            | ExpressionIncantation

LocalIncantation      := "/" <local-identifier>  (Arg)?
GlobalIncantation     := "/" <global-identifier> (Arg)?
ExpressionIncantation := "/" <expr-identifier>    Arg

Arg   := "{" Value "}"
Value := <js-fields> | <string> | ...
```
