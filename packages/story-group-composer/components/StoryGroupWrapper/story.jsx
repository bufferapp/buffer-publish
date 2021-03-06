/**
 * Skip Test
 *
import React from 'react';
import { storiesOf } from '@storybook/react';
import { selectedProfile } from '@bufferapp/publish-profile-sidebar/mockData/profiles';
import translations from '@bufferapp/publish-i18n/translations/en-us.json';
import { withA11y } from '@storybook/addon-a11y';
import { Provider } from 'react-redux';
import StoryGroupWrapper from './index';

const mockStore = state => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

function createMockStore () {
  return mockStore({
    i18n: { translations },
  });
}

storiesOf('StoryGroup', module)
  .addDecorator(withA11y)
  .addDecorator(getStory => (
    <Provider store={createMockStore()}>
      {getStory()}
    </Provider>
  ))
  .add('story group wrapper', () => (
    <StoryGroupWrapper
      selectedProfile={selectedProfile}
      translations={translations['story-group-composer']}
      saveNote={() => {}}
      onDateTimeSlotPickerSubmit={() => {}}
      uses24hTime
      timezone="Asia/Tehran"
      weekStartsMonday={false}
      isScheduleLoading={false}
      dropzoneComponent={<div />}
    />
  ));
*/
