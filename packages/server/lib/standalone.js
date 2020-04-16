const fs = require('fs');
const { join } = require('path');
const https = require('https');

const basePath = join(__dirname, '..');
const paths = {
  bufferDevConfig: join(basePath, '../../../buffer-dev-config/config.yaml'),
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
  standaloneSession: join(basePath, 'standalone-session.json'),
};

/**
 * Read ENV vars from the `buffer-dev` config and combine
 * them with user defined env vars.
 */
function loadEnv() {
  const YAML = require('yaml'); // eslint-disable-line global-require
  const dotenv = require('dotenv'); // eslint-disable-line global-require

  const config = YAML.parse(fs.readFileSync(paths.bufferDevConfig, 'utf8'));
  const envVars = config.services.publish.composeConfig.environment.join('\n');

  // Read any overrides
  const envOverrides = fs.readFileSync(paths.standaloneEnv, 'utf8');

  // Write the combined env vars
  fs.writeFileSync(paths.tempEnv, `${envVars}\n${envOverrides}`);

  // Load env
  dotenv.config({ path: paths.tempEnv });
}

/**
 * Create the publish server. We use `https` since it needs to directly accept HTTPS connections.
 * (There's no reverseproxy like when it's running with Docker.)
 *
 * @param {Express} app
 */
function createServer(app) {
  return https.createServer(
    {
      key: fs.readFileSync(paths.certKey),
      cert: fs.readFileSync(paths.certCrt),
    },
    app
  );
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
  return next();
}

const bootMessage = `
🚀  Publish is now running in Standalone Mode (https://publish.local.buffer.com)
     
Don't forget to do: 
  yarn run watch
`;

module.exports = {
  loadEnv,
  createServer,
  setStandaloneSessionMiddleware,
  bootMessage,
};
