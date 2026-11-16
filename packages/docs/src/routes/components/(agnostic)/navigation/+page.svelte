<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
	import { ChevronRight, House, Inbox, Send, Settings, Star, Trash2 } from '@lucide/svelte';
</script>

<DocPage
	title="Navigation"
	description="Items, headings and dividers that go inside a drawer or sidebar."
>
	<!-- Header/Classes -->
	<ComponentClassTable name="navigation" />
	<p class="text-body-medium text-on-surface-variant">
		These are the controls that go inside a navigation container: a <code>.drawer</code>, a
		<code>.sidebar</code> or <code>.sidebar-rail</code>, or any other column. They read the
		<code>--sidebar-rail</code> variable rather than a class, so they work anywhere and only collapse
		when an ancestor really is a rail.
	</p>
	<!-- Items -->
	<ComponentPreview
		id="items"
		title="Navigation Items"
		description="An icon and a label, on a link or a button."
	>
		<nav class="flex w-64 flex-col gap-1 p-2" aria-label="Example">
			<a class="nav-item" href="#items"><House /><span class="nav-label">Home</span></a>
			<a class="nav-item" href="#items"><Inbox /><span class="nav-label">Inbox</span></a>
			<button class="nav-item"><Settings /><span class="nav-label">Settings</span></button>
		</nav>
	</ComponentPreview>
	<!-- States -->
	<ComponentPreview
		id="states"
		title="Active and Disabled"
		description="Active with aria-current, data-active, .active or .selected. Disabled with .disabled, [disabled] or aria-disabled."
	>
		<nav class="flex w-64 flex-col gap-1 p-2" aria-label="Example">
			<a class="nav-item" href="#states" aria-current="page">
				<Inbox /><span class="nav-label">Active</span>
			</a>
			<a class="nav-item" href="#states"><Star /><span class="nav-label">Default</span></a>
			<a class="nav-item" href="#states" aria-disabled="true">
				<Trash2 /><span class="nav-label">Disabled</span>
			</a>
		</nav>
	</ComponentPreview>
	<!-- Plain -->
	<ComponentPreview
		id="plain"
		title="Plain Items"
		description="nav-item-plain drops the fill until an item is hovered or active."
	>
		<nav class="flex w-64 flex-col gap-1 p-2" aria-label="Example">
			<a class="nav-item nav-item-plain" href="#plain" aria-current="page">
				<Inbox /><span class="nav-label">Inbox</span>
			</a>
			<a class="nav-item nav-item-plain" href="#plain"
				><Star /><span class="nav-label">Starred</span></a
			>
			<a class="nav-item nav-item-plain" href="#plain"
				><Send /><span class="nav-label">Sent</span></a
			>
		</nav>
	</ComponentPreview>
	<!-- Headings and dividers -->
	<ComponentPreview
		id="groups"
		title="Headings and Dividers"
		description="Headings line up with the item labels; dividers separate groups."
	>
		<nav class="flex w-64 flex-col gap-1 p-2" aria-label="Example">
			<p class="nav-heading">Mail</p>
			<a class="nav-item" href="#groups"><Inbox /><span class="nav-label">Inbox</span></a>
			<a class="nav-item" href="#groups"><Send /><span class="nav-label">Sent</span></a>
			<hr class="nav-divider" />
			<p class="nav-heading">Account</p>
			<a class="nav-item" href="#groups"><Settings /><span class="nav-label">Settings</span></a>
		</nav>
	</ComponentPreview>
	<!-- Trailing content -->
	<ComponentPreview
		id="trailing"
		title="Trailing Content"
		description="The label takes the free space, so anything after it sits at the end."
	>
		<nav class="flex w-64 flex-col gap-1 p-2" aria-label="Example">
			<a class="nav-item" href="#trailing">
				<Inbox /><span class="nav-label">Inbox</span>
				<span class="badge badge-tonal badge-primary">12</span>
			</a>
			<a class="nav-item" href="#trailing">
				<Settings /><span class="nav-label">Settings</span><ChevronRight />
			</a>
		</nav>
	</ComponentPreview>
	<!-- Sizing -->
	<ComponentPreview
		id="sizing"
		title="Sizing"
		description="Item padding is derived from --sidebar-rail-width, --sidebar-padding and --nav-icon-size, so icons stay centred in a rail. Match --sidebar-padding to the container's padding."
	>
		<nav
			class="flex w-72 flex-col gap-1 p-3 [--nav-icon-size:1.25rem] [--sidebar-padding:0.75rem]"
			aria-label="Example"
		>
			<a class="nav-item" href="#sizing"><House /><span class="nav-label">Home</span></a>
			<a class="nav-item" href="#sizing"><Inbox /><span class="nav-label">Inbox</span></a>
		</nav>
	</ComponentPreview>
</DocPage>
