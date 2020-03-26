import moment from 'moment-timezone';

export const getReadableDateFormat = ({
  uses24hTime,
  scheduledAt,
  timezone,
}) => {
  const date = new Date(scheduledAt * 1000);
  const scheduledAtMoment = moment.tz(date, timezone);
  const readableFormat = uses24hTime ? 'MMM D, H:mm' : 'MMM D, h:mm A';
  return scheduledAtMoment.format(readableFormat);
};

export const getMomentTime = ({ scheduledAt, timezone }) => {
  const scheduledAtTime = scheduledAt || Date.now();
  let scheduledAtMoment = moment.unix(scheduledAtTime);
  if (timezone) {
    scheduledAtMoment = scheduledAtMoment.tz(timezone);
  }
  return scheduledAtMoment;
};

export const getTodayTimestamp = ({ timezone }) => {
  const todayDate = new Date().setSeconds(0);
  const isTimezoneSet = !!timezone;
  const today = isTimezoneSet
    ? moment.tz(todayDate, timezone)
    : moment(todayDate);
  return today
    .clone()
    .add(1, 'hours')
    .unix();
};
