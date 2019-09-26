import Pusher from 'pusher-js';
import { actionTypes as profileSidebarActionTypes } from '@bufferapp/publish-profile-sidebar/reducer';
import { actionTypes as queueActionTypes } from '@bufferapp/publish-queue/reducer';
import { postParser } from '@bufferapp/publish-server/parsers/src';

import middleware from './middleware';

describe('middleware', () => {
  const store = {
    dispatch: jest.fn(),
    getState: () => ({ }),
  };
  const next = jest.fn();
  const selectProfileAction = {
    type: profileSidebarActionTypes.SELECT_PROFILE,
    profileId: '12345',
    profile: {
      service: 'instagram',
    },
  };

  const selectIGProfileAction = {
    type: profileSidebarActionTypes.SELECT_PROFILE,
    profileId: '123456',
    profile: {
      service: 'twitter',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next when running middleware', () => {
    middleware(store)(next)(selectProfileAction);
    expect(next)
      .toBeCalled();
  });

  it('should create a new pusher instance', () => {
    middleware(store)(next)(selectProfileAction);
    expect(Pusher)
      .toHaveBeenCalledWith(
        'bd9ba9324ece3341976e',
        { authEndpoint: '/pusher/auth' },
      );
  });

  it('should subscribe to both private updates and private story groups channel', () => {
    middleware(store)(next)(selectProfileAction);
    expect(Pusher.subscribe)
      .toHaveBeenCalledWith('private-updates-12345');
    expect(Pusher.subscribe)
      .toHaveBeenCalledWith('private-story-groups-12345');
  });

  it('should subscribe to private updates but not private story groups channel', () => {
    middleware(store)(next)(selectIGProfileAction);
    expect(Pusher.subscribe)
      .not.toHaveBeenCalledWith('private-story-groups-123456');
    expect(Pusher.subscribe)
      .toHaveBeenCalledWith('private-updates-123456');
  });

  it('should subscribe to update events', () => {
    middleware(store)(next)(selectProfileAction);
    expect(Pusher.bind.mock.calls[0][0]).toEqual('private-updates-12345');
    expect(Pusher.bind.mock.calls[0][1]).toEqual('sent_update');
    expect(Pusher.bind.mock.calls[1][0]).toEqual('private-updates-12345');
    expect(Pusher.bind.mock.calls[1][1]).toEqual('updated_update');
    expect(Pusher.bind.mock.calls[2][0]).toEqual('private-updates-12345');
    expect(Pusher.bind.mock.calls[2][1]).toEqual('added_update');
    expect(Pusher.bind.mock.calls[3][0]).toEqual('private-updates-12345');
    expect(Pusher.bind.mock.calls[3][1]).toEqual('deleted_update');
    expect(Pusher.bind.mock.calls[4][0]).toEqual('private-updates-12345');
    expect(Pusher.bind.mock.calls[4][1]).toEqual('collaboration_draft_approved');
    expect(Pusher.bind.mock.calls[5][0]).toEqual('private-updates-12345');
    expect(Pusher.bind.mock.calls[5][1]).toEqual('collaboration_draft_updated');
    expect(Pusher.bind.mock.calls[6][0]).toEqual('private-updates-12345');
    expect(Pusher.bind.mock.calls[6][1]).toEqual('reordered_updates');
    expect(Pusher.bind.mock.calls[7][0]).toEqual('private-updates-12345');
    expect(Pusher.bind.mock.calls[7][1]).toEqual('queue_paused');
    expect(Pusher.bind.mock.calls[8][0]).toEqual('private-story-groups-12345');
    expect(Pusher.bind.mock.calls[8][1]).toEqual('sent_story_group');
    expect(Pusher.bind).toHaveBeenCalledTimes(9);
  });

  it('should dispatch when a subscribed pusher event happens', () => {
    middleware(store)(next)(selectProfileAction);
    const update = { id: '00012345', text: 'Hello, world.' };
    Pusher.simulate('private-updates-12345', 'added_update', { update });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: queueActionTypes.POST_CREATED,
      profileId: '12345',
      post: postParser(update),
    });
  });
});
