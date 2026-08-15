import { ltx } from "../shared";


export const EASY = ltx `

f(0) = 0
f(1) = 1
f(n) = f(n-1) + f(n)

\frac{1}{10} \sum_{n=1}^{10} \frac{f(n+1)}{f(n)}

`.trim();
