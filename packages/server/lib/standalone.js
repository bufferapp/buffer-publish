const fs = require('fs');
const { join } = require('path');
const https = require('https');
const express = require('express');
const cors = require('cors');

const basePath = join(__dirname, '..');

const paths = {
  standaloneEnv: join(basePath, 'standalone.env'),
  tempEnv: '/tmp/buffer-publish-standalone.env',
  certKey: join(
    basePath,
    '../../../reverseproxy/certs/local.buffer.com-wildcard.key'
  ),
  certCrt: join(
    basePath,
    '../../../reverseproxy/certs/local.buffer.com-wildcard.crt'
  ),
  certKeyGHActions: join(basePath, 'local.buffer.com-wildcard.key'),
  certCrtGHActions: join(basePath, 'local.buffer.com-wildcard.crt'),
  standaloneSession: join(basePath, 'standalone-session.json'),
  webpackAssets: join(basePath, '..', '..', 'dist'),
  webpackAssetsJson: join(basePath, '..', '..', 'dist', 'webpackAssets.json'),
};

function getBufferDevConfig() {
  try {
    const YAML = require('yaml'); // eslint-disable-line global-require
    return YAML.parse(
      fs.readFileSync(
        join(basePath, '../../../buffer-dev-config/config.yaml'),
        'utf8'
      )
    );
  } catch (e) {
    return null;
  }
}

/**
 * Returns config that is passed to `https.createServer`
 * This ensures that our HTTPS server can accept connections at:
 *   https://publish.buffer.com
 *
 * Checks for the certificates stored in buffer-dev-config first,
 * and if that fails (i.e., in CI/GitHub Action where that folder
 * won't exist) it looks for files of the same name in the server
 * folder. (Check the GitHub action workflow file:
 *  .github/actions/cypress.yml to see how we put those files there
 * at build time.)
 */
function getServerHttpsConfig() {
  try {
    return {
      key: fs.readFileSync(paths.certKey),
      cert: fs.readFileSync(paths.certCrt),
    };
  } catch (e) {
    return {
      key: fs.readFileSync(paths.certKeyGHActions),
      cert: fs.readFileSync(paths.certCrtGHActions),
    };
  }
}

/**
 * Read ENV vars from the `buffer-dev` config and combine
 * them with user defined env vars.
 */
function loadEnv() {
  const dotenv = require('dotenv'); // eslint-disable-line global-require

  // This only works locally and grabs any env vars we don't have
  // from the buffer-dev-config YAML file. In CI / GitHub Actions
  // we will prepopulate the environment vars and so this doesn't
  // need to run
  const config = getBufferDevConfig();
  if (config) {
    const envVars = config.services.publish.composeConfig.environment.join(
      '\n'
    );

    // Read any overrides
    const envOverrides = fs.readFileSync(paths.standaloneEnv, 'utf8');

    // Write the combined env vars
    fs.writeFileSync(paths.tempEnv, `${envVars}\n${envOverrides}`);

    // Load env
    dotenv.config({ path: paths.tempEnv });
  } else {
    // Just load the overrides, we're probably in GH actions and the env will be populated
    dotenv.config({ path: paths.standaloneEnv });
  }
}

/**
 * Create the publish server. We use `https` since it needs to directly accept HTTPS connections.
 * (There's no reverseproxy like when it's running with Docker.)
 *
 * @param {Express} app
 */
function createServer(app) {
  return https.createServer(getServerHttpsConfig(), app);
}

/**
 * Middleware that adds our static user session data to the server.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
function setStandaloneSessionMiddleware(req, res, next) {
  let standaloneSessionData;
  try {
    standaloneSessionData = JSON.parse(
      fs.readFileSync(paths.standaloneSession)
    );
  } catch (error) {
    console.log(
      `
🚧 Please ensure you have created a \`standalone-session.json\` file in the packages/server directory.
   For more details see the "Standalone Mode" section of the README.md.
`,
      error
    );
    process.exit();
  }
  req.session = standaloneSessionData;
  console.log(
    'Standalone session pub id:',
    standaloneSessionData.publish.foreignKey
  );
  return next();
}

const bootMessage = `
🚀  Publish is now running in Standalone Mode → https://publish.local.buffer.com`;

/**
 * Used for static assets mode, where JS / assets are loaded from a statically built
 * folder instead of webpack-dev-server. (Used in Cypress / Github Actions)
 */
function getStaticAssets() {
  // Load and return the `webpackAssets.json` which will be present after running `yarn run build:cypress`
  return JSON.parse(fs.readFileSync(paths.webpackAssetsJson, 'utf8'));
}

function serveStaticAssets() {
  const app = express();
  app.use(cors());
  app.use('/static', express.static(paths.webpackAssets));
  const staticAssetServer = createServer(app);
  staticAssetServer.listen(8080, () => {
    console.log('Static asset server listening on port 8080');
  });
}

module.exports = {
  loadEnv,
  createServer,
  setStandaloneSessionMiddleware,
  bootMessage,
  getStaticAssets,
  serveStaticAssets,
};
