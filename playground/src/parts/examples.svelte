<!-- @component `<DesmostExamples>`

The side view for browsing examples.
-->

<script lang="ts">

import dedent from "dedent";

const ltx = x => dedent(String.raw(x))


const EXAMPLES =
{
	welcome: ltx `
		% Welcome to Desmost!
		f(x) = x^2
	`,

	colours: ltx `
		/colour{RED}    :: 0 < y < 1
		/colour{ORANGE} :: 1 < y < 2
		/colour{GREEN}  :: 2 < y < 3
		/colour{BLUE}   :: 3 < y < 4
		/colour{PURPLE} :: 4 < y < 5
	`,

	labels: ltx `
		y = x^3 - 3x^2

		/label{text: "This is a local maximum", pos: ABOVE_LEFT} :: (0, 0)
		/label{text: "This is also the origin", pos: BELOW_LEFT} :: (0, 0)
		/label{text: "This is a local minimum", pos: BELOW_RIGHT} :: (2, -4)
	`,

	// from Awxynth
	waveform: ltx `
		/dark
		/viewport{bottom: -2, top: 2}

		/hide :: f(x) = \sum_{n=1}^{4}\frac{1}{n}\sin(n^{2}x)

		/colour{ BLUE } /no-line :: \min(0, f(x-3t)) <  y < \max(0, f(x-3t))\ \{ 0 < x \}
		/line{ opacity: 0.2 } :: y = f(x-3t) \{ x < 0 \}
		/colour{ BLUE } :: y = f(x-3t) \{ x > 0 \}
		/point{ size: 16 } :: (0, f(0-3t))

		t = \{ t_2 < 0: 2\pi - t_1, t_1 \}
		/anim /slider{min: 0,       max: "\\pi"} :: t_1 = 0
		/anim /slider{min: "-\\pi", max: "\\pi"} :: t_2 = 0
	`,
};


interface Props {
	source: string
}

let { source = $bindable(EXAMPLES.welcome) }: Props = $props();

</script>


<header>
	<h2> Examples </h2>
</header>

<ul>
	{#each Object.entries(EXAMPLES) as [title, src]}
		<li>
			<button onclick={() => { source = src; }}>
				<h3> {title} </h3>
			</button>
		</li>
	{/each}
</ul>


<style lang="scss">

header {
	padding: 0.5rem 1rem;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	position: sticky;
	top: 0;

	h2 {
		@include font-code;
		color: light-dark(
			rgb(black, 50%),
			rgb(white, 50%),
		);
		font-size: 80%;
		font-weight: normal;
	}
}

ul {
	padding-bottom: 0.5rem;
	list-style: none;
	overflow-y: auto;
	scrollbar-width: thin;

	button {
		width: 100%;
		padding: 0.25rem 1rem;
		@include font-ui;
		color: light-dark(
			$col-blue,
			rgb(white, 80%)
		);
		font-weight: normal;
		text-align: left;
		background: none;
		border: none;
		outline: none;

		&:hover {
			cursor: pointer;
			background: light-dark(
				rgb(black, 4%),
				rgb(white, 5%)
			);
		}
	}
}

</style>
