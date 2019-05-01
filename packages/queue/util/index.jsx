import React from 'react';
import moment from 'moment-timezone';

/**
 * Return an object containing details about daily slots based on the
 * profile's schedules.
 *
 * @param {array} schedules
 */
export const getDailySlotsFromProfileSchedules = (schedules) => {
  // todo: consider pausedSchedules

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  // Map day values from schedule to their integer identity
  const dayMap = days.reduce((obj, day, index) => {
    obj[day] = index;
    return obj;
  }, {});

  // Create an empty array for each day of the week that we
  // will fill with the schedule data later
  const empty = days.reduce((obj, day, index) => {
    obj[index] = [];
    return obj;
  }, []);

  // Simplify the schedule structure, filling in our `empty` array
  const combinedSchedules = schedules.reduce((combined, schedule) => {
    schedule.days.forEach((day) => {
      const dayIndex = dayMap[day];
      const combinedTimes = combined[dayIndex].concat(schedule.times);
      const uniqueTimes = [...new Set(combinedTimes)]; // removes duplicates
      combined[dayIndex] = uniqueTimes;
    });
    return combined;
  }, empty);

  return combinedSchedules;
};

/**
 * Matches `getDay()` logic in `buffer-web/blob/master/shared/models/update_model.php`.
 */
export const getDayString = (profileTimezone, dateMoment, now = null) => {
  if (now === null) {
    now = moment.tz(profileTimezone);
  }
  const todayRange = [
    moment(now).startOf('day'),
    moment(now).endOf('day'),
  ];
  const tomorrowRange = [
    moment(now).clone().add(1, 'day').startOf('day'),
    moment(now).clone().add(1, 'day').endOf('day'),
  ];
  const isSameYear = dateMoment.format('YYYY') === now.format('YYYY');

  let dayOfWeek = '';
  let text = null;
  if (dateMoment >= todayRange[0] && dateMoment < todayRange[1]) {
    dayOfWeek = 'Today';
    text = dayOfWeek;
  } else if (dateMoment >= tomorrowRange[0] && dateMoment < tomorrowRange[1]) {
    dayOfWeek = 'Tomorrow';
    text = dayOfWeek;
  } else {
    dayOfWeek = dateMoment.format('dddd');
  }

  return {
    dayOfWeek,
    date: dateMoment.format(`MMMM D${isSameYear ? '' : ' YYYY'}`),
    text: text || dateMoment.format(`dddd Do MMMM${isSameYear ? '' : ' YYYY'}`),
  };
};

/**
 * Returns a list of days to show in the queue based on the users settings.
 */
export const getDaysForUpcomingWeeks = ({
  profileTimezone,
  weekStartsOnMonday,
  numWeeks,
  now = null,
}) => {
  if (now === null) {
    now = moment.tz(profileTimezone);
  }
  const currentDay = now.day();
  let daysUntilEndOfWeek = (7 - currentDay);
  if (weekStartsOnMonday) {
    daysUntilEndOfWeek += 1;
  }
  const daysToShow = daysUntilEndOfWeek + (numWeeks * 7);
  const rangeOfDays = [...Array(daysToShow).keys()];

  const days = rangeOfDays.map((increment) => {
    const dateMoment = now.clone()
      .add(increment, 'days')
      .set({ hour: 0, minute: 0, second: 0 });
    const { text, date, dayOfWeek } = getDayString(profileTimezone, dateMoment, now);
    const dayIndex = dateMoment.day();
    return { text, date, dayOfWeek, dayIndex, dayUnixTime: dateMoment.unix() };
  });

  return days;
};

/**
 * Returns slots with unix timestamps and labels for the given day
 */
