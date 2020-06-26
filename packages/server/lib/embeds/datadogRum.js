/**
 * Datadog Real User Monitoring (RUM)
 * https://docs.datadoghq.com/real_user_monitoring/
 */
const applicationId = process.env.DD_RUM_APP_ID;
const clientToken = process.env.DD_RUM_CLIENT_TOKEN;

const ddRumScript = `
<script src="https://www.datadoghq-browser-agent.com/datadog-rum-us.js"></script>
<script>
  window.DD_RUM && window.DD_RUM.init({
    applicationId: '${applicationId}',
    clientToken: '${clientToken}',
    datacenter: 'us',
    resourceSampleRate: 5,
    sampleRate: 5
  });
</script>
`;

/**
 * Only embed in production, non-standalone mode
 */
module.exports = ({ isProduction, isStandalone }) =>
  isProduction && !isStandalone ? ddRumScript : '';
