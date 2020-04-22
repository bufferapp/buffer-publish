const fs = require('fs');
const { join } = require('path');
const https = require('https');

const basePath = join(__dirname, '..');

const paths = {
  standaloneEnv: join(basePath, 'standalone', 'standalone.env'),
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
  standaloneSession: join(basePath, 'standalone', 'standalone-session.json'),
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
  // from the buffer-dev-config YAML file
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
    // Just load the overrides, we're probably running in CI / GitHub actions
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
    // eslint-disable-next-line
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
  return next();
}

const dim = '\033[2m';
const reset = '\033[0m';
const bootMessage = `
🚀  Publish is now running in Standalone Mode 
   → https://publish.local.buffer.com
   ${dim}- Don't forget: \`yarn run watch\` in another terminal tab.${reset}`;

module.exports = {
  loadEnv,
  createServer,
  setStandaloneSessionMiddleware,
  bootMessage,
};
