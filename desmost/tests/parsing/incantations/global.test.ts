import { DesmostParser } from "../../../src/parser"
import { INVALID_PARSE } from "../../../src/parser/errors";

import { GLOBAL_INCANTATIONS } from "../../../src/magic";

import { is_invoc } from "../shared";


describe("/desmos", () =>
{
	test("no arg", () => {
		let parser = new DesmostParser(`/desmos`);
		let r = parser.parse_incantation();
		
		is_invoc(r);
		assert.deepEqual(r.incantation, GLOBAL_INCANTATIONS.desmos);
		assert.isUndefined(r.arg_raw);
	})
	
	test("with arg", () => {
		let parser = new DesmostParser(`/desmos{ keypad: false, expressionsCollapsed: true }`);
		let r = parser.parse_incantation();
		
		is_invoc(r);
		assert.deepEqual(r.incantation, GLOBAL_INCANTATIONS.desmos);
		assert.equal(r.arg_raw, "keypad: false, expressionsCollapsed: true");
	})
})

describe("/viewport", () =>
{
	test("no arg", () => {
		let parser = new DesmostParser(`/viewport`);
		let r = parser.parse_incantation();

		assert.equal(r, INVALID_PARSE);
	})
	
	test("with arg", () => {
		let parser = new DesmostParser(`/viewport{left: -1, right: 1}`);
		let r = parser.parse_incantation();

		is_invoc(r);
		assert.deepEqual(r.incantation, GLOBAL_INCANTATIONS.viewport);
		assert.equal(r.arg_raw, "left: -1, right: 1");
	})
})
