<script lang="ts">
	import DocPage from '#lib/components/DocPage.svelte';
	import Example from '#lib/components/Example.svelte';
</script>

<DocPage title="Button" description="Filled, tonal, outlined and text buttons.">
	<p>
		Buttons trigger an action. Use a filled button for the primary action on a screen, and at most
		one of them.
	</p>

	<Example>
		<button class="button button-filled">Filled</button>
		<button class="button button-tonal">Tonal</button>
		<button class="button button-outlined">Outlined</button>
	</Example>

	<h2>Variants</h2>

	<table>
		<thead><tr><th>Variant</th><th>Use for</th></tr></thead>
		<tbody>
			<tr><td><code>filled</code></td><td>the single most important action on screen</td></tr>
			<tr><td><code>tonal</code></td><td>a secondary action of similar weight</td></tr>
			<tr><td><code>outlined</code></td><td>an action that should not draw the eye</td></tr>
			<tr><td><code>text</code></td><td>tertiary actions, and anything in a row</td></tr>
		</tbody>
	</table>
</DocPage>
