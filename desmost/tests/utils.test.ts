import * as utils from "../src/utils";


describe("zipping", () =>
{
	test.each([
		{ l: [], r: [], expected: [] },
	])
	("empty", ({ l, r, expected}) => {
		assert.deepEqual(utils.zipping(l, r).toArray(), expected);
	});

	test.each([
		{ l: [0], r: [1], expected: [[0, 1]] },
		{ l: [1, 2, 3], r: [4, 5, 6], expected: [[1, 4], [2, 5], [3, 6]] },
	])
	("usual", ({ l, r, expected}) => {
		assert.deepEqual(utils.zipping(l, r).toArray(), expected);
	});

	test.each([
		{ l: [], r: [1], expected: [] },
		{ l: [0], r: [], expected: [] },
		{ l: [0], r: [1, 2], expected: [[0, 1]] },
	])
	("mismatched", ({ l, r, expected}) => {
		assert.deepEqual(utils.zipping(l, r).toArray(), expected);
	});
});
