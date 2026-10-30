<!-- The Docs section's links: its sidebar, and its page in the mobile drawer. -->
<script lang="ts">
	import NavLink from '#lib/components/NavLink.svelte';
	import { resolve } from '$app/paths';
</script>

<div class="flex w-full flex-col items-center rounded-sm">
	<h2 class="text-title-large text-on-surface-variant">Docs</h2>
</div>
<div class="h-0.5 w-full rounded-full surface-container"></div>
<NavLink label="Introduction" href={resolve('/docs/intro')} />
<NavLink label="Install" href={resolve('/docs/install')} />
<div class="h-0.5 w-full rounded-full surface-container"></div>
<NavLink label="Use" href={resolve('/docs/use')} />
<div class="h-0.5 w-full rounded-full surface-container"></div>
<NavLink label="Customize" href={resolve('/docs/customize')} />
<NavLink label="Configuration" href={resolve('/docs/config')} />
<div class="h-0.5 w-full rounded-full surface-container"></div>
<NavLink label="Colors" href={resolve('/docs/colors')} />
<NavLink label="Themes" href={resolve('/docs/themes')} />
<NavLink label="Typography" href={resolve('/docs/typography')} />
<NavLink label="Utilities" href={resolve('/docs/utilities')} />
<div class="h-0.5 w-full rounded-full surface-container"></div>
<NavLink label="FAQ" href={resolve('/docs/faq')} />
