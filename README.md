<p align="middle"><h1 align="center"> Buffer Publish </h1></p>
<p align="center" style="padding-top: -100px;">
  <a href="https://buffer.com/">
    <img src="https://rawgit.com/bufferapp/buffer-publish/master/logo.png" width="250" alt="Buffer Publish">
  </a>
</p>

[![Build Status](https://travis-ci.org/bufferapp/buffer-publish.svg?branch=master)](https://travis-ci.org/bufferapp/buffer-publish)

Welcome to the Buffer Publish monorepo.
<p>—<br><em>Formerly Project Donut</em>&nbsp; 🍩</p>

## Table of contents

- [What is Buffer Publish?](#what-is-buffer-publish)
- [Quick Start](#quick-start)
- [The Publish Server](#the-publish-server)
- [Yarn Workspaces](#yarn-workspaces)
- [Publishing Packages](#publishing-packages)
- [Adding new Packages](#adding-new-packages)
- [Package Scripts](#package-scripts)
- [Adding New Dependencies](#adding-new-dependencies)
- [How Packages Communicate](#how-packages-communicate)
- [External Packages](#external-packages)
- [Standalone Mode](#standalone-mode) 🆕

## What is Buffer Publish?

<img src="https://rawgit.com/bufferapp/buffer-publish/master/screenshot.png">

Buffer Publish is [Buffer](https://buffer.com)'s new dashboard with a focus on one thing; **managing and publishing content on your social accounts.** It's a redesign and refresh of the current Buffer dashboard, both in appearance and front-end architecture.

Buffer Publish is being actively developed right now! This code is open source for any and all to see and learn from — see our [copyright](#copyright) below for more details.

If you have any questions feel free to [create an issue](https://github.com/bufferapp/buffer-publish/issues/new) or Tweet us [@bufferdevs](https://twitter.com/bufferdevs). We'd love to chat!

⚠️  **Important Note**: While you can pull this code down freely, it won't work correctly without some key components (including our API) which are not open source.

## Quick Start

To get started on local development and testing:

1. **Get your `buffer-dev` environment setup**
  → https://github.com/bufferapp/buffer-dev

2. **Install the latest version of `yarn`**
  → [Installing Yarn](https://yarnpkg.com/en/docs/install)

3. **Make sure you have node with version >= 12**
    ```
    $ node -v
    ```

4. **Install Dependencies**
    ```bash
    $ cd ~/buffer-dev/buffer-publish  # Or wherever yours is located
    $ yarn
   ```

5. **Start up the publish docker containers**
    ```bash
    $ cd ../buffer-dev
    $ ./dev up publish
   ```

6. **Start bundling the frontend with webpack**
    ```bash
    # in buffer-publish/
    $ yarn run watch
   ```

7. **Give yourself the correct feature flip**
  In order to view Buffer Publish your user (usually admin@bufferapp.com for local dev)
 must have the _New Buffer Publish_ feature flip. Otherwise you'll just get redirected back to classic Buffer. To add the feature visit https://local.buffer.com/admin and browse to the _My Account_ page.

   If you don't have the feature flip available, then you should probably pull down all the feature flips from production first:
   ```bash
   # in ~/buffer-dev
   $ ./dev sync features
   ```
8. You should now be able to visit https://publish.local.buffer.com — party time! 🎉 🙌

### Troubleshooting Dev Environment Issues

If after running the `./dev up` command you get an error specifying Publish was not able to start, try running the `doctor` tool:

```bash
# in ~/buffer-dev
$ ./dev doctor
```
  
That will generate a doctor.txt file in your `~/buffer-dev` directory, you can send the generated file in **#eng-local-dev** Slack channel to ask for help!

## The Publish Server

When you run the `./dev up` command from the [quick start](#quick-start) it spins up a number of containers on which Publish depends. It also spins up the `publish` container itself, which is [an Express server](/packages/server/index.js) with two purposes:

1. **Serve [`index.html`](/packages/server/index.html) for all requests to https://publish.local.buffer.com**
3. **Provide an `/rpc/**` endpoint/proxy** for making API calls in the front-end

## Yarn Workspaces

Buffer Publish is a _monorepo_. That means it's composed of several separate parts, or _packages._ (You can take a look at these packages in the [`/packages` directory](/packages)) These are essentially the same as packages on npm. We use `yarn workspaces` to make this magic possible. 🎩.  (_And if you're confused by this at all, skimming their [README](https://yarnpkg.com/en/docs/workspaces) files should help!_)

## ~~Publishing Packages~~

No need to publish local packages anymore for deployments 🎉

## Adding new Packages

🎬 See this video http://hi.buffer.com/5be7a08fc7fc

In a nutshell:

1. **Copy the `packages/example` folder.**
```bash
# from buffer-publish
$ cp packages/example packages/your-new-package
```
The name of the folder is up to you, what's more important is the name of package (in it's `package.json`).

2. **Update `package.json`**
    * Change the name, author, version (always `2.0.0` for local packages), and description.
    * You can remove all the `"dependencies"` for now, and add them as you need them.

3. **Update `README.md`**
    * Delete all the text here and just have a heading with your package name and a short description. This is also a great place to document how your package works, and how it can be used/consumed.

4. **Cleanup:** 
    * Delete the `node_modules` and `coverage` folders that came from copying `/example`.

5. Not all packages have to export a component (see for example the `maintenance-redirect` package.)
    * This is where you'll start to make changes and add things based on the needs of your package.
    * Look at other packages for examples!

6. **Connect reducer and/or middleware**
    * If you have a reducer and/or middleware - don't forget to link those up in `packages/store/index.js` and `packages/store/reducers.js`.

7. **Run `yarn`**
    * Do this when you're customizing your package, and  whenever you change the dependencies in your package or another.

## Package Scripts

We have a few helpful commands defined in this project's `package.json`.

| Command | Description |
|--|--|
| `yarn`  | This goes through all packages, installs dependencies and links local packages together! ✨ |
| `yarn run clean`  | Deletes all `node_modules` from all packages. Use this first if you see any odd dependency errors and then follow with `yarn`. |
| `yarn run test`  | Runs `yarn test` on all packages. |
| `yarn run test-update`  | Runs `yarn run test-update` on all packages to update all snapshot tests. |
| 🆕 `yarn run test-package <path-to-package>`  | Start watching tests in coverage for a specific package directory. [Learn more](https://github.com/bufferapp/buffer-publish/pull/624). |
`yarn test:debug <path to test>` | Runs `"node --inspect node_modules/.bin/jest --runInBand"` with the test you specify.
| `yarn run start`  | Starts up the Publish Express server, [as explained above](#the-publish-server), and is run automatically when you start Publish with `./dev up`. (So in most cases you won't be running this command.) |

## Adding New Dependencies

Adding packages to a monorepo is slightly different than adding to a standard node package. Common `devDependencies` can be added to the top level `package.json` file.

### Adding A Common Dependencies

This is the most likely scenario you'll face.

in the root directory (`buffer-publish/`) run the follwing commands:

  ```bash
  $ yarn add -DE some-cool-package
  $ yarn
  ```
  Now `some-cool-package` is available to all packages.

### Creating A Dependency To Another Local Package

|⚠️  &nbsp;**Important**|
|--|
|Please use 2.0.0 for local package versions moving forward. Using a different version will not break anything (as long as the versions match), but it will be easier to spot local packages in dependencies.|

To create a dependency to the login package from the example package:

In the `example` package add the following entry in the `packages/example/package.json` file under the dependencies key:

```js
{
  //...other stuff...
  dependencies:{
    //...other dependencies...
    "@bufferapp/login": "2.0.0", // this version must be exact otherwise it fetches from npm!
  }
}
```
|⚠️  &nbsp;**Important**|
|--|
|The version number must be **exact** to link local packages, otherwise it will (try to) fetch the package from npm.|


### Add A Dependency That Runs A Binary

An example of this would be `eslint` or `jest`. These should be added to the individual package:

```sh
cd packages/example/
yarn add -DE jest
```

## How Packages Communicate

At a high level each package communicates using the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) through the Redux store. This means that each package receives all events and decides whether to modify their own state or ignore the event. An event (or action) flows from the originator to all other packages (including itself):


```
Package-A ---action--->Redux Store--->Package-B
  ^                             |
  |-----------------------------|---->Package-C
```

If you need to listen to another packages events, import the actionTypes into the package you're building:


```js
// handle app initialized
export default (state, action) => {
  switch (action.type) {
    case 'APP_INIT':
      return {
        ...state,
        initialized: true,
      };
    default:
      return state;
  }
};
```
## Testing

### Debugging

To use the `yarn test:debug` script, follow these instructions:
1. Add a `debugger` statement near the failing line in your test.
2. Type `chrome://inspect` in your chrome browser address bar.
3. Click on "Open dedicated DevTools for Node".
4. In your terminal run `yarn test:debug <path to test>`
5. Visit the inspector you opened up, you should see that the debugger has been triggered and the app has paused near the line that is failing.

## External Packages

These are packages that have been moved outside of the Publish application.

### Notifications

https://github.com/bufferapp/buffer-js-notifications


Notification display system

### App Sidebar

https://github.com/bufferapp/buffer-js-app-sidebar

Sidebar to navigate between applications

### Publish Parsers

https://github.com/bufferapp/buffer-js-publish-parsers

Data parsing functions for the Publish application

### Unauthorized Redirect

https://github.com/bufferapp/buffer-js-unauthorized-redirect

Redux middleware to redirect 401 - unauthorized requests back to `Login`

### Async Data Fetch

https://github.com/bufferapp/buffer-js-async-data-fetch

Redux middleware for making requests and managing request life-cycles

### Environment

https://github.com/bufferapp/buffer-js-environment

Redux middleware for fetching the environment from the backend

## Standalone Mode

In standalone mode Publish runs directly on your machine, no `buffer-dev` or Docker containers required. 
User authentication is bypassed (see below) and all requests are sent directly to the production Publish API.

Some caveats:

  * Only Publish is running; so no connecting social accounts, visiting Classic, or using services / APIs (i.e., Account, Login, Analyze, etc.)
  * Depends on correct Node setup locally (though we already bundle outside the container - so this shouldn't be a problem)
  * Other `buffer-dev` services cannot be running at the same time

### Configuration

#### Authentication

When running in standalone mode Publish requires a `standalone-session.json` file to be present in the `packages/server` 
directory. This file is a static representation of your logged in user/session.

To generate this file for your own user (or for another user) visit the Buffer Admin and look for the _"Download Standalone Session JSON"_ link.

#### Environment Variables

The standalone server will automatically pull the environment vars from the [buffer-dev publish config](https://github.com/bufferapp/buffer-dev-config/blob/655827f8f9098a212e25bd91dded209aa9d6ae4c/config.yaml#L413). You can override any of those or add new ones by modifying the [`standalone.env` file in `packages/server`](/packages/server/standalone.env). 
Right now it's used only to point to the external facing Publish API.

### Starting

Once you have created your configuration file, you're ready to start standalone mode. 

First ensure you have stopped `buffer-dev`, if it's running.

```bash
# in buffer-dev
./dev stop
```

Now, start the standalone Publish server.

```bash
# in buffer-publish
yarn run start:standalone
```

You should also ensure that you are watching/bundling the React app, as usual:

```bash
# in buffer-publish
yarn run watch
```

## Copyright

© 2020 Buffer Inc.

This project is open source as a way to transparently share our work with the
community for the purpose of creating opportunities for learning. Buffer
retains all rights to the code in this repository and no one may reproduce,
distribute, or create derivative works from this.
