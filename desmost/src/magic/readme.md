# Incantations

This module implements how incantations are represented, and the individual logic for every incantation in Desmost.

Each incantation is defined in its own file as a class deriving from `ArgIncantation` or `Incantation`. They can then implement whatever logic they require for `apply()` and `evaluate_arg()`.
