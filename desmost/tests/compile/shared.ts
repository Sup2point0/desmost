export function assert_no_errors(desmos: Desmos.Calculator)
{
  for (let expr of desmos.getExpressions()) {
    if (expr.type !== "text") continue;

    assert.notInclude(
      expr.text,
      "[DESMOST ERROR]",
      `\n\n${expr.text}\n\n`
    );
  }
}
