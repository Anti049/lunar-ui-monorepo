export default {
	extends: ['@commitlint/config-conventional'],
	// Dependabot bodies paste release notes with lines far over 100 characters.
	ignores: [(message) => message.includes('Signed-off-by: dependabot[bot]')],
	rules: {
		'scope-enum': [2, 'always', ['core', 'svelte', 'react', 'vue', 'docs', 'repo', 'deps']],
		'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
		'header-max-length': [2, 'always', 72],
		'body-max-line-length': [2, 'always', 100]
	}
};
