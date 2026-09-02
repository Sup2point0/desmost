import util from "node:util";


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

export function assert_has_errors(desmos: Desmos.Calculator)
{
	for (let expr of desmos.getExpressions()) {
		if (expr.type === "text" && expr.text?.startsWith("[DESMOST ERROR]")) {
			return;
		}
	}

	throw new Error(
		`Expected an invalid program to have errors, but none were found!\n\n.getExpressions(): ${util.inspect(desmos.getExpressions())}`,
	);
}
