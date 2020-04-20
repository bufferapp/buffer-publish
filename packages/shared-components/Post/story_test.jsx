import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { Text } from '@bufferapp/components';
import Post from './index';

const storeFake = state => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  productFeatures: {
    planName: 'free',
    features: {},
  },
});

const postDetails = {
  isRetweet: false,
  postAction: 'This post will be sent at 9:21 (GMT)',
};

const postDetailsError = {
  isRetweet: false,
  postAction: 'This post will be sent at 9:21 (GMT)',
  error: 'Sharing failed. Try again?',
};

const isARetweetPostDetails = {
  ...postDetails,
  isRetweet: true,
};

const sentPostDetails = {
  postAction: 'This post was sent June 20th at 9:21 (GMT)',
};

const retweetProfile = {
  avatarUrl:
    'https://buffer-uploads.s3.amazonaws.com/503a5c8ffc99f72a7f00002e/f49c2ff693f1c307af5e1b3d84e581ca.png',
  handle: '@joelgascoigne',
  name: 'Joel Gascoigne',
};

const links = [
  {
    rawString: 'http://buff.ly/1LTbUqv',
    displayString: 'http://buff.ly/1LTbUqv',
    url:
      'https://austinstartups.com/what-is-a-product-designer-who-cares-eb38fc7afa7b#.i3r34a75x',
    indices: [74, 96],
  },
];

const statistics = {
  clicks: 12,
  favorites: 5,
  mentions: 1,
  reach: 122,
  retweets: 2,
};

const retweetComment =
  'What is a Product Designer? An awesome story by @jgadapee over on Medium! http://buff.ly/1LTbUqv';

const subprofiles = [
  {
    avatar:
      'http://i.pinimg.com/200x150/76/4a/36/764a36f92e012937b13d150690747365.jpg',
    id: '5bbca83e94803d000e7dca34',
    name: 'Books',
  },
  {
    avatar:
      'http://i.pinimg.com/200x150/ac/c7/15/acc7159eb4a3fd01963087465305b967.jpg',
    id: '5bbca83e94803d000e7dca35',
    name: 'Travel',
  },
];

const children = (
  <Text size="mini" color="black">
    {'Rubber baby buggy bumpers.'}
  </Text>
);

storiesOf('Cards|Posts/Post', module)
  .addDecorator(withA11y)
  .addDecorator(getStory => <Provider store={store}>{getStory()}</Provider>)
  .add('queued post', () => (
    <Post
      postDetails={postDetails}
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      onEditClick={action('edit-click')}
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('sent', () => (
    <Post
      postDetails={sentPostDetails}
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      isSent
      statistics={statistics}
    >
      {children}
    </Post>
  ))
  .add('error', () => (
    <Post
      onMouseEnter={action('on-mouse-enter')}
      onMouseLeave={action('on-mouse-leave')}
      onDeleteConfirmClick={action('delete-confirm-click')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      postDetails={postDetailsError}
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('isConfirmingDelete', () => (
    <Post
      isConfirmingDelete
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      postDetails={postDetails}
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('isDeleting', () => (
    <Post
      isDeleting
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      postDetails={postDetails}
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('isWorking', () => (
    <Post
      isWorking
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      postDetails={postDetails}
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('retweet', () => (
    <Post
      postDetails={isARetweetPostDetails}
      onMouseEnter={action('mouse-enter')}
      onMouseLeave={action('mous-leave')}
      onDeleteConfirmClick={action('delete-confirm-click')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      retweetProfile={retweetProfile}
      isSent={false}
      basic={false}
    >
      {children}
    </Post>
  ))
  .add('retweet with comment', () => (
    <Post
      postDetails={isARetweetPostDetails}
      retweetCommentLinks={links}
      onMouseEnter={action('mouse-enter')}
      onMouseLeave={action('mous-leave')}
      onDeleteConfirmClick={action('delete-confirm-click')}
      onEditClick={action('edit-click')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      retweetProfile={retweetProfile}
      retweetComment={retweetComment}
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('Instragram post with Location', () => (
    <Post
      postDetails={postDetails}
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      onEditClick={action('edit-click')}
      locationName="Buffer, Earth"
      profileService="instagram"
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('Instragram post without Location', () => (
    <Post
      postDetails={postDetails}
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      onEditClick={action('edit-click')}
      profileService="instagram"
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('Pinterest post with board and source URL', () => (
    <Post
      postDetails={postDetails}
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      onEditClick={action('edit-click')}
      profileService="pinterest"
      subprofiles={subprofiles}
      subprofileID="5bbca83e94803d000e7dca35"
      sourceUrl="http://google.com"
      isSent={false}
    >
      {children}
    </Post>
  ))
  .add('Pinterest post with board only', () => (
    <Post
      postDetails={postDetails}
      onDeleteConfirmClick={linkTo('Post', 'isDeleting')}
      onShareNowClick={linkTo('Post', 'isWorking')}
      onEditClick={action('edit-click')}
      profileService="pinterest"
      subprofiles={subprofiles}
      subprofileID="5bbca83e94803d000e7dca34"
      isSent={false}
    >
      {children}
    </Post>
  ));