export const getSlotsWithTimestampsForDay = ({
  profileTimezone,
  hasTwentyFourHourTimeFormat,
  dailySlots,
  now,
  day: { text: dayText, dayIndex, dayUnixTime },
}) => {
  if (now === null) {
    now = moment.tz(profileTimezone);
  }
  if (dayIndex === -1) {
    return [];
  }
  const slotsForTheDay = dailySlots[dayIndex];
  const dayMoment = moment.tz(new Date(dayUnixTime * 1000), profileTimezone);
  return slotsForTheDay.map((slot) => {
    const slotMoment = dayMoment.clone();
    const [hour, minute] = slot.split(':');
    slotMoment.set({ hour: parseInt(hour, 10), minute: parseInt(minute, 10) });
    if (slotMoment.isBefore(now)) {
      return null;
    }
    return {
      name: slot,
      label: slotMoment.format(hasTwentyFourHourTimeFormat ? 'HH:mm' : 'h:mm A'),
      timestamp: slotMoment.unix(),
      dayText,
    };
  }).filter(slot => slot); // gets rid of `null` slots (i.e., in the past)
};

/**
 * Convenience method for generating a header item for the `QueueItems` component
 */
export const getDayHeaderItem = ({ text, dayOfWeek, date }) => ({
  queueItemType: 'header',
  id: text,
  text,
  dayOfWeek,
  date,
});

const servicesWithCommentFeature = ['instagram'];
/**
 * Convenience method for generating a post item for the `QueueItems` component
 */
export const getPostItem = ({
  isManager,
  post,
}) => ({
  queueItemType: 'post',
  ...post,
  isManager,
  draggable: false,
  hasCommentEnabled: servicesWithCommentFeature.indexOf(post.profile_service) !== -1,
});

/**
 * Convenience method for generating a slot item for the `QueueItems` component
 */
export const getSlotItem = ({
  slot,
  profileService,
}) => ({
  queueItemType: 'slot',
  id: `${slot.timestamp}-${slot.name}`,
  slot,
  profileService,
});

/**
 * Given a `daySlot` and array of `posts` this method will return either a post item or
 * and empty slot item if no post is currently occupying that slot.
 */
export const getSlotOrPostItem = ({ daySlot, posts, isManager, profileService }) => {
  const postInSlot = posts.find((post) => {
    const isAtSlotTime = post.due_at === daySlot.timestamp;
    const isCustomScheduled = post.scheduled_at && !post.pinned;
    return (isAtSlotTime && !isCustomScheduled);
  });
  if (postInSlot) {
    return getPostItem({ isManager, post: postInSlot });
  }
  return getSlotItem({
    slot: daySlot,
    profileService,
  });
};

/**
 * Returns a list of queue items for a given set of `daySlots` that were
 * obtained from `getSlotsWithTimestampsForDay`.
 */
export const getQueueItemsForDay = ({
  daySlots,
  posts,
  isManager,
  profileService,
}) => {
  const postsCollected = [];

  const pinnedAndQueuedPosts = daySlots.map((daySlot) => {
    const item = getSlotOrPostItem({ daySlot, posts, isManager, profileService });
    if (item.queueItemType === 'post') {
      postsCollected.push(item.id);
    }
    return item;
  });

  const remainingPosts = posts
    .filter(post => !postsCollected.includes(post.id))
    .map(post => getPostItem({ isManager, post }));

  const items = pinnedAndQueuedPosts
    .concat(remainingPosts)
    .sort((a, b) => {
      const aField = a.slot ? a.slot.timestamp : a.due_at;
      const bField = b.slot ? b.slot.timestamp : b.due_at;
      return aField - bField;
    });

  return items;
};

export const groupPostsByDay = posts =>
  posts.reduce((finalPosts, post) => {
    finalPosts[post.day] = finalPosts[post.day] || [];
    finalPosts[post.day].push(post);
    return finalPosts;
  }, {});

export const getDaysToAddForPastPosts = ({ posts, profileTimezone, now }) => {
  if (now === null) {
    now = moment.tz(profileTimezone);
  }
  const startOfToday = moment(now).startOf('day');
  const pastPosts = posts.filter(post => post.due_at < startOfToday.unix());
  const pastPostsDays = pastPosts.map(post => post.day);
  const uniqueDays = [...new Set(pastPostsDays)]; // removes duplicates
  return uniqueDays.map((day) => {
    const [dayOfWeek, ...rest] = day.split(' ');
    const date = rest.join(' ');
    return {
      text: day,
      date,
      dayOfWeek,
      dayIndex: -1,
      dayUnixTime: 0,
    };
  });
};

