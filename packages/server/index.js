/**
 * Add Datadog APM in production
 */
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  // This line must come before importing any instrumented module.
  require('dd-trace').init({ // eslint-disable-line
    env: 'production',
    hostname: process.env.DD_AGENT_HOST,
    port: 8126,
  });
}

const http = require('http');
const express = require('express');
const logMiddleware = require('@bufferapp/logger/middleware');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const { join } = require('path');
const shutdownHelper = require('@bufferapp/shutdown-helper');
const {
  setRequestSessionMiddleware,
  validateSessionMiddleware,
} = require('@bufferapp/session-manager');
const bufferMetricsMiddleware = require('@bufferapp/buffermetrics/middleware');
const { errorMiddleware } = require('@bufferapp/buffer-rpc');
const serialize = require('serialize-javascript');
const multer = require('multer');
const helmet = require('helmet');

const { apiError } = require('./middleware');
const controller = require('./lib/controller');
const rpcHandler = require('./rpc');
const checkToken = require('./rpc/checkToken');
const userMethod = require('./rpc/user/index');
const pusher = require('./lib/pusher');
const maintenanceHandler = require('./maintenanceHandler');
const { getFaviconCode, setupFaviconRoutes } = require('./lib/favicon');
const { getBugsnagClient, getBugsnagScript } = require('./lib/bugsnag');

const app = express();
const server = http.createServer(app);
const multiBodyParser = multer();
const composerAjaxBuffemetrics = require('./lib/composerAjaxBuffermetrics');
const verifyAccessToken = require('./middlewares/verifyAccessToken');

let segmentKey = 'qsP2UfgODyoJB3px9SDkGX5I6wDtdQ6a';
// Favicon
setupFaviconRoutes(app, isProduction);

let staticAssets = {
  'bundle.js': 'https://local.buffer.com:8080/static/bundle.js',
  'bundle.css': 'https://local.buffer.com:8080/static/bundle.css',
  'vendor.js': 'https://local.buffer.com:8080/static/vendor.js',
};

app.set('isProduction', isProduction);

if (isProduction) {
  staticAssets = JSON.parse(
    fs.readFileSync(join(__dirname, 'staticAssets.json'), 'utf8')
  );
  segmentKey = '9Plsiyvw9NEgXEN7eSBwiAGlHD3DHp0A';
  // Ensure that static assets is not empty
  if (Object.keys(staticAssets).length === 0) {
    console.log('Failed loading static assets manifest file - File is empty'); // eslint-disable-line
    process.exit(1);
  }
  /**
   * Add Bugsnag to app (see `middleware.js` for where this is used)
   */
  app.set('bugsnag', getBugsnagClient());
}

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE;

/**
 * Generate a script to pass basic user info to our React app
 *
 * @param {String} user
 */
const getUserScript = user => `
<script type="text/javascript">
  window._user = ${JSON.stringify(user)};
</script>
`;

const notificationScript = notification => {
  if (!notification) {
    return '';
  }

  let variable = '';

  if (notification.variable) {
    variable = `variable: ${serialize(notification.variable, {
      isJSON: true,
    })}`;
  }

  return `
    <script type="text/javascript">
        window._notification = {
          type: ${serialize(notification.type, { isJSON: true })},
          key: ${serialize(notification.key, { isJSON: true })},
          ${variable}
        };
    </script>
  `;
};

const showModalScript = (key, val) => {
  if (!key) {
    return '';
  }

  let value = '';

  if (val) {
    value = `value: ${serialize(val, { isJSON: true })}`;
  }

  return `
    <script type="text/javascript">
        window._showModal = {
          key: ${serialize(key, { isJSON: true })},
          ${value}
        };
    </script>
  `;
};

const stripeScript = `
  <script id="stripe-js" src="https://js.stripe.com/v3/" async></script>
  <script type="text/javascript">
    window.STRIPE_PUBLISHABLE_KEY = '${stripePublishableKey}';
  </script>
`;

const appcuesScript = '<script id="appcues-js" src="//fast.appcues.com/49463.js" async></script>';

const fullStoryScript = `<script>
window['_fs_debug'] = false;
window['_fs_host'] = 'fullstory.com';
window['_fs_org'] = '9F6GW';
window['_fs_namespace'] = 'FS';
(function(m,n,e,t,l,o,g,y){
  if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
  g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];
  o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
  y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
  g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};
  g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
  g.clearUserCookie=function(c,d,i){if(!c || document.cookie.match('fs_uid=[\`;\`]*\`[\`;\`]*\`[\`;\`]*\`')){
  d=n.domain;while(1){n.cookie='fs_uid=;domain='+d+
  ';path=/;expires='+new Date(0).toUTCString();i=d.indexOf('.');if(i<0)break;d=d.slice(i+1)}}};
})(window,document,window['_fs_namespace'],'script','user');
</script>`;

const intercomScript = `
<script>
(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${
  isProduction ? 'jv1br1uf' : 'yfr605bq'
}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
</script>
`;

const helpScoutScript = `
<script>
    !function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});
</script>
`;

const segmentScript = `<script>
      window.PRODUCT_TRACKING_KEY = 'publish';
      window.CLIENT_NAME = 'publishWeb';
      !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
        analytics.load("${segmentKey}");
      }}();
    </script>`;

