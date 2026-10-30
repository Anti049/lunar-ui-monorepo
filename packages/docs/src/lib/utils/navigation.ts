import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';
import {
	BellRing,
	Database,
	Flame,
	Link,
	MapPin,
	MapPinCheck,
	MapPinOff,
	MapPinPen,
	MapPinPlus,
	MousePointerClick,
	PanelsTopLeft,
	PictureInPicture2,
	TabletSmartphone,
	TextCursorInput,
	Wrench,
	type LucideIcon
} from '@lucide/svelte';
import SvelteIcon from '@iconify-svelte/fa7-brands/svelte';

/**
 * Components
 *
 * Accordion
 * Appbar
 * Aura
 * Avatar
 * Badge
 * Breadcrumb
 * Button
 * Calendar
 * Card
 * Carousel
 * Chart
 * Chat
 * Checkbox
 * Code Block
 * Collapsible
 * Combobox
 * Command
 * Context Menu
 * Countdown
 * Data Table
 * Date Picker
 * Dialog
 * Diff
 * Divider
 * Drawer
 * Dropdown
 * FAB
 * File Upload
 * Form
 * Helper
 * Hover 3D
 * Hover Card
 * Hover Gallery
 * Indicator
 * Input
 * Input OTP
 * Join
 * Kbd
 * Label
 * Loading
 * Marquee
 * Mask
 * Menu
 * Mockup
 * Modal
 * Navigation
 * Pagination
 * Panel
 * Placeholder
 * Popover
 * Portal
 * Progress
 * QR Code
 * Radio
 * Rating
 * Resizable
 * Scroll Area
 * Section
 * Select
 * Sidebar
 * Skeleton
 * Slider
 * Spinner
 * Status
 * Steps
 * Swap
 * Switch
 * Table
 * Tabs
 * Tag
 * Text Reel
 * Timeline
 * Titlebar
 * Toast
 * Toggle
 * Tooltip
 * Tree
 * Tristate
 */
type Icon = LucideIcon | typeof SvelteIcon | string | null;

type NavigationRouteStatusInfo = {
	/** Display text, e.g. for the badge. */
	label: string;
	icon: Icon;
	/** The badge colour class. Written out in full so Tailwind finds it. */
	badge: string;
};

/*
	The statuses a route can have. The keys ARE the status ids:
	NavigationRouteStatus is read off this object, so adding a status here is
	the only step, and a status cannot exist without its label, icon and badge.
	Look one up by id: `routeStatuses[route.status].badge`.
*/
const routeStatuses = {
	planned: { label: 'Planned', icon: MapPin, badge: 'badge-warning' },
	'up-next': { label: 'Up Next', icon: MapPinPlus, badge: 'badge-primary' },
	'in-progress': { label: 'In-Progress', icon: MapPinPen, badge: 'badge-info' },
	completed: { label: 'Completed', icon: MapPinCheck, badge: 'badge-success' },
	deprecated: { label: 'Deprecated', icon: MapPinOff, badge: 'badge-error' }
} satisfies Record<string, NavigationRouteStatusInfo>;

type NavigationRouteStatus = keyof typeof routeStatuses;

type NavigationRoute = {
	label: string;
	href: ResolvedPathname;
	disabled?: boolean;
	status: NavigationRouteStatus;
};

type NavigationRouteCategory =
	| 'actions'
	| 'input'
	| 'navigation'
	| 'overlay'
	| 'data-display'
	| 'feedback'
	| 'layout'
	| 'effects'
	| 'mockup'
	| 'utilities';

type NavigationCategory = {
	id: NavigationRouteCategory;
	label: string;
	icon: LucideIcon;
	links: NavigationRoute[];
};

/*
	The component stylesheets, read from the plugin's source rather than from the
	docs app. `packages/core/src/components/` is where they live now; the
	docs package no longer carries a copy.

	Most of that directory is still empty placeholders for planned components --
	a file with nothing but a header comment. `functions/build.ts` skips those
	when it decides which bundles to ship, so stripping comments and asking
	whether anything is left is the same question the build asks, and gives the
	same 16 components.
*/
const componentStyles = import.meta.glob<string>('../../../../core/src/components/*.css', {
	eager: true,
	query: '?raw',
	import: 'default'
});

