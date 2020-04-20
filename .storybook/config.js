import "core-js/stable";
import "regenerator-runtime/runtime";
import { configure } from '@storybook/react';
/**
 * `__PACKAGES__` below is dynamically pulled from the environment
 * via the custom webpack config, allowing us to run storybook on
 * a specific package in new publish.
 *
 * e.g.,
 *
 *   $ PACKAGE=shared-components yarn run storybook
 *
 */

function loadStories() {
	// Add all story.jsx files inside components directories except for the ones in node_modules
	const req = require.context(__PACKAGES__, true, /^((?![\\/]node_modules[\\/]).)*components\/.*\/*(story|story_test)\.jsx$/);
	req.keys().forEach(filename => req(filename));
}
configure(loadStories, module);
