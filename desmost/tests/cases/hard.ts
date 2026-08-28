import { ltx } from "../shared";


export const HARD = ltx `

/desmos
/viewport{left:-1,
  right: 1}

/text{
  This content
    is really weirdly formatted
}

/latex{
  \{ 0<x: 1, 0 \}
}

/label{ pos: LEFT, text: " } should not close the block", pos: RIGHT} :: (0, 0)

/dark

`;
