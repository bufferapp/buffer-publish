const { method, createError } = require('@bufferapp/buffer-rpc');
const rp = require('request-promise');
const { SEGMENT_NAMES } = require('./../../constants');

const sourceCtaMap = new Map([
  ['ig_first_comment', SEGMENT_NAMES.IG_FIRST_COMMENT_PRO_TRIAL],
  ['queue_limit', SEGMENT_NAMES.QUEUE_LIMIT_PRO_TRIAL],
]);
const getCtaFromSource = source =>
  sourceCtaMap.get(source) || null;

module.exports = method(
  'startTrial',
  'start trial',
  ({ source, plan = 'pro' }, { session }) =>
    rp({
      uri: `${process.env.API_ADDR}/1/billing/start-trial.json`,
      method: 'POST',
      strictSSL: !(process.env.NODE_ENV === 'development'),
      qs: {
        access_token: session.publish.accessToken,
        product: 'publish',
        plan,
        cycle: 'month',
        cta: getCtaFromSource(source),
      },
    })
    .then(result => JSON.parse(result))
    .catch((err) => {
      if (err.error) {
        const { error } = JSON.parse(err.error);
        throw createError({ message: error });
      }
    }),
  );
