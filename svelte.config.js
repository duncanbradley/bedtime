import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
        appDir: 'app', // Required as the default is _app
        adapter: adapter(),
		paths: {
			base: dev ? '' : process.env.BASE_PATH,
		}
    },
    preprocess: vitePreprocess()
};

export default config;
