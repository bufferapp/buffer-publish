/* eslint-disable react/forbid-prop-types */

/**
 * Component that displays a link attachment
 */

import React from 'react';
import PropTypes from 'prop-types';

import ComposerActionCreators from '../action-creators/ComposerActionCreators';
import LinkAttachmentTextEditor from './LinkAttachmentTextEditor';
import LinkAttachmentThumbnailEditor from './LinkAttachmentThumbnailEditor';
import LinkAttachmentThumbnail from './LinkAttachmentThumbnail';
import CloseButton from './shared/CloseButton';
import A from './shared/A';
import { AttachmentTypes, LinkAttachmentTextFieldTypes } from '../AppConstants';
import styles from './css/LinkAttachment.css';
import { getAbsoluteUrl } from '../utils/StringUtils';

class LinkAttachment extends React.Component {
  onCloseButtonClick = () => {
    const { draftId } = this.props;
    ComposerActionCreators.toggleAttachment(draftId, AttachmentTypes.LINK);
  };

  // Facebook has specific logic to allow editing of link attachments, not everyone
  // on the network can edit all attached links. For other social networks, we defer
  // to their config with `service.canEditLinkAttachment`
  canEditLinkAttachment = () => {
    const { appState, selectedProfiles, link, service } = this.props;

    if (service.name !== 'facebook' || !service.canEditLinkAttachment) {
      return {
        canEdit: service.canEditLinkAttachment,
        isResultCertain: true,
        isLoading: false,
      };
    }

    // If only Facebook Profiles/Groups are selected (not Pages), prevent editing
    const hasOnlyNonPagesSelected = selectedProfiles.every(
      profile => profile.serviceType !== 'page'
    );
    if (hasOnlyNonPagesSelected && !link.wasEdited) {
      return {
        canEdit: false,
        isResultCertain: true,
        isLoading: false,
      };
    }

    // If Facebook Profiles or Groups are selected, default to the generic info message
    // that mentions their unability to edit link previews
    const hasNonPagesSelected = selectedProfiles.some(
      profile => profile.serviceType !== 'page'
    );
    if (hasNonPagesSelected) {
      return {
        canEdit: true,
        isResultCertain: false,
        hasNonPages: true,
        isLoading: false,
      };
    }

    // Don't check more than 5 profiles to save on Facebook API request quota
    const maxPagesToCheckCount = 5;

    // If unsure, allow editing straight away
    if (selectedProfiles.length > maxPagesToCheckCount) {
      return {
        canEdit: true,
        isResultCertain: false,
        isLoading: false,
      };
    }

    const selectedProfilesIds = selectedProfiles.map(({ id }) => id);
    const linkDomainOwnershipData = appState.domainsOwnedByFacebookPages.get(
      link.url
    );

    // Default to true while we retrieve more data
    if (linkDomainOwnershipData === undefined) {
      return {
        canEdit: true,
        isResultCertain: false,
        isLoading: true,
      };
    }

    const doAllSelectedProfilesOwnDomain = selectedProfilesIds.every(
      id => linkDomainOwnershipData.get(id) === true
    );

    if (doAllSelectedProfilesOwnDomain) {
      return {
        canEdit: true,
        isResultCertain: true,
        isLoading: false,
      };
    }

    const doSomeSelectedProfilesOwnDomain = selectedProfilesIds.some(
      id => linkDomainOwnershipData.get(id) === true
    );
    const isSomeOwnershipDataBeingLoaded = selectedProfilesIds.some(
      id => linkDomainOwnershipData.get(id) === null
    );

    if (
      doSomeSelectedProfilesOwnDomain ||
      isSomeOwnershipDataBeingLoaded ||
      link.wasEdited
    ) {
      return {
        canEdit: true,
        isResultCertain: false,
        isLoading: isSomeOwnershipDataBeingLoaded,
      };
    }

    return {
      canEdit: false,
      isResultCertain: true,
      isLoading: false,
    };
  };

  render() {
    const {
      link,
      draftId,
      service,
      visibleNotifications,
      filesUploadProgress,
    } = this.props;
    const hasTitle = link.title !== null;
    const hasDescription = link.description !== null;
    const areUploadsInProgress = filesUploadProgress.size > 0;
    const absoluteUrl = getAbsoluteUrl(link.url);
    const domainOnlyUrl = link.url
      .replace('http://', '')
      .replace('www.', '')
      .replace('https://', '')
      .split(/[/?#]/)[0];

    const {
      canEdit: canEditLinkAttachment,
      isResultCertain,
      hasNonPages = false,
      isLoading,
    } = this.canEditLinkAttachment();
    const showFacebookLinkEditingMessage = !isResultCertain && !isLoading;

    return (
      <div>
        {showFacebookLinkEditingMessage && (
          <p className={styles.facebookLinkEditingMessage}>
            {hasNonPages
              ? `It looks like you've got a few Facebook accounts selected. Please note that Groups are not allowed to make changes to link previews, and some Pages may not either.`
              : `Heads up! We're unsure if all the Facebook Pages you've selected are allowed to make changes to link previews.`}{' '}
            Please bear in mind that if you do make changes, the link attachment
            may look different once published on Facebook. You can read more
            about{' '}
            <A
              href="https://support.buffer.com/hc/en-us/articles/360038455554-Types-of-media-attachments-you-can-include-in-posts"
              target="_blank"
            >
              Facebook&apos;s current link editing policies here
            </A>
            .
          </p>
        )}

        <div className={styles.linkAttachment}>
          <LinkAttachmentThumbnail
            thumbnail={link.thumbnail}
            isUploadInProgress={areUploadsInProgress}
          />

          {canEditLinkAttachment && (
            <LinkAttachmentThumbnailEditor
              draftId={draftId}
              selectedThumbnail={link.thumbnail}
              availableThumbnails={link.availableThumbnails}
              visibleNotifications={visibleNotifications}
              service={service}
              filesUploadProgress={filesUploadProgress}
            />
          )}

          <span className={styles.linkDetailsContainer}>
            {hasTitle ? (
              <LinkAttachmentTextEditor
                type={LinkAttachmentTextFieldTypes.TITLE}
                value={link.title}
                draftId={draftId}
                canBeEdited={canEditLinkAttachment}
              />
            ) : (
              <p className={styles.loadingMessage} />
            )}

            <A className={styles.url} href={absoluteUrl} target="_blank">
              {domainOnlyUrl}
            </A>

            {hasDescription && (
              <LinkAttachmentTextEditor
                type={LinkAttachmentTextFieldTypes.DESCRIPTION}
                value={link.description}
                draftId={draftId}
                canBeEdited={canEditLinkAttachment}
              />
            )}
          </span>

          <CloseButton
            className={styles.closeButton}
            onClick={this.onCloseButtonClick}
            data-tip="Disable Link Attachment"
          />
        </div>
      </div>
    );
  }
}

LinkAttachment.propTypes = {
  appState: PropTypes.object.isRequired,
  draftId: PropTypes.string.isRequired,
  link: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
  visibleNotifications: PropTypes.array,
  filesUploadProgress: PropTypes.instanceOf(Map),
  selectedProfiles: PropTypes.array,
};

LinkAttachment.defaultProps = {
  visibleNotifications: [],
  filesUploadProgress: null,
  selectedProfiles: [],
};

export default LinkAttachment;
