<script lang="ts">
	import { resolve } from '$app/paths';
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
	import { House, Inbox, Menu, Pencil, Plus, Settings } from '@lucide/svelte';
</script>

<DocPage
	title="Scaffold"
	description="The page frame: app bar, scrolling body, bottom bars and docked sidebars."
>
	<!-- Header/Classes -->
	<ComponentClassTable name="scaffold" />
	<p class="text-body-medium text-on-surface-variant">
		<code>.scaffold</code> is a grid whose slots claim fixed rows: app bar, body, sheet, footer and
		navbar, top to bottom. A slot you leave out collapses, and the body always takes the leftover
		height and scrolls on its own. The scaffold fills its parent, so give the parent a definite
		height, or put <code>h-screen</code> on the scaffold when it is the whole page. It is also the
		positioned box a
		<a class="text-primary underline" href={resolve('/components/(agnostic)/drawer')}>drawer</a>
		fills and the grid a
		<a class="text-primary underline" href={resolve('/components/(agnostic)/sidebar')}>sidebar</a>
		docks into.
	</p>
	<!-- Basic -->
	<ComponentPreview id="basic" title="Scaffold" description="An app bar above a scrolling body.">
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<header class="appbar scaffold-appbar">
				<div class="appbar-leading">
					<button class="button button-square button-md button-text" aria-label="Menu">
						<Menu />
					</button>
				</div>
				<div class="appbar-body">
					<p class="appbar-title">Title</p>
				</div>
			</header>
			<main class="scaffold-body p-4">
				{#each { length: 20 }, i (i)}
					<p>Line {i + 1}</p>
				{/each}
			</main>
		</div>
	</ComponentPreview>
	<!-- FAB -->
	<ComponentPreview
		id="fab"
		title="Floating Action Button"
		description="scaffold-fab floats over the body's bottom end corner. Add scaffold-fab-start or scaffold-fab-center to move it."
	>
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<header class="appbar scaffold-appbar">
				<div class="appbar-body">
					<p class="appbar-title">Notes</p>
				</div>
			</header>
			<main class="scaffold-body p-4">
				{#each { length: 20 }, i (i)}
					<p>Note {i + 1}</p>
				{/each}
			</main>
			<button
				class="button scaffold-fab button-square button-lg button-filled button-primary"
				aria-label="New note"
			>
				<Plus />
			</button>
		</div>
	</ComponentPreview>
	<!-- Bottom rows -->
	<ComponentPreview
		id="bottom"
		title="Sheet, Footer and Navbar"
		description="Persistent rows below the body. The FAB stays clear of whichever are present."
	>
		<div class="scaffold h-96 rounded-sm border border-outline-variant/38">
			<header class="appbar scaffold-appbar">
				<div class="appbar-body">
					<p class="appbar-title">Draft</p>
				</div>
			</header>
			<main class="scaffold-body p-4">
				{#each { length: 20 }, i (i)}
					<p>Line {i + 1}</p>
				{/each}
			</main>
			<button
				class="button scaffold-fab button-square button-lg button-filled button-primary"
				aria-label="Edit"
			>
				<Pencil />
			</button>
			<div class="scaffold-sheet p-4">
				<p class="text-title-small">Bottom sheet</p>
			</div>
			<div class="scaffold-footer">
				<button class="button button-md button-text button-primary">Cancel</button>
				<button class="button button-md button-filled button-primary">Save</button>
			</div>
			<nav
				class="scaffold-navbar flex flex-row border-t border-outline-variant/38 p-2"
				aria-label="Main"
			>
				<a class="nav-item justify-center" href="#bottom" aria-current="page"><House /></a>
				<a class="nav-item justify-center" href="#bottom"><Inbox /></a>
				<a class="nav-item justify-center" href="#bottom"><Settings /></a>
			</nav>
		</div>
	</ComponentPreview>
	<!-- Sidebar -->
	<ComponentPreview
		id="sidebar"
		title="Scaffold with Sidebar"
		description="A sidebar docks into the start column and spans every row."
	>
		<div class="scaffold h-80 rounded-sm border border-outline-variant/38">
			<header class="appbar scaffold-appbar">
				<div class="appbar-body">
					<p class="appbar-title">Inbox</p>
				</div>
			</header>
			<nav class="sidebar-rail gap-1 p-2" aria-label="Main">
				<a class="nav-item" href="#sidebar"><House /><span class="nav-label">Home</span></a>
				<a class="nav-item" href="#sidebar" aria-current="page">
					<Inbox /><span class="nav-label">Inbox</span>
				</a>
			</nav>
			<main class="scaffold-body p-4">
				<p>Page content.</p>
			</main>
		</div>
	</ComponentPreview>
	<!-- Extend body -->
	<ComponentPreview
		id="extend-body"
		title="Extend Body"
		description="scaffold-extend-body and scaffold-extend-body-behind-appbar run the body under translucent bars. Pad the body's content clear of them yourself."
	>
		<div
			class="scaffold scaffold-extend-body-behind-appbar h-80 rounded-sm border border-outline-variant/38"
		>
			<header class="appbar scaffold-appbar bg-surface/70 backdrop-blur">
				<div class="appbar-body">
					<p class="appbar-title">Translucent</p>
				</div>
			</header>
			<main class="scaffold-body p-4 pt-20">
				{#each { length: 20 }, i (i)}
					<p>Line {i + 1}</p>
				{/each}
			</main>
		</div>
	</ComponentPreview>
</DocPage>
