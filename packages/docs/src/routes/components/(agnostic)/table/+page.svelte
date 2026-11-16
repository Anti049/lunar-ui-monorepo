<script lang="ts">
	import ComponentClassTable from '#lib/components/ComponentClassTable.svelte';
	import ComponentPreview from '#lib/components/ComponentPreview.svelte';
	import DocPage from '#lib/components/DocPage.svelte';
	const people = [
		{ name: 'Ada', role: 'Engineer', city: 'London', status: 'Active' },
		{ name: 'Grace', role: 'Admiral', city: 'New York', status: 'Active' },
		{ name: 'Alan', role: 'Mathematician', city: 'Manchester', status: 'Away' },
		{ name: 'Katherine', role: 'Analyst', city: 'Hampton', status: 'Active' },
		{ name: 'Linus', role: 'Maintainer', city: 'Portland', status: 'Away' }
	];
</script>

<DocPage title="Table" description="Displays data in rows and columns.">
	<!-- Header/Classes -->
	<ComponentClassTable name="table" />
	<!-- Table -->
	<ComponentPreview
		id="basic"
		title="Table"
		description="Use with standard thead, tbody, tfoot, tr, th and td markup."
	>
		<table class="table">
			<thead>
				<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
			</thead>
			<tbody>
				{#each people as person, i (i)}
					<tr
						><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
							>{person.status}</td
						></tr
					>
				{/each}
			</tbody>
		</table>
	</ComponentPreview>
	<!-- Zebra Table -->
	<ComponentPreview id="zebra" title="Zebra Table" description="Alternates row backgrounds.">
		<table class="table table-zebra">
			<thead>
				<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
			</thead>
			<tbody>
				{#each people as person, i (i)}
					<tr
						><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
							>{person.status}</td
						></tr
					>
				{/each}
			</tbody>
		</table>
	</ComponentPreview>
	<!-- Pinned Rows -->
	<ComponentPreview
		id="pinned-rows"
		title="Pinned Rows"
		description="Header and footer rows stick while the table scrolls."
	>
		<div class="h-64 w-full overflow-auto rounded-sm">
			<table class="table-pin-rows table">
				<thead>
					<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
				</thead>
				<tbody>
					{#each [...people, ...people, ...people] as person, i (i)}
						<tr
							><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
								>{person.status}</td
							></tr
						>
					{/each}
				</tbody>
				<tfoot>
					<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
				</tfoot>
			</table>
		</div>
	</ComponentPreview>
	<!-- Pinned Columns -->
	<ComponentPreview
		id="pinned-cols"
		title="Pinned Columns"
		description="Row headers (th) stick while the table scrolls sideways."
	>
		<div class="w-80 overflow-auto rounded-sm">
			<table class="table-pin-cols table">
				<thead>
					<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
				</thead>
				<tbody>
					{#each people as person, i (i)}
						<tr
							><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
								>{person.status}</td
							></tr
						>
					{/each}
				</tbody>
			</table>
		</div>
	</ComponentPreview>
	<!-- Table XS -->
	<ComponentPreview id="size-xs" title="Table XS">
		<table class="table table-xs">
			<thead>
				<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
			</thead>
			<tbody>
				{#each people as person, i (i)}
					<tr
						><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
							>{person.status}</td
						></tr
					>
				{/each}
			</tbody>
		</table>
	</ComponentPreview>
	<!-- Table SM -->
	<ComponentPreview id="size-sm" title="Table SM">
		<table class="table table-sm">
			<thead>
				<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
			</thead>
			<tbody>
				{#each people as person, i (i)}
					<tr
						><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
							>{person.status}</td
						></tr
					>
				{/each}
			</tbody>
		</table>
	</ComponentPreview>
	<!-- Table MD -->
	<ComponentPreview id="size-md" title="Table MD">
		<table class="table table-md">
			<thead>
				<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
			</thead>
			<tbody>
				{#each people as person, i (i)}
					<tr
						><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
							>{person.status}</td
						></tr
					>
				{/each}
			</tbody>
		</table>
	</ComponentPreview>
	<!-- Table LG -->
	<ComponentPreview id="size-lg" title="Table LG">
		<table class="table table-lg">
			<thead>
				<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
			</thead>
			<tbody>
				{#each people as person, i (i)}
					<tr
						><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
							>{person.status}</td
						></tr
					>
				{/each}
			</tbody>
		</table>
	</ComponentPreview>
	<!-- Table XL -->
	<ComponentPreview id="size-xl" title="Table XL">
		<table class="table table-xl">
			<thead>
				<tr><th>Name</th><th>Role</th><th>City</th><th>Status</th></tr>
			</thead>
			<tbody>
				{#each people as person, i (i)}
					<tr
						><th>{person.name}</th><td>{person.role}</td><td>{person.city}</td><td
							>{person.status}</td
						></tr
					>
				{/each}
			</tbody>
		</table>
	</ComponentPreview>
</DocPage>
