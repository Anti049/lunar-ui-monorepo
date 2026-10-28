<script lang="ts">
	let { children } = $props();
</script>

<!--
	`not-prose` matters if you use @tailwindcss/typography on the wrapper:
	without it the plugin restyles your components' own type and they stop
	looking like themselves.
-->
<div class="not-prose rounded-box my-6 flex flex-wrap items-center gap-2 border p-6">
	{@render children()}
</div>
