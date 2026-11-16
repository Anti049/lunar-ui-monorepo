<script lang="ts">
	import { resolve } from '$app/paths';
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
	import { cn } from '@anti049/lunar-ui-svelte';
	import {
		Archive,
		Inbox,
		PanelLeftClose,
		PanelLeftOpen,
		Send,
		Settings,
		Star
	} from '@lucide/svelte';

	let collapsed = $state(false);
	let railVariantCollapsed = $state(false);
</script>

<DocPage title="Sidebar" description="A docked, always-visible navigation panel.">
	<!-- Header/Classes -->
	<ComponentClassTable name="sidebar" />
	<p class="text-body-medium text-on-surface-variant">
		Inside a <code>.scaffold</code>, a sidebar docks into the start column and takes the full
		height. <code>sidebar</code> and <code>sidebar-rail</code> are peers rather than a base and a
		modifier, so each can be switched on at its own breakpoint. Fill it with the
		<a class="text-primary underline" href={resolve('/components/(agnostic)/navigation')}
			>navigation</a
		>
		classes; the inline padding of <code>.nav-item</code> assumes <code>p-2</code> on the sidebar (<code
			>--sidebar-padding</code
		>).
	</p>
	<!-- Full -->
	<ComponentPreview id="full" title="Sidebar" description="The full-width sidebar, 16rem wide.">
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<nav class="sidebar gap-1 p-2" aria-label="Mail">
				<a class="nav-item" href="#full" aria-current="page">
					<Inbox /><span class="nav-label">Inbox</span>
				</a>
				<a class="nav-item" href="#full"><Star /><span class="nav-label">Starred</span></a>
				<a class="nav-item" href="#full"><Send /><span class="nav-label">Sent</span></a>
			</nav>
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
		</div>
	</ComponentPreview>
	<!-- Rail -->
	<ComponentPreview
		id="rail"
		title="Sidebar Rail"
		description="The minimized sidebar, 4rem wide. Labels fade out but stay in the accessible name."
	>
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<nav class="sidebar-rail gap-1 p-2" aria-label="Mail">
				<a class="nav-item" href="#rail" aria-current="page">
					<Inbox /><span class="nav-label">Inbox</span>
				</a>
				<a class="nav-item" href="#rail"><Star /><span class="nav-label">Starred</span></a>
				<a class="nav-item" href="#rail"><Send /><span class="nav-label">Sent</span></a>
			</nav>
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
		</div>
	</ComponentPreview>
	<!-- Collapsible -->
	<ComponentPreview
		id="collapsible"
		title="Collapsible Sidebar"
		description="Swap sidebar for sidebar-rail to collapse it. The width animates around stationary icons."
	>
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<nav class={cn('gap-1 p-2', collapsed ? 'sidebar-rail' : 'sidebar')} aria-label="Mail">
				<button
					class="nav-item nav-item-plain"
					aria-expanded={!collapsed}
					onclick={() => (collapsed = !collapsed)}
				>
					{#if collapsed}<PanelLeftOpen />{:else}<PanelLeftClose />{/if}
					<span class="nav-label">Collapse</span>
				</button>
				<hr class="nav-divider" />
				<a class="nav-item" href="#collapsible" aria-current="page">
					<Inbox /><span class="nav-label">Inbox</span>
				</a>
				<a class="nav-item" href="#collapsible"><Star /><span class="nav-label">Starred</span></a>
				<a class="nav-item" href="#collapsible"><Archive /><span class="nav-label">Archive</span></a
				>
			</nav>
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
		</div>
	</ComponentPreview>
	<!-- Rail variant -->
	<ComponentPreview
		id="rail-variant"
		title="Responding to the Rail"
		description="Use the sidebar-rail: variant on descendants to restyle them while the sidebar is minimized."
	>
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<nav
				class={cn('gap-1 p-2', railVariantCollapsed ? 'sidebar-rail' : 'sidebar')}
				aria-label="Account"
			>
				<div class="flex flex-row items-center gap-3 p-2 sidebar-rail:flex-col">
					<div class="grid size-8 shrink-0 place-items-center rounded-full primary">A</div>
					<div class="flex min-w-0 flex-col sidebar-rail:hidden">
						<span class="truncate text-title-small">Ada Lovelace</span>
						<span class="truncate text-body-small text-on-surface-variant">ada@example.com</span>
					</div>
				</div>
				<hr class="nav-divider" />
				<a class="nav-item" href="#rail-variant"
					><Settings /><span class="nav-label">Settings</span></a
				>
			</nav>
			<main class="scaffold-body p-4">
				<button
					class="button button-md button-tonal button-primary"
					onclick={() => (railVariantCollapsed = !railVariantCollapsed)}
				>
					{railVariantCollapsed ? 'Expand' : 'Collapse'} sidebar
				</button>
			</main>
		</div>
	</ComponentPreview>
	<!-- End -->
	<ComponentPreview
		id="end"
		title="End Sidebar"
		description="Add drawer-end to dock the sidebar into the end column."
	>
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
			<aside class="sidebar drawer-end gap-1 p-2" aria-label="Details">
				<p class="nav-heading">Details</p>
				<a class="nav-item" href="#end"><Star /><span class="nav-label">Starred</span></a>
				<a class="nav-item" href="#end"><Archive /><span class="nav-label">Archive</span></a>
			</aside>
		</div>
	</ComponentPreview>
	<!-- Custom width -->
	<ComponentPreview
		id="custom-width"
		title="Custom Widths"
		description="Set --sidebar-width and --sidebar-rail-width on the sidebar or any ancestor."
	>
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<nav class="sidebar gap-1 p-2 [--sidebar-width:12rem]" aria-label="Mail">
				<a class="nav-item" href="#custom-width" aria-current="page">
					<Inbox /><span class="nav-label">Inbox</span>
				</a>
				<a class="nav-item" href="#custom-width"><Send /><span class="nav-label">Sent</span></a>
			</nav>
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
		</div>
	</ComponentPreview>
	<p class="text-body-medium text-on-surface-variant">
		To show a modal drawer on small screens and dock it on larger ones, put both classes on the same
		element: <code>drawer medium:sidebar-rail expanded:sidebar</code>. See
		<a class="text-primary underline" href={resolve('/components/(agnostic)/drawer')}>Drawer</a>.
	</p>
</DocPage>
