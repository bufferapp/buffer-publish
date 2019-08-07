import React from 'react';
import PropTypes from 'prop-types';
import { isValidURL, urlHasProtocol } from '@bufferapp/publish-grid/util';
import styles from './css/ShopgridComposerBar.css';

import ComposerActionCreators from '../action-creators/ComposerActionCreators';
import QuestionIcon from './QuestionIcon';

class ShopgridComposerBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shopgridLink: props.shopgridLink || '',
      helpUrl: 'https://faq.buffer.com/article/1164-publish-instagram-shop-grid',
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.shouldShowShopgridBar = this.shouldShowShopgridBar.bind(this);
    this.openHelp = this.openHelp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.shopgridLink !== nextProps.shopgridLink) {
      this.state = {
        shopgridLink: nextProps.shopgridLink || '',
      };
    }
  }

  onChange(event) {
    this.setState({ shopgridLink: event.target.value || '' });
    ComposerActionCreators.updateDraftShopgridLink(this.props.draftId, event.target.value);
  }

  onBlur(event) {
    let shopgridLink = event.target.value || '';
    if (isValidURL(event.target.value)) {
      if (!urlHasProtocol(event.target.value)) {
        shopgridLink = `https://${event.target.value}`;
      }
    }
    this.setState({ shopgridLink });
    ComposerActionCreators.updateDraftShopgridLink(this.props.draftId, shopgridLink);
  }

  shouldShowShopgridBar() {
    const {
      isInstagram,
      hasShopgridFlip,
      selectedInstagramProfiles,
      isBusinessUser,
    } = this.props;

    const hasInstagramSelected = selectedInstagramProfiles
      && selectedInstagramProfiles.length >= 1
      && selectedInstagramProfiles.some(profile => profile.instagramDirectEnabled);

    return hasInstagramSelected && isInstagram && hasShopgridFlip && isBusinessUser;
  }

  openHelp(e) {
    e.preventDefault();
    window.open(this.state.helpUrl, '_blank');
  }

  render () {
    return (
      this.shouldShowShopgridBar() &&
      <div className={styles.shopgridComposerBar}>
        <div className={styles.shopgridFieldContainer}>
          <span className={styles.shopgridFieldLabel}>
            Shop Grid Link
          </span>
          <span className={styles.shopgridHelpIcon}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={styles.questionIcon}
              title="Learn more about Shop Grid"
              href={this.state.helpUrl}
              onClick={this.openHelp}
            >
              <QuestionIcon />
            </a>
          </span>
          <span className={styles.shopgridAutocompleteContainer}>
            <input
              className={styles.shopgridFieldInput}
              onChange={this.onChange}
              onBlur={this.onBlur}
              name="shopgridLink"
              placeholder="Website or Product URL"
              value={this.state.shopgridLink}
            />
          </span>
        </div>
      </div>
    );
  }
}

ShopgridComposerBar.propTypes = {
  draftId: PropTypes.string.isRequired,
  shopgridLink: PropTypes.string,
  hasShopgridFlip: PropTypes.bool.isRequired,
  isInstagram: PropTypes.bool.isRequired,
  selectedInstagramProfiles: PropTypes.arrayOf(PropTypes.shape({
    instagramDirectEnabled: PropTypes.bool,
  })).isRequired,
  isBusinessUser: PropTypes.bool.isRequired,
};

ShopgridComposerBar.defaultProps = {
  shopgridLink: null,
};


export default ShopgridComposerBar;
