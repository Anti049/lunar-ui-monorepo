<script lang="ts">
	import CodeBlock from '#lib/components/CodeBlock.svelte';
	import DocPage from '#lib/components/DocPage.svelte';

	const repoUrl = 'https://github.com/Anti049/lunar-ui-monorepo.git';

	const setup = `bun install
bun run --filter '@anti049/lunar-ui' build   # core's generated/ must exist first
bun run check
git config commit.template .gitmessage`;

	const changeset = `bun changeset`;

	const commitExamples = `feat(core): add drawer-end placement
fix(svelte): keep ripple inside rounded buttons
docs(docs): fill out sidebar page
chore(deps): bump vite`;

	const rehearse = `bun run rehearse`;
</script>

{#snippet h2(text: string, id: string)}
	<h2 {id} class="mt-4 scroll-mt-4 text-headline-small text-on-surface">{text}</h2>
{/snippet}
{#snippet h3(text: string)}
	<h3 class="mt-2 text-title-large text-on-surface">{text}</h3>
{/snippet}

<DocPage
	title="Development"
	description="Clone the repo, make a change, push it, and ship a new version, all from VS Code."
>
	<div class="flex max-w-4xl flex-col gap-3 text-body-large text-on-surface-variant">
		<!-- Prerequisites -->
		{@render h2('Prerequisites', 'prerequisites')}
		<ul class="list-disc ps-6">
			<li><a class="text-primary underline" href="https://git-scm.com">Git</a></li>
			<li>
				<a class="text-primary underline" href="https://bun.sh">Bun</a>, which is the package
				manager and script runner for the whole monorepo
			</li>
			<li><a class="text-primary underline" href="https://code.visualstudio.com">VS Code</a></li>
			<li>
				The <strong>GitHub Pull Requests</strong> and <strong>GitHub Actions</strong> extensions for VS
				Code. They are optional, but they let you open PRs and start workflows without leaving the editor.
			</li>
			<li>Write access to the repository, or a fork of it</li>
		</ul>

		<!-- Clone -->
		{@render h2('1. Clone the repository', 'clone')}
		<ol class="list-decimal ps-6">
			<li>Open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>).</li>
			<li>Run <strong>Git: Clone</strong> and paste the repository URL:</li>
		</ol>
		<CodeBlock code={repoUrl} lang="text" />
		<ol class="list-decimal ps-6" start="3">
			<li>
				Pick a folder, then choose <strong>Open</strong> when VS Code offers to open the clone.
			</li>
			<li>
				Open a terminal (<kbd>Ctrl</kbd>+<kbd>`</kbd>) and install everything. The plugin has to be
				built once before anything else, because the other packages import its generated files:
			</li>
		</ol>
		<CodeBlock code={setup} lang="bash" />
		<p>
			The last line sets up the commit message template, so <strong>git commit</strong> opens with the
			format already filled in.
		</p>

		<!-- Run -->
		{@render h2('2. Run the docs site', 'run')}
		<p>
			The workspace has VS Code tasks and launch configurations, so you don't need to type commands:
		</p>
		<ul class="list-disc ps-6">
			<li>
				<strong>Tasks: Run Task → dev</strong> starts the docs site at
				<code>http://localhost:5173</code>. It reloads as you edit core, the Svelte bindings and the
				docs.
			</li>
			<li>
				<strong>Run and Debug → Debug: docs (server)</strong> does the same under the debugger and opens
				Chrome attached to it.
			</li>
			<li>
				<strong>Tasks: Run Test Task</strong> runs <code>bun run check</code>, which builds,
				type-checks, tests and runs publint. Errors appear in the Problems panel.
			</li>
			<li>
				<strong>Tasks: Run Task → build plugin</strong> rebuilds only the core plugin.
			</li>
		</ul>

		<!-- Change -->
		{@render h2('3. Make your changes', 'change')}
		{@render h3('Work on a branch')}
		<p>
			Click the branch name in the bottom-left of the status bar, choose
			<strong>Create new branch…</strong> and give it a short name such as
			<code>feat/drawer-end</code>.
		</p>
		{@render h3('Where things live')}
		<ul class="list-disc ps-6">
			<li>
				<code>packages/core</code>: the Tailwind plugin (components, themes, tokens, utilities)
			</li>
			<li>
				<code>packages/svelte</code>, <code>react</code>, <code>vue</code>: the framework bindings
			</li>
			<li><code>packages/docs</code>: this site</li>
		</ul>
		{@render h3('Add a changeset')}
		<p>
			Every change that a consumer will see needs a changeset. It records the version bump and the
			changelog entry. Run:
		</p>
		<CodeBlock code={changeset} lang="bash" />
		<p>
			Pick the bump (patch, minor or major) and write one line for the changelog. This creates a
			file in
			<code>.changeset/</code>; commit it with your change. The four published packages are
			versioned together, so it doesn't matter which one you select. The docs site is never
			published, so a docs-only change needs no changeset. Label its PR <code>skip-changeset</code> instead.
		</p>
		<p>
			Class names, <code>--theme-color-*</code> tokens, plugin options and cascade layer names are
			public API. Renaming or removing any of them is a <strong>major</strong> change. See
			<code>.github/CONTRIBUTING.md</code> for the full list.
		</p>
		{@render h3('Check before you commit')}
		<p>
			Run the <strong>check</strong> task. If the code formatting check fails, run
			<code>bun run format</code>.
		</p>

		<!-- Push -->
		{@render h2('4. Commit and push', 'push')}
		<ol class="list-decimal ps-6">
			<li>
				Open the <strong>Source Control</strong> view (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd
				>), stage your files with <strong>+</strong>, and write a message.
			</li>
			<li>
				Messages follow Conventional Commits:
				<code>type(scope): subject</code>, no more than 72 characters, with no capital at the start
				and no full stop at the end. The scope is one of <code>core</code>, <code>svelte</code>,
				<code>react</code>, <code>vue</code>, <code>docs</code>, <code>repo</code> or
				<code>deps</code>.
			</li>
		</ol>
		<CodeBlock code={commitExamples} lang="text" />
		<ol class="list-decimal ps-6" start="3">
			<li>
				Click <strong>Commit</strong>. Git hooks format and lint the staged files and check the
				message. If a hook rejects the commit, the reason is in the <strong>Output → Git</strong> panel.
			</li>
			<li>
				Click <strong>Publish Branch</strong> (or <strong>Sync Changes</strong> afterwards) to push.
			</li>
			<li>
				Open a pull request into <code>main</code>: run
				<strong>GitHub Pull Requests: Create Pull Request</strong> from the Command Palette, or use the
				link GitHub shows after the push. Fill in the template.
			</li>
		</ol>
		<p>
			Each pull request runs two checks. <strong>CI</strong> checks the commit messages, builds the
			packages, and runs lint and <code>bun run check</code>. <strong>Changeset</strong> fails if
			there is no changeset, unless the PR has the <code>skip-changeset</code> label. When both pass,
			merge the PR.
		</p>

		<!-- Release -->
		{@render h2('5. Release a new version', 'release')}
		<p>
			Releases go through Changesets and GitHub Actions; nothing is published from your machine.
		</p>
		<ol class="list-decimal ps-6">
			<li>
				When a change with a changeset lands on <code>main</code>, the <strong>Release</strong>
				workflow opens a pull request named <strong>chore: version packages</strong>, or updates the
				open one. It bumps the versions and writes the changelogs. Changesets from several PRs
				collect in this one PR until you merge it.
			</li>
			<li>
				When you're ready to ship, review that PR in the <strong>GitHub Pull Requests</strong> view and
				merge it.
			</li>
			<li>
				The merge runs <strong>Release</strong> again. This time it builds and verifies the packages,
				then publishes all four to npm with provenance and tags the release.
			</li>
		</ol>
		<p>
			If you want extra assurance before merging the version PR, rehearse the release locally. This
			packs every package, installs the tarballs into a scratch project and checks that they work:
		</p>
		<CodeBlock code={rehearse} lang="bash" />

		{@render h3('Deploying the docs site')}
		<p>
			The <strong>Docs</strong> workflow builds this site and deploys it to GitHub Pages. It runs
			automatically on every push to <code>main</code> that touches the docs, core or Svelte packages.
			To redeploy by hand, or to rerun a release:
		</p>
		<ol class="list-decimal ps-6">
			<li>Open the <strong>GitHub Actions</strong> view in the Activity Bar.</li>
			<li>
				Under <strong>Workflows</strong>, hover <strong>Docs</strong> (or <strong>Release</strong>).
			</li>
			<li>Click <strong>Run workflow</strong> and choose the <code>main</code> branch.</li>
		</ol>
		<p>
			The same view shows each run's progress and logs. When the Docs run finishes, the new site is
			live.
		</p>
	</div>
</DocPage>
