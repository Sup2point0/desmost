<!-- @component `<DesmostOptions>`

The dropdown panel for configuring compile options.
-->

<script lang="ts">

import { DEFAULT_OPTIONS } from "desmost/internal";

import { options } from "#scripts/options";

</script>


<header>
	<h2> Compile Options </h2>
</header>

<form>
	<section>
		<input type="checkbox" style:visibility="hidden" />

		<label for="errors">
			<h3> Error Handling </h3>
			<p> How should errors be handled? </p>
		</label>
		
		<select id="errors" bind:value={$options.errors}>
			<option value="surface">Surface</option>
			<option value="crash">Crash</option>
			<option value="suppress">Suppress</option>
		</select>
	</section>
	
	<section>
		<input type="checkbox" style:visibility="hidden" />

		<label for="place-errors">
			<h3> Error Placement </h3>
			<p> Where should errors be placed? </p>
		</label>
		
		<select id="place-errors" bind:value={$options.place_errors}>
			<option value="inline">Inline</option>
			<option value="end">End</option>
			<option value="start">Start</option>
		</select>
	</section>

	<section>
		<input id="expand-errors" type="checkbox" bind:checked={$options.expand_errors} />

		<label for="expand-errors">
			<h3> Expand Errors </h3>
			<p> Show all details for errors? </p>
		</label>
	</section>
	
	<section>
		<input id="check-args" type="checkbox" bind:checked={$options.check_args} />

		<label for="check-args">
			<h3> Check Arguments </h3>
			<p> Error when an incantation receives unknown fields or an empty argument? </p>
		</label>
	</section>

	<section>
		<input id="prettify" type="checkbox" bind:checked={$options.prettify} />

		<label for="prettify">
			<h3> Prettify </h3>
			<p> Prettify LaTeX output for Desmos? </p>
		</label>
	</section>

	<section>
		<input id="dedent" type="checkbox" bind:checked={$options.dedent_text} />

		<label for="dedent">
			<h3> Dedent Text </h3>
			<p> Remove common indentation from <code>/text</code> content? </p>
		</label>
	</section>
	
	<section>
		<input id="ignore-comments" type="checkbox" bind:checked={$options.ignore_comments} />

		<label for="ignore-comments">
			<h3> Ignore Comments </h3>
			<p> Ignore <code>%</code> LaTeX comments instead of turning them into notes? </p>
		</label>
	</section>
	
	<section>
		<input id="ignore-all-blanks" type="checkbox" bind:checked={$options.ignore_all_blanks} />

		<label for="ignore-all-blanks">
			<h3> Ignore All Blanks </h3>
			<p> Ignore all blank lines, instead of keeping them as blank expressions? </p>
		</label>
	</section>
	
	<section>
		<input id="keep-leading-blanks" type="checkbox" bind:checked={$options.keep_leading_blanks} />

		<label for="keep-leading-blanks">
			<h3> Keep Leading Blanks </h3>
			<p> Keep blank lines at the start of the source as empty expressions? </p>
		</label>
	</section>
	
	<section>
		<input id="keep-trailing-blanks" type="checkbox" bind:checked={$options.keep_trailing_blanks} />

		<label for="keep-trailing-blanks">
			<h3> Keep Trailing Blanks </h3>
			<p> Keep blank lines at the end of the source as empty expressions? </p>
		</label>
	</section>

	<button onclick={() => { $options = { ...DEFAULT_OPTIONS }; }}>
		Reset to Defaults
	</button>
</form>


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


form {
	flex: 1;
	max-height: max-content;
	padding: 0.5rem 1rem;
	z-index: 2;
	overflow-y: auto;
	scrollbar-width: thin;
}

section {
	margin-bottom: 1rem;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: 1rem;

	h3 {
		margin-bottom: 0.2rem;
		@include font-ui;
		color: light-dark(black, white);
		font-size: 100%;
		font-weight: normal;
	}

	p {
		@include font-ui;
		color: light-dark(
			rgb(black, 40%),
			rgb(white, 50%)
		);
		font-size: 90%;
	}

	&:hover p {
		color: black;
	}
}

select {
	height: max-content;
	padding: 0.1em 0.2em;
	@include font-ui;
	font-size: 100%;
	outline: none;
}


button {
	padding: 0.25rem 0.5rem;
	margin-bottom: 1rem;
	@include font-ui;
	color: white;
	font-size: 100%;
	background: $col-blue;
	border: none;
	outline: none;

	&:hover {
		cursor: pointer;
		background: color-mix(in oklch, 90% $col-blue, 10% black);
	}
}

</style>
