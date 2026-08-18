# Desmost

[**Docs**](https://github.com/Sup2point0/desmost/tree/main/docs) &ensp;·&ensp; [**Changelog**](https://github.com/Sup2point0/desmost/blob/main/CHANGELOG.md) &ensp;·&ensp; [**Playground**](https://sup2point0.github.io/desmost)

A tiny DSL for compiling LaTeX to Desmos.

<!-- You write this:

```hs
/viewport{ left: -5, right: 5 }
% Drag the slider!

A = 1
y = A \sin(x - t)

/label{ text: "we love Desmos(t)!" } :: (0, 2)

/anim /slider{ min: -1, max: 1 }
  :: t = 0
```

And Desmost gives you this: -->


## Requirements

- Desmos API v1.12
- Desmost only works **in the browser**, because the Desmos API can only be included via a `<script>` tag
