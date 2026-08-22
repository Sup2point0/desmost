# Compiler

This module implements the top-level logic of the Desmost -> Desmos compiler.

The compiler is lazy, parsing and evaluating one block at a time (instead of constructing the entire AST and then evaluating).
