<script lang="ts">
	// The playground's stylesheet. `src/routes/` is never published, so this
	// import exists only for `vite dev`.
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}
