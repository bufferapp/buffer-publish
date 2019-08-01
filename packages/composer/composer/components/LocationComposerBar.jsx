import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import debounce from 'lodash.debounce';
import LocationFinder from '../utils/LocationFinder';
import { resizeImageIfNeeded } from '../utils/DOMUtils';
import styles from './css/LocationComposerBar.css';

import ComposerActionCreators from '../action-creators/ComposerActionCreators';

class LocationComposerBar extends React.Component {
  static propTypes = {
    draftId: PropTypes.string.isRequired,
    locationName: PropTypes.string,
    locationId: PropTypes.string,
    places: PropTypes.array,
    instagramProfileId: PropTypes.string,

    selectedProfiles: PropTypes.arrayOf(PropTypes.shape({
      instagramDirectEnabled: PropTypes.bool,
    })).isRequired,
    isInstagram: PropTypes.bool.isRequired,
    hasIGLocationTaggingFeature: PropTypes.bool.isRequired,
    hasIGDirectVideoFlip: PropTypes.bool.isRequired,
    hasVideo: PropTypes.bool.isRequired,
    withMediaAttachment: PropTypes.bool,
  };

  static defaultProps = {
    locationName: '',
    locationId: null,
    instagramProfileId: null,
    places: [],
    withMediaAttachment: false,
  };

  shouldShowLocationBar = () => {
    const {
      selectedProfiles,
      isInstagram,
      hasIGLocationTaggingFeature,
      hasIGDirectVideoFlip,
      hasVideo,
  } = this.props;
    return (
      isInstagram &&
      selectedProfiles.some((profile) => profile.instagramDirectEnabled) &&
      hasIGLocationTaggingFeature &&
      ((hasVideo && hasIGDirectVideoFlip) || !hasVideo)
    );
  };

  onChange = (event, value) => {
    ComposerActionCreators.updateDraftLocation(this.props.draftId, null, value);

    if (value !== '') {
      this.getLocations(value);
    }
  };

  onMenuVisibilityChange = (isOpen) => {
    if (!isOpen && this.props.locationId === null && this.props.locationName !== '') {
      this.resetInput();
    }
  };

  getLocations = debounce((query) => {
    LocationFinder.findLocations(this.props.instagramProfileId, query).then((results) => {
      ComposerActionCreators.updateDraftListPlaces(this.props.draftId, results);
    }).catch(() => {
      ComposerActionCreators.updateDraftListPlaces(this.props.draftId, []);
    });
  }, 450);

  saveLocation = (newPlace) => {
    ComposerActionCreators.updateDraftLocation(this.props.draftId, newPlace.id, newPlace.name);
  };

  removeLocation = (e) => {
    e.preventDefault();
    this.resetInput();
  };

  resetInput = () => ComposerActionCreators.updateDraftLocation(this.props.draftId, null, '');

  isLocationSet = () => (this.props.locationId !== null);

  render() {
    return (
      this.shouldShowLocationBar() &&
      <div className={this.props.withMediaAttachment ? styles.locationComposerBarWithMedia : styles.locationComposerBar}>
        <div className={styles.locationFieldContainer}>
          <span className={styles.locationFieldLabel}>Location </span>
          <span className={styles.locationAutocompleteContainer}>
            {this.isLocationSet() &&
            <span className={styles.locationFieldRemoveInput} onClick={this.removeLocation} />
            }
            <Autocomplete
              wrapperStyle={{ width: '100%' }}
              value={this.props.locationName}
              items={this.props.places}
              inputProps={{
                className: styles.locationFieldInput,
                placeholder: 'Start typing a location...',
              }}
              getItemValue={item => item.name}
              onSelect={(value, place) => {
                this.saveLocation(place);
              }}
              onChange={this.onChange}
              onMenuVisibilityChange={this.onMenuVisibilityChange}
              renderMenu={children => (
                <div className={styles.locationMenu}>
                  {children}
                </div>
              )}
              renderItem={(item, highlighted) => {
                const classHighlighted = highlighted ? styles.optionRowHighlighted : '';
                return (
                  <div key={item.id} className={`${styles.optionRow} ${classHighlighted}`}>
                    <img className={styles.optionImage} alt="" src={item.pictureUrl} />
                    <div className={styles.optionTextDescription}>
                      <p className={styles.optionTitle}>{item.name}</p>
                      <p>
                        {item.formattedAddressWithCheckins}
                      </p>
                    </div>
                  </div>
                );
              }}
            />
          </span>
        </div>
      </div>
    );
  }
}

export default LocationComposerBar;
