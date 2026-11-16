<script lang="ts">
	import { resolve } from '$app/paths';
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
	import { Archive, Inbox, Menu, Send, Settings, Star, Trash2, X } from '@lucide/svelte';

	// One flag per preview, so opening one demo leaves the others alone.
	let basicOpen = $state(false);
	let endOpen = $state(false);
	let groupedOpen = $state(false);
	let responsiveOpen = $state(false);
</script>

<DocPage title="Drawer" description="A modal panel that slides in from the edge of the screen.">
	<!-- Header/Classes -->
	<ComponentClassTable name="drawer" />
	<p class="text-body-medium text-on-surface-variant">
		A drawer is absolutely positioned, so it fills its nearest positioned ancestor; a
		<code>.scaffold</code> is one. Open it by setting <code>data-open</code> on the drawer. A
		<code>.drawer-scrim</code> sibling fades in and out with it, with no extra state. A closed
		drawer is <code>invisible</code> as well as off-screen, so it cannot be tabbed into.
	</p>
	<!-- Basic -->
	<ComponentPreview
		id="basic"
		title="Drawer"
		description="Slides in from the start edge. Click the scrim to close it."
	>
		<div class="scaffold h-96 rounded-sm border border-outline-variant/38">
			<header class="appbar scaffold-appbar">
				<div class="appbar-leading">
					<button
						class="button button-square button-md button-text"
						aria-label="Open drawer"
						onclick={() => (basicOpen = true)}
					>
						<Menu />
					</button>
				</div>
				<div class="appbar-body">
					<p class="appbar-title">Mail</p>
				</div>
			</header>
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
			<button class="drawer-scrim" aria-label="Close drawer" onclick={() => (basicOpen = false)}
			></button>
			<nav class="drawer gap-1 p-2" aria-label="Mail" data-open={basicOpen || undefined}>
				<a class="nav-item" href="#basic" aria-current="page">
					<Inbox /><span class="nav-label">Inbox</span>
				</a>
				<a class="nav-item" href="#basic"><Star /><span class="nav-label">Starred</span></a>
				<a class="nav-item" href="#basic"><Send /><span class="nav-label">Sent</span></a>
			</nav>
		</div>
	</ComponentPreview>
	<!-- End -->
	<ComponentPreview
		id="end"
		title="End Drawer"
		description="Add drawer-end to slide in from the end edge, e.g. for filters or details."
	>
		<div class="scaffold h-96 rounded-sm border border-outline-variant/38">
			<header class="appbar scaffold-appbar">
				<div class="appbar-body">
					<p class="appbar-title">Products</p>
				</div>
				<div class="appbar-trailing">
					<button
						class="button button-md button-tonal button-primary"
						onclick={() => (endOpen = true)}
					>
						Filters
					</button>
				</div>
			</header>
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
			<button class="drawer-scrim" aria-label="Close filters" onclick={() => (endOpen = false)}
			></button>
			<aside class="drawer drawer-end gap-2 p-4" data-open={endOpen || undefined}>
				<div class="flex flex-row items-center justify-between">
					<p class="text-title-large">Filters</p>
					<button
						class="button button-square button-md button-text"
						aria-label="Close filters"
						onclick={() => (endOpen = false)}
					>
						<X />
					</button>
				</div>
				<p class="text-body-medium text-on-surface-variant">Drawer content goes here.</p>
			</aside>
		</div>
	</ComponentPreview>
	<!-- Grouped -->
	<ComponentPreview
		id="grouped"
		title="Drawer with Headings and Dividers"
		description="Group items with nav-heading and nav-divider."
	>
		<div class="scaffold h-96 rounded-sm border border-outline-variant/38">
			<main class="scaffold-body grid place-items-center p-4">
				<button
					class="button button-md button-filled button-primary"
					onclick={() => (groupedOpen = true)}
				>
					Open drawer
				</button>
			</main>
			<button class="drawer-scrim" aria-label="Close drawer" onclick={() => (groupedOpen = false)}
			></button>
			<nav class="drawer gap-1 p-2" aria-label="Mail" data-open={groupedOpen || undefined}>
				<p class="nav-heading">Mail</p>
				<a class="nav-item" href="#grouped" aria-current="page">
					<Inbox /><span class="nav-label">Inbox</span>
				</a>
				<a class="nav-item" href="#grouped"><Star /><span class="nav-label">Starred</span></a>
				<a class="nav-item" href="#grouped"><Archive /><span class="nav-label">Archive</span></a>
				<a class="nav-item" href="#grouped" aria-disabled="true">
					<Trash2 /><span class="nav-label">Trash</span>
				</a>
				<hr class="nav-divider" />
				<p class="nav-heading">Account</p>
				<a class="nav-item" href="#grouped"><Settings /><span class="nav-label">Settings</span></a>
			</nav>
		</div>
	</ComponentPreview>
	<!-- Responsive -->
	<ComponentPreview
		id="responsive"
		title="Responsive Drawer"
		description="A modal drawer on small screens that docks as a sidebar rail from medium and a full sidebar from expanded. Resize the window to see it change."
	>
		<div class="scaffold h-96 rounded-sm border border-outline-variant/38">
			<header class="appbar scaffold-appbar">
				<div class="appbar-leading medium:hidden">
					<button
						class="button button-square button-md button-text"
						aria-label="Open navigation"
						onclick={() => (responsiveOpen = true)}
					>
						<Menu />
					</button>
				</div>
				<div class="appbar-body">
					<p class="appbar-title">Mail</p>
				</div>
			</header>
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
			<button
				class="drawer-scrim"
				aria-label="Close navigation"
				onclick={() => (responsiveOpen = false)}
			></button>
			<nav
				class="drawer gap-1 p-2 medium:sidebar-rail expanded:sidebar"
				aria-label="Mail"
				data-open={responsiveOpen || undefined}
			>
				<a class="nav-item" href="#responsive" aria-current="page">
					<Inbox /><span class="nav-label">Inbox</span>
				</a>
				<a class="nav-item" href="#responsive"><Star /><span class="nav-label">Starred</span></a>
				<a class="nav-item" href="#responsive"><Send /><span class="nav-label">Sent</span></a>
			</nav>
		</div>
	</ComponentPreview>
	<p class="text-body-medium text-on-surface-variant">
		Once a sidebar class is active, the drawer docks into the scaffold's grid, ignores
		<code>data-open</code> and no longer raises the scrim. See
		<a class="text-primary underline" href={resolve('/components/(agnostic)/sidebar')}>Sidebar</a> for
		the docked sizes.
	</p>
</DocPage>
