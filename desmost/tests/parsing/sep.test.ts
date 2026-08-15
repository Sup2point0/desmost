import { DesmostParser } from "../../src/parser";


describe("parse-sep", () =>
{
  test.for([
    ` :: `,
    `:: `,
    ` ::`,
    `::`,
  ])("easy", src => {
    let parser = new DesmostParser(src);

    parser.parse_sep();
    let r = parser.parse_next();
    assert.isNull(r);
  })

  test.for([
    ` ::\n  `,
    ` ::\n`,
    ` :: \n`,
    `:: \n`,
    `::\n`,
  ])("medium", src => {
    let parser = new DesmostParser(src);
    
    parser.parse_sep();
    let r = parser.parse_next();
    assert.isNull(r);
  })
})