/* Keyed by component slug, so the lookup does not depend on how Vite spells
   the glob's keys (relative here, root-absolute before). */
const implemented = new Set(
	Object.entries(componentStyles)
		.filter(([, css]) => css.replace(/\/\*[\s\S]*?\*\//g, '').trim().length > 0)
		.map(([file]) => file.replace(/^.*\/(.+)\.css$/, '$1'))
);

/** True for a component link that is marked disabled or has no styles yet. Other hrefs are never disabled. */
function isDisabled(href: ResolvedPathname): boolean {
	const route = componentLinks.find((link) => link.href === href);
	// Last segment, not a replace() of '/components/', so a non-empty `base`
	// path would not silently mangle the slug.
	const slug = href.split('/').pop() ?? '';
	return route !== undefined && (route.disabled === true || !implemented.has(slug));
}

const componentCategories: NavigationCategory[] = [
	{
		id: 'actions',
		label: 'Actions',
		icon: MousePointerClick,
		links: [
			{ href: resolve('/components/(agnostic)/button'), label: 'Button', status: 'completed' },
			{ href: resolve('/components/(agnostic)/fab'), label: 'FAB', status: 'planned' },
			{ href: resolve('/components/(agnostic)/swap'), label: 'Swap', status: 'completed' },
			{ href: resolve('/components/(agnostic)/toggle'), label: 'Toggle', status: 'planned' }
		]
	},
	{
		id: 'input',
		label: 'Inputs',
		icon: TextCursorInput,
		links: [
			{
				href: resolve('/components/(agnostic)/calendar'),
				label: 'Calendar',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/checkbox'),
				label: 'Checkbox',
				status: 'completed'
			},
			{
				href: resolve('/components/(agnostic)/combobox'),
				label: 'Combobox',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/date-picker'),
				label: 'Date Picker',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/file-upload'),
				label: 'File Upload',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/form'), label: 'Form', status: 'planned' },
			{ href: resolve('/components/(agnostic)/helper'), label: 'Helper', status: 'planned' },
			{ href: resolve('/components/(agnostic)/input'), label: 'Input', status: 'up-next' },
			{
				href: resolve('/components/(agnostic)/input-otp'),
				label: 'Input OTP',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/label'), label: 'Label', status: 'planned' },
			{ href: resolve('/components/(agnostic)/radio'), label: 'Radio', status: 'planned' },
			{ href: resolve('/components/(agnostic)/rating'), label: 'Rating', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/select'),
				label: 'Select',
				status: 'in-progress'
			},
			{ href: resolve('/components/(agnostic)/slider'), label: 'Slider', status: 'planned' },
			{ href: resolve('/components/(agnostic)/switch'), label: 'Switch', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/tristate'),
				label: 'Tristate',
				status: 'planned'
			}
		]
	},
	{
		id: 'navigation',
		label: 'Navigation',
		icon: Link,
		links: [
			{ href: resolve('/components/(agnostic)/appbar'), label: 'Appbar', status: 'completed' },
			{
				href: resolve('/components/(agnostic)/breadcrumb'),
				label: 'Breadcrumb',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/command'),
				label: 'Command',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/navigation'),
				label: 'Navigation',
				status: 'in-progress'
			},
			{
				href: resolve('/components/(agnostic)/pagination'),
				label: 'Pagination',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/sidebar'),
				label: 'Sidebar',
				status: 'in-progress'
			},
			{ href: resolve('/components/(agnostic)/steps'), label: 'Steps', status: 'planned' },
			{ href: resolve('/components/(agnostic)/tabs'), label: 'Tabs', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/titlebar'),
				label: 'Titlebar',
				status: 'planned'
			}
		]
	},
	{
		id: 'overlay',
		label: 'Overlays',
		icon: PictureInPicture2,
		links: [
			{
				href: resolve('/components/(agnostic)/context-menu'),
				label: 'Context Menu',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/dialog'), label: 'Dialog', status: 'planned' },
			{ href: resolve('/components/(agnostic)/drawer'), label: 'Drawer', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/dropdown'),
				label: 'Dropdown',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/hover-card'),
				label: 'Hover Card',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/menu'), label: 'Menu', status: 'planned' },
			{ href: resolve('/components/(agnostic)/modal'), label: 'Modal', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/popover'),
				label: 'Popover',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/tooltip'),
				label: 'Tooltip',
				status: 'completed'
			}
		]
	},
	{
		id: 'data-display',
		label: 'Data Display',
		icon: Database,
		links: [
			{ href: resolve('/components/(agnostic)/avatar'), label: 'Avatar', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/badge'),
				label: 'Badge',
				status: 'in-progress'
			},
			{ href: resolve('/components/(agnostic)/card'), label: 'Card', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/carousel'),
				label: 'Carousel',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/chart'), label: 'Chart', status: 'planned' },
			{ href: resolve('/components/(agnostic)/chat'), label: 'Chat', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/code-block'),
				label: 'Code Block',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/countdown'),
				label: 'Countdown',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/data-table'),
				label: 'Data Table',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/diff'), label: 'Diff', status: 'planned' },
			{ href: resolve('/components/(agnostic)/kbd'), label: 'Kbd', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/qr-code'),
				label: 'QR Code',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/table'), label: 'Table', status: 'completed' },
			{ href: resolve('/components/(agnostic)/tag'), label: 'Tag', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/timeline'),
				label: 'Timeline',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/tree'), label: 'Tree', status: 'planned' }
		]
	},
	{
		id: 'feedback',
		label: 'Feedback',
		icon: BellRing,
		links: [
			{
				href: resolve('/components/(agnostic)/loading'),
				label: 'Loading',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/placeholder'),
				label: 'Placeholder',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/progress'),
				label: 'Progress',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/skeleton'),
				label: 'Skeleton',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/spinner'),
				label: 'Spinner',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/status'),
				label: 'Status',
				status: 'deprecated'
			},
			{ href: resolve('/components/(agnostic)/toast'), label: 'Toast', status: 'planned' }
		]
	},
	{
		id: 'layout',
		label: 'Layout',
		icon: PanelsTopLeft,
		links: [
			{
				href: resolve('/components/(agnostic)/accordion'),
				label: 'Accordion',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/collapsible'),
				label: 'Collapsible',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/divider'),
				label: 'Divider',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/indicator'),
				label: 'Indicator',
				status: 'in-progress'
			},
			{ href: resolve('/components/(agnostic)/join'), label: 'Join', status: 'planned' },
			{ href: resolve('/components/(agnostic)/panel'), label: 'Panel', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/resizable'),
				label: 'Resizable',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/scaffold'),
				label: 'Scaffold',
				status: 'in-progress'
			},
			{
				href: resolve('/components/(agnostic)/scroll-area'),
				label: 'Scroll Area',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/section'),
				label: 'Section',
				status: 'planned'
			}
		]
	},
	{
		id: 'effects',
		label: 'Effects',
		icon: Flame,
		links: [
			{ href: resolve('/components/(agnostic)/aura'), label: 'Aura', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/hover-3d'),
				label: 'Hover 3D',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/hover-gallery'),
				label: 'Hover Gallery',
				status: 'planned'
			},
			{
				href: resolve('/components/(agnostic)/marquee'),
				label: 'Marquee',
				status: 'planned'
			},
			{ href: resolve('/components/(agnostic)/mask'), label: 'Mask', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/text-reel'),
				label: 'Text Reel',
				status: 'planned'
			}
		]
	},
	{
		id: 'utilities',
		label: 'Utilities',
		icon: Wrench,
		links: [
			{ href: resolve('/components/(agnostic)/portal'), label: 'Portal', status: 'planned' },
			{
				href: resolve('/components/(agnostic)/scrollbar'),
				label: 'Scrollbar',
				status: 'up-next'
			}
		]
	},
	{
		id: 'mockup',
		label: 'Mockups',
		icon: TabletSmartphone,
		links: [{ href: resolve('/components/(agnostic)/mockup'), label: 'Mockup', status: 'planned' }]
	}
];

/** Every component link, flattened in category order. */
const componentLinks: NavigationRoute[] = componentCategories.flatMap((category) => category.links);

export {
	componentCategories,
	componentLinks,
	isDisabled,
	routeStatuses,
	type Icon,
	type NavigationCategory,
	type NavigationRoute,
	type NavigationRouteCategory,
	type NavigationRouteStatus,
	type NavigationRouteStatusInfo
};
