<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowLeftRight,
		Info,
		PaintBucket,
		Puzzle,
		RulerDimensionLine,
		ScanBox,
		Shapes,
		Wrench,
		type LucideIcon
	} from '@lucide/svelte';
	import { capitalCase } from 'change-case';
	import {
		getComponentDoc,
		type ComponentClass,
		type ComponentClassType
	} from '#lib/docs/index.ts';
	import prefix from '#lib/state/prefix.svelte.ts';
	import { cn } from '@anti049/lunar-ui-svelte';

	// Types
	interface ComponentDocProps {
		/** Slug of the doc under `src/lib/docs/components`, e.g. `tooltip`. */
		name: string;
		class?: string;
	}
	let typeDescriptors: Record<
		ComponentClassType,
		{ icon: LucideIcon | null; description: string; color: string }
	> = {
		component: {
			icon: null,
			description: 'Main component class',
			color: 'surface-container'
		},
		part: {
			icon: Puzzle,
			description: 'Class for a part of the component',
			color: 'primary-container'
		},
		modifier: {
			icon: Wrench,
			description: 'Modifies behavior of component/part',
			color: 'info-container'
		},
		direction: {
			icon: ArrowLeftRight,
			description: 'Direction of component/part',
			color: 'tertiary-container'
		},
		placement: {
			icon: ScanBox,
			description: 'Placement of component/part',
			color: 'secondary-container'
		},
		style: {
			icon: Shapes,
			description: 'Visual style of component/part',
			color: 'warning-container'
		},
		color: {
			icon: PaintBucket,
			description: 'Color of component/part',
			color: 'success-container'
		},
		size: {
			icon: RulerDimensionLine,
			description: 'Size of component/part',
			color: 'alert-container'
		}
	};

	// Props
	let { name, class: className = '' }: ComponentDocProps = $props();

	// Variables
	let doc = $derived(getComponentDoc(name));
	let prefixValue = $state(prefix.value);
	let sortedClasses = $derived(sortClasses(doc?.classes ?? []));
	let scroller: HTMLDivElement | undefined = $state();
	let headerHeight = $state(0);
	let canScrollUp = $state(false);
	let canScrollDown = $state(false);

	// Functions
	function sortClasses(classes: ComponentClass[]): ComponentClass[] {
		const typeOrder: ComponentClassType[] = [
			'component',
			'part',
			'modifier',
			'direction',
			'placement',
			'style',
			'color',
			'size'
		];
		return classes.sort((a, b) => {
			const typeComparison = typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
			if (typeComparison !== 0) return typeComparison;
			// Don't change the order if the types are the same
			return 0;
		});
	}
	function updateFades() {
		if (!scroller) return;
		const { scrollTop, scrollHeight, clientHeight } = scroller;
		canScrollUp = scrollTop > 0;
		// -1 absorbs sub-pixel rounding at the bottom
		canScrollDown = scrollTop + clientHeight < scrollHeight - 1;
	}
	// Re-check when the box or the table resizes (e.g. the prefix spacer row appears)
	$effect(() => {
		if (!scroller) return;
		updateFades();
		const ro = new ResizeObserver(updateFades);
		ro.observe(scroller);
		if (scroller.firstElementChild) ro.observe(scroller.firstElementChild);
		return () => ro.disconnect();
	});
	$effect(() => {
		prefix.value = prefixValue;
		console.log(doc);
	});
</script>

{#if doc}
	<div class="relative shrink-0 overflow-hidden rounded-sm border-2 border-outline-variant/50">
		<div
			bind:this={scroller}
			onscroll={updateFades}
			class="h-fit max-h-107.5 scrollbar-none overflow-auto"
		>
			<table class={cn('table-pin-rows table table-zebra table-md', className)}>
				<thead bind:clientHeight={headerHeight}>
					<tr>
						<th class="flex flex-row items-center gap-2">
							<!-- TODO: Replace with proper input later -->
							<div
								class={cn(
									'tooltip tooltip-bottom w-fit! tooltip-start tooltip-info tooltip-tail-size-4',
									prefixValue.length > 0 && 'tooltip-open'
								)}
							>
								{#if prefixValue.length > 0}
									<div class="tooltip-content w-fit max-w-1000">
										<div class="flex flex-row items-center gap-2">
											<Info class="h-4 w-4 text-on-info" />
											<span class="pointer-events-auto text-caption-large text-nowrap"
												>To use a custom prefix, <a
													href={resolve('/')}
													class="text-info-container underline">add your prefix string to config</a
												></span
											>
										</div>
									</div>
								{/if}
								<input
									type="text"
									placeholder="prefix-"
									class="w-32 rounded-sm surface px-2 py-1 text-caption-large"
									bind:value={prefixValue}
								/>
							</div>
							Class
						</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{#if prefixValue.length > 0}
						<!-- Empty row so that prefix tooltip doesn't overlap top row of class table -->
						<tr class="h-12">
							<td colspan="3"></td>
						</tr>
					{/if}
					{#each sortedClasses as { className, type, description } (className)}
						{@const Icon = typeDescriptors[type].icon}
						<tr>
							<td>
								<code>{prefix.value}{className}</code>
							</td>
							<td>
								<div
									class={cn(
										'tooltip flex w-fit cursor-help flex-row items-center gap-2 rounded-sm px-2 py-1 select-none',
										typeDescriptors[type].color
									)}
									data-tooltip={typeDescriptors[type].description}
								>
									{#if typeDescriptors[type].icon}
										<Icon class="h-4 w-4" />
									{/if}
									<span>{capitalCase(type)}</span>
								</div>
							</td>
							<td>{description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Top fade, placed just under the pinned header -->
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 z-2 h-16 bg-linear-to-b from-surface-container-low to-transparent transition-opacity duration-200"
			class:opacity-0={!canScrollUp}
			style:top="{headerHeight}px"
		></div>
		<!-- Bottom fade -->
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-16 bg-linear-to-t from-surface-container-low to-transparent transition-opacity duration-200"
			class:opacity-0={!canScrollDown}
		></div>
	</div>
{/if}
