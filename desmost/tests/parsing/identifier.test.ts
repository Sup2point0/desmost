import { DesmostParser } from "../../src/parser";
import { GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS } from "../../src/magic";

import { ViewportIncantation } from "../../src/magic/global/viewport";
import { SliderIncantation } from "../../src/magic/local/slider";

import { ltx } from "../shared";


describe("try-parse-identifier()", () =>
{
	test.each([
		ltx `viewport`,
		ltx `viewport{}`,
		ltx `viewport{ left: -1, right: 1 }`,
	])
	("viewport", src =>
	{
		let parser = new DesmostParser(src);
		let incantation = parser.try_parse_identifier(GLOBAL_INCANTATIONS);
		assert.isTrue(incantation instanceof ViewportIncantation);
	})

	test.each([
		ltx `slider`,
		ltx `slider{}`,
		ltx `slider{ min: 0, max: 1 }`,
	])
	("hide", src =>
	{
		let parser = new DesmostParser(src);
		let incantation = parser.try_parse_identifier(LOCAL_INCANTATIONS);
		assert.isTrue(incantation instanceof SliderIncantation);
	})
})
