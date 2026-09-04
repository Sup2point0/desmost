import { DesmostParser } from "../../../src/parser"
import { DesmostError } from "../../../src/errors";

import { GLOBAL_INCANTATIONS } from "../../../src/magic";
import { DesmosIncantation } from "../../../src/magic/global/desmos";
import { ViewportIncantation } from "../../../src/magic/global/viewport";

import { is_invoc } from "../shared";


describe("/desmos", () =>
{
	test("no arg", () => {
		let parser = new DesmostParser(`/desmos`);
		let r = parser.try_parse_incantation(GLOBAL_INCANTATIONS);
		
		is_invoc(r);
		assert.deepEqual(r.incantation, new DesmosIncantation());
		assert.isUndefined(r.arg_raw);
	})
	
	test("with arg", () => {
		let parser = new DesmostParser(`/desmos{ keypad: false, expressionsCollapsed: true }`);
		let r = parser.try_parse_incantation(GLOBAL_INCANTATIONS);
		
		is_invoc(r);
		assert.deepEqual(r.incantation, new DesmosIncantation());
		assert.equal(r.arg_raw, "keypad: false, expressionsCollapsed: true");
	})
})

describe("/viewport", () =>
{
	test("no arg", () => {
		let parser = new DesmostParser(`/viewport`);
		assert.throws(
			() => parser.try_parse_incantation(GLOBAL_INCANTATIONS),
			DesmostError.MissingInput,
		);
	})
	
	test("with arg", () => {
		let parser = new DesmostParser(`/viewport{ left: -1, right: 1 }`);
		let r = parser.try_parse_incantation(GLOBAL_INCANTATIONS);

		is_invoc(r);
		assert.deepEqual(r.incantation, new ViewportIncantation());
		assert.equal(r.arg_raw, "left: -1, right: 1");
	})
})
