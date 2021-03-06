import React from 'react';
import PropTypes from 'prop-types';

import PostEmptySlot from '../../PostEmptySlot/dropTarget';

const getLabel = service =>
  service === 'twitter' ? 'Schedule a Tweet' : 'Schedule a Post';

const EmptySlot = ({
  item,
  pinned,
  customLabel,
  customHoverMessage,
  onEmptySlotClick,
}) => {
  const { id, slot, profileService } = item;
  // if no posting time (unpinned), display custom label
  const unpinnedLabel = !pinned ? getLabel(profileService) : null;
  return (
    <PostEmptySlot
      key={id}
      time={slot.label}
      timestamp={slot.timestamp}
      day={slot.dayText}
      service={profileService}
      customLabel={customLabel || unpinnedLabel}
      customHoverMessage={customHoverMessage}
      onClick={() =>
        onEmptySlotClick({
          dueTime: slot.label,
          profile_service: profileService,
          scheduled_at: slot.timestamp,
          scheduledAt: slot.timestamp,
          due_at: slot.timestamp,
          pinned,
        })
      }
    />
  );
};

EmptySlot.propTypes = {
  item: PropTypes.shape({
    slot: PropTypes.shape({
      dayText: PropTypes.string,
      label: PropTypes.string,
      timestamp: PropTypes.number,
    }),
    id: PropTypes.string,
    profileService: PropTypes.string,
  }).isRequired,
  onEmptySlotClick: PropTypes.func,
  pinned: PropTypes.bool,
  customLabel: PropTypes.string,
  customHoverMessage: PropTypes.string,
};

EmptySlot.defaultProps = {
  pinned: false,
  customLabel: null,
  customHoverMessage: null,
  onEmptySlotClick: () => {},
};

export default EmptySlot;