const iterateScript = `<script>
    window.iterateSettings = {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiNWQ1ZjIxMzUxMzU5ZDMwMDAxMDE3N2IxIiwiaWF0IjoxNTY2NTE1NTA5fQ.UPeBAlcqV4aZQ_rJxRIkYWpNC1nDS24O1MG4WIEuuUg'
    };
    (function(i,t,e,r,a){if(t.getElementById(r))
    {return}
    i.IterateObjectName=a;var z=function()
    {z.c(arguments)};
    z.q=[];z.c=function(args){z.q.push(args)};i[a]=z;var js,fjs=t.getElementsByTagName(e)[0];
    function l() {js=t.createElement(e);js.id=r;js.async=1;js.src="https://platform.iteratehq.com/loader.js";fjs.parentNode.insertBefore(js,fjs)}; if(t.readyState==="complete") {l();} else 
    if(i.attachEvent) {i.attachEvent('onload', l);} else{i.addEventListener('load', l, false);}}(window, document,'script','iterate-js','Iterate'));
  </script>`;

const getUserData = ({ userData }) => {
  if (typeof userData === 'undefined') {
    return '';
  }

  return `<script>try { window.bufferUser = ${JSON.stringify(userData)}; } catch(e) {}</script>`;
};

const getFullstory = ({ includeFullstory }) => {
  const includedFullstoryScript = includeFullstory ? fullStoryScript : '';
  return isProduction ? includedFullstoryScript : '';
};

const getBugsnag = ({ userId }) => {
  return isProduction ? getBugsnagScript(userId) : '';
};

// We are hard coding the planCode check to 1 for free users, but if we need more we should import constants instead
const canIncludeFullstory = user => (user ? user.planCode !== 1 : true);

const getHtml = ({
  notification,
  userId,
  modalKey,
  modalValue,
  userData,
  includeFullstory = true,
}) => {
  return fs
    .readFileSync(join(__dirname, 'index.html'), 'utf8')
    .replace('{{{vendor}}}', staticAssets['vendor.js'])
    .replace('{{{bundle}}}', staticAssets['bundle.js'])
    .replace('{{{bundle-css}}}', staticAssets['bundle.css'])
    .replace('{{{stripeScript}}}', stripeScript)
    .replace('{{{fullStoryScript}}}', getFullstory({ includeFullstory }))
    .replace('{{{bugsnagScript}}}', getBugsnag({ userId }))
    .replace('{{{notificationScript}}}', notificationScript(notification))
    .replace('{{{showModalScript}}}', showModalScript(modalKey, modalValue))
    .replace('{{{appcues}}}', isProduction ? appcuesScript : '')
    .replace('{{{intercomScript}}}', intercomScript)
    .replace('{{{iterateScript}}}', isProduction ? iterateScript : '')
    .replace('{{{helpScoutScript}}}', helpScoutScript)
    .replace('{{{userScript}}}', getUserScript({ id: userId }))
    .replace('{{{favicon}}}', getFaviconCode({ cacheBust: 'v1' }))
    .replace('{{{segmentScript}}}', segmentScript)
    .replace('{{{bufferUser}}}', getUserData({ userData }));
};

app.use(logMiddleware({ name: 'BufferPublish' }));
app.use(cookieParser());
app.use(helmet.frameguard({ action: 'sameorigin' }));

app.all('/maintenance', maintenanceHandler);

// All routes after this have access to the user session
app.use('*', (req, res, next) => {
  const analyzeApiAddr =
    req.get('ANALYZE-API-ADDR') || process.env.ANALYZE_API_ADDR;
  app.set('analyzeApiAddr', analyzeApiAddr);
  next();
});

app.use(bodyParser.json());

app.use(
  bufferMetricsMiddleware({
    name: 'Buffer-Publish',
    debug: !isProduction,
    trackVisits: true,
  })
);

app.use(
  setRequestSessionMiddleware({
    production: isProduction,
    sessionKeys: ['publish', 'global'],
  })
);

app.post('/rpc', checkToken, rpcHandler, errorMiddleware);

/**
 * The composer expects this URL to exist and accept
 * metrics data. It does on buffer-web, but not here
 * in publish, so we create it here.
 */
app.post(
  '/ajax/buffermetrics',
  // needed to parse the multipart FormData
  multiBodyParser.fields([]),
  composerAjaxBuffemetrics
);

app.get('/health-check', controller.healthCheck);

// make sure we have a valid session
app.use(
  validateSessionMiddleware({
    production: isProduction,
    requiredSessionKeys: ['publish.accessToken', 'publish.foreignKey'],
  })
);

app.use(verifyAccessToken);

// Pusher Auth
app.post(
  '/pusher/auth',
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
  }
);

const getNotificationFromQuery = query => {
  let notification = null;
  if (query.nt && query.nk) {
    notification = {
      type: query.nt, // Notification Type
      key: query.nk, // Notification Key
    };
    if (query.nv) {
      notification.variable = query.nv; // Notification Variable
    }
  }
  return notification;
};

app.get('*', (req, res) => {
  const notification = getNotificationFromQuery(req.query);
  const userId = req.session.publish.foreignKey;
  const modalKey = req.query.mk ? req.query.mk : null;
  const modalValue = req.query.mv ? req.query.mv : null;

  userMethod
    .fn(null, req, res)
    .catch(() => {
      return undefined;
    })
    .then(user => {
      res.send(
        getHtml({
          notification,
          userId,
          modalKey,
          modalValue,
          userData: user,
          includeFullstory: canIncludeFullstory(user),
        })
      );
    });
});

app.use(apiError);

server.listen(80, () => console.log('listening on port 80')); // eslint-disable-line

shutdownHelper.init({ server });
