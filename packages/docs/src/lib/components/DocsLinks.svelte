<!-- The Docs section's links: its sidebar, and its page in the mobile drawer. -->
<script lang="ts">
	import NavLink from '#lib/components/NavLink.svelte';
	import { resolve } from '$app/paths';
</script>

<div class="flex w-full flex-col items-center rounded-sm">
	<h2 class="text-title-large text-on-surface-variant">Docs</h2>
</div>
<hr class="nav-divider" />
<NavLink label="Introduction" href={resolve('/docs/intro')} />
<NavLink label="Install" href={resolve('/docs/install')} />
<hr class="nav-divider" />
<NavLink label="Use" href={resolve('/docs/use')} />
<hr class="nav-divider" />
<NavLink label="Customize" href={resolve('/docs/customize')} />
<NavLink label="Configuration" href={resolve('/docs/config')} />
<hr class="nav-divider" />
<NavLink label="Colors" href={resolve('/docs/colors')} />
<NavLink label="Themes" href={resolve('/docs/themes')} />
<NavLink label="Typography" href={resolve('/docs/typography')} />
<NavLink label="Utilities" href={resolve('/docs/utilities')} />
<hr class="nav-divider" />
<NavLink label="FAQ" href={resolve('/docs/faq')} />
