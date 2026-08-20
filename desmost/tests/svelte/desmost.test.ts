// @vitest-environment jsdom

import { mount } from "svelte";

import Desmost from "../../svelte/desmost.svelte";


describe("<Desmost>", () =>
{
  test("mount", () => {
    let component = mount(Desmost, {
      target: document.body,
      // @ts-expect-error: testing
      props: {},
    });
  })
})
