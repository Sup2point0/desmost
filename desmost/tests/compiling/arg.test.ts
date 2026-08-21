import { compile } from "../../src";

import { ColourIncantation } from "../../src/magic/local/colour";

import { testing_desmos } from "../shared";
import { assert_no_errors } from "./shared";


function compiles(src: string)
{
	let desmos = testing_desmos();
	compile(desmos, src);
	assert_no_errors(desmos);
}


describe("enum literals", () =>
{
	test.each([
		`/colour{ BLUE } :: y = x`,
		`/colour{ blue } :: y = x`,
		`/colour{ Blue } :: y = x`,
	])
	("unkeyed", compiles);

	test.each([
		`/point{ style: DOTTED } :: (0, 0)`,
		`/point{ style: dotted } :: (0, 0)`,
		`/point{ style: Dotted } :: (0, 0)`,
	])
	("basic", compiles);

	test.each([
		`/line{ style: DOTTED, style: DASHED } :: y = x`,
		`/point{ pos: RIGHT, text: "Test" } :: (0, 0)`,
		`/point{ text: "Test", pos: RIGHT } :: (0, 0)`,
	])
	("with commas", compiles);

	test.each([
		`/line{ style: DOTTED } /point{ pos: RIGHT, text: "Test" } :: f(x)`,
		`/line{ style: DOTTED } /point{ text: "Test", pos: RIGHT } :: f(x)`,
	])
	("many incantations with commas", compiles);

	test.each([
		`/desmos{ expressions: true }`,
		`/desmos{ expressions: false }`,
	])
	("ignores booleans", compiles);
	
	test.each([
		`/colour{ UNKNOWN } :: y = x`,
		`/line{ value: UNKNOWN } :: y = x`,
	])
	("bad", src => {
		assert.throws(() => {
			new ColourIncantation().evaluate_arg(src)
		});
	})
})