/**
 * This method formats a list of posts into a list that contains day headings,
 * posts and optionally queue slots (if supported by the plan.)
 */
export const formatPostLists = ({
  isManager,
  posts,
  scheduleSlotsEnabled,
  schedules,
  profileTimezone,
  weekStartsOnMonday,
  weeksToShow,
  hasTwentyFourHourTimeFormat,
  profileService,
}) => {
  const orderedPosts = Object.values(posts).sort((a, b) => a.due_at - b.due_at);

  /**
   * CASE 1: Schedule Slots Enabled
   */
  if (scheduleSlotsEnabled) {
    // Get the schedule slots for each day
    const dailySlots = getDailySlotsFromProfileSchedules(schedules);

    // Now get the weeks/days we'll show in the queue
    let days = getDaysForUpcomingWeeks({
      profileTimezone,
      weekStartsOnMonday,
      numWeeks: weeksToShow,
    });

    // Let's group posts by their 'day' field to make grabbing them easier
    const postsByDay = groupPostsByDay(orderedPosts);

    // Now we'll start composing the list that will be passed to
    // our `QueueItems` component
    let finalList = [];

    /**
     * First thing we need to do is add posts that are from the past days to the top of the list.
     * These must be posts that failed to send for some reason or another, since otherwise
     * they'd be in the Sent Posts tab.
     */
    const pastPostDays = getDaysToAddForPastPosts({ posts: orderedPosts, profileTimezone });
    days = [...pastPostDays, ...days];

    // Now let's add the posts for the Daily View weeks
    days.forEach((day) => {
      const dayHeader = getDayHeaderItem(day);
      const daySlots = getSlotsWithTimestampsForDay({
        profileTimezone,
        hasTwentyFourHourTimeFormat,
        dailySlots,
        day,
      });
      const postsForDay = postsByDay[day.text] || [];
      const queueItemsForDay = getQueueItemsForDay({
        daySlots,
        posts: postsForDay,
        isManager,
        profileService,
      });

      // Check for length here so we don't add a dayHeader when there are no slots or posts
      if (queueItemsForDay.length) {
        finalList = [
          ...finalList,
          dayHeader,
          ...queueItemsForDay,
        ];
      }
    });
    /**
     * Sometimes posts will have 'No scheduled days or times' set as their day
     * field. This means their `due_at` time is `0`.
     * This will happen when either
     *   a) The post was going to be sent, but the profile was paused (so we set the time to `0`) OR
     *   b) The user has no times set in their posting schedule.
    */
    if (postsByDay['No scheduled days or times']) {
      const isPaused = schedules.some(item => item.times.length > 0);
      const headerText = isPaused ? 'Paused posts' : 'No scheduled days or times';

      finalList = [
        ...postsByDay['No scheduled days or times']
          .map(post => getPostItem({ isManager, post })),
        ...finalList,
      ];

      finalList.unshift({
        queueItemType: 'header',
        id: headerText,
        text: headerText,
      });
    }

    return finalList;
  }

  /**
   * CASE 2: Schedule Slots Disabled
   * If schedule slots aren't enabled, the queue logic is much more simple
   */
  let lastHeader = null;
  return orderedPosts.reduce((finalList, post, index) => {
    const hasCommentEnabled = servicesWithCommentFeature.indexOf(post.profile_service) !== -1;
    if (lastHeader !== post.day) {
      lastHeader = post.day;
      finalList.push({
        queueItemType: 'header',
        text: post.day,
        id: `header-${index}`,
        hasCommentEnabled,
      });
    }
    finalList.push({
      queueItemType: 'post',
      isManager,
      index,
      ...post,
      hasCommentEnabled,
    });
    return finalList;
  }, []);
};

const getBaseURL = () =>
  (window.location.hostname === 'publish.local.buffer.com' ? 'https://local.buffer.com' : 'https://buffer.com');

export const openCalendarWindow = (profileId, weekOrMonth) => {
  window.open(
    `${getBaseURL()}/app/profile/${profileId}/buffer/queue/calendar/${weekOrMonth}/?content_only=true`,
    '_blank',
  );
};
