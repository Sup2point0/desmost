# Grammar Specification

Desmost is a tiny DSL, so we’ll keep this short and sweet!


## Overview

Desmost works in blocks. A block may contain one of the following:

- 1 line of plain LaTeX
- Multi-line LaTeX starting with `/block{` and ending with `}`
- 1+ local incantations, followed by "::", then 1 of the 2 above
- 1 global incantation
- Empty

Each block must start on a new line to a preceding block (if any).


## Parsing Expression Grammar

```hs
Program := (Body)?

Body    := (Block) (NEWLINE Block)*

Block   := <BLANK LINE>
         | Latex
         | (LocalIncantation Blank)+ "::" Blank Latex
         | GlobalIncantation

LocalIncantation  := "/" <local-identifier> (Data)?
GlobalIncantation := "/" <global-identifier> (Data)?

Data  := "{" js-fields "}"
       | "{" NEWLINE js-fields NEWLINE "}"

Latex := latex
       | "/Block{" latex NEWLINE "}"

Blank := (SPACE | NEWLINE)+
```
