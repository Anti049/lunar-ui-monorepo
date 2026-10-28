export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'scope-enum': [2, 'always', ['core', 'svelte', 'react', 'vue', 'docs', 'repo', 'deps']],
		'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
		'header-max-length': [2, 'always', 72],
		'body-max-line-length': [2, 'always', 100]
	}
};
