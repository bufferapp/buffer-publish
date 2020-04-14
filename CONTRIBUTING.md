# Contributing 🚀
🎉 Thank you for your contribution! 🎉
Here are some guidelines to make it as easy and clear as possible.

## Table of contents
- [Pull Requests ](#pull-requests)
- [Coding Styleguide 💻](#coding-styleguide-💻)
  - [Prettier 💁‍♀️](#prettier-💁‍♀️)
  - [Components Styleguide](#components-styleguide)
- [Adding New Dependencies](#adding-new-dependencies)
- [How Packages Communicate 📦](#how-packages-communicate-📦)
- [Styling Styleguide 💅](#styling-styleguide-💅)
- [Working on RPCs](#working-on-rpcs)
- [Testing 🧪](#testing-🧪)
- [Reporting bugs 🐛](#reporting-bugs-🐛)

## Pull Requests
Please follow the steps for your contribution:
1. Fork the repo and create your branch from `master`.
2. Follow the [coding styleguide](#coding-style)
3. If you've added code that should be tested, add tests.
4. Ensure the test suite passes.
    <details>
    <summary>What if the status checks are failing?</summary>
    <p>

    If `continuous-integration/travis-ci/push` is failing, you can try updating the snapshots file by running the following command and committing the resulting snapshot file:
    ```bash
    # from buffer-publish
    $ yarn run test-update
    ```
    If it's still failing and you are unsure on how to fix it, please leave a comment on the pull request indicating it.
    </p>
    </details>
5. After submitting your pull request, verify that all status checks are passing.

## Coding Styleguide 💻

### Prettier 💁‍♀️
We use Prettier for our code styling, and the easiest way to work with it is by installing Prettier as a plugin in the IDE of your choice, however, you can also make sure your coding format is in place with the following commands:

```bash
# To check the format
$ prettier --check "packages/your-package/**/*.+(jsx|js)"

# To run prettier in your package
$ prettier --write "packages/your-package/**/*.+(jsx|js)"
```

### Components Styleguide

**Creating a Component**

For new components, use [Functional Components](https://reactjs.org/docs/components-and-props.html) over [Class Components](https://reactjs.org/docs/react-component.html)

```js
// Functional component
const Welcome = ({name}) => <h1>Hello, {name}</h1>

// Class component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

---

**How to create a new component**

🎬 See this video http://hi.buffer.com/5be7a08fc7fc

**In a nutshell:**

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

**Component PropTypes and DefaultProps**
Avoid using defaultProps for anything that's a required prop.

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

## How Packages Communicate 📦

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

## Styling Styleguide 💅
For our styling we use [styled-components](https://styled-components.com/), an example for a styled component:

```js
const Title = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  flex-direction: row;
`;

<Title>Example</Title>
```

## Working with RPCs
Refer to this [Notion](https://threads.com/34376693228) for more details on how to use the newest technique when working on RPCs.

## Testing 🧪

### Testing in Publish

1. You can trigger a test in watch mode if you are working on a specific file or package:

```bash
$ yarn run test-package <path-to-package>

# testing a specific file in watch mode
$ yarn run test-package ./packages/modals/reducer.test.js
```

2. You can also test with `jest` directly:

```bash
$ yarn run jest <path-to-package>

# testing a specific file
$ yarn run jest ./packages/modals/reducer.test.js
```

### Debugging 🕵️‍♂️

To use the `yarn test:debug` script, follow these instructions:
1. Add a `debugger` statement near the failing line in your test.
2. Type `chrome://inspect` in your chrome browser address bar.
3. Click on "Open dedicated DevTools for Node".
4. In your terminal run `yarn test:debug <path to test>`
5. Visit the inspector you opened up, you should see that the debugger has been triggered and the app has paused near the line that is failing.

## Reporting bugs 🐛
To report bugs, please feel free to add them in [JIRA](https://buffer.atlassian.net/secure/RapidBoard.jspa?projectKey=PUB)

