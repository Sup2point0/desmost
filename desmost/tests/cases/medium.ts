import { ltx } from "../shared";


// example from /docs/learn-x-in-y.md
export const MEDIUM = ltx `

/desmos{
  expressions: true,
  settingsMenu: false,
}
/viewport{left: -8, right: 8}

/text{
  Definite Integral Calculator
  v1.0
}

% Enter your integrand here:
/colour{ BLUE } :: f(x) =

% Enter your integration bounds here:
a = 0
b = 1

% Your answer is:
\int_{a}^{b} f(x) \ dx

/secret
/colour{ BLUE }
/no-line
/fill{ opacity: 0.2 }
  :: /latex{
    min(0, f(x))
    \leq y
    \leq max(0, f(x))
  }

`.trim();
