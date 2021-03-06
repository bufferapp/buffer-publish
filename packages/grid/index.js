// component vs. container https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
import { connect } from 'react-redux';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
// load the presentational component
import { actions } from './reducer';
import GridPosts from './components/GridPosts';
import { getChannelProperties, isValidURL, urlHasProtocol } from './util';

const orderPostLists = posts => {
  const postLists = [];
  const orderedPosts =
    posts && typeof posts === 'object'
      ? Object.values(posts).sort((a, b) => Number(b.due_at) - Number(a.due_at))
      : [];

  orderedPosts.forEach(post => {
    postLists.push(post);
  });

  return postLists;
};

const modifyItem = item => {
  return item
    ? {
        ...item,
        url: urlHasProtocol(item.url) ? item.url : `https://${item.url}`,
      }
    : item;
};

export default connect(
  (state, ownProps) => {
    const { profileId } = ownProps;
    const currentProfile = state.grid.byProfileId[profileId];
    if (currentProfile) {
      const gridPosts = orderPostLists(currentProfile.gridPosts);
      const profile = state.profileSidebar.selectedProfile;
      return {
        loading: currentProfile.loading,
        page: currentProfile.page,
        gridPosts,
        total: gridPosts.length,
        profile,
        isLockedProfile: state.profileSidebar.isLockedProfile,
        isDisconnectedProfile: profile.isDisconnected,
        customLinksDetails: currentProfile.customLinksDetails,
        maxCustomLinks: currentProfile.maxCustomLinks,
        publicGridUrl: `https://shopgr.id/${profile.serviceUsername}`,
        hasWriteAccess: profile.permissions.includes('buffer_write'),
      };
    }
    return {};
  },
  (dispatch, ownProps) => ({
    onSaveNewLinkClick: ({ item }) => {
      dispatch(
        actions.handleAddNewGridLink({
          profileId: ownProps.profileId,
          item: modifyItem(item),
        })
      );
    },
    onImageClick: post => {
      dispatch(
        actions.handleImageClick({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onImageClose: post => {
      dispatch(
        actions.handleImageClose({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onChangePostUrl: (post, link) => {
      dispatch(
        actions.handleChangePostUrl({
          post,
          profileId: ownProps.profileId,
          link,
          oldLink: post.link,
        })
      );
    },
    onSavePostUrl: (post, link) => {
      dispatch(
        actions.handleSavePostUrl({
          post,
          profileId: ownProps.profileId,
          link,
        })
      );
    },
    handleCopyToClipboard: ({ copySuccess, publicGridUrl }) => {
      dispatch(
        actions.handleCopyToClipboardResult({
          copySuccess,
          publicGridUrl,
        })
      );
    },
    trackPagePreviewed: channel => {
      const metadata = getChannelProperties(channel);
      dispatch(
        analyticsActions.trackEvent('Shop Grid Page Previewed', metadata)
      );
    },
    onUpdateSingleCustomLink: ({ item }) => {
      dispatch(
        actions.handleUpdateSingleCustomLink({
          profileId: ownProps.profileId,
          linkId: item._id,
          item: modifyItem(item),
        })
      );
    },
    onUpdateCustomLinks: ({ customLinks, linkText, linkUrl, item }) => {
      dispatch(
        actions.handleUpdateCustomLinks({
          profileId: ownProps.profileId,
          customLinks,
          customLinkColor: null,
          customLinkContrastColor: null,
          customLinkButtonType: null,
          linkText,
          linkUrl:
            urlHasProtocol(linkUrl) || !linkUrl
              ? linkUrl
              : `https://${linkUrl}`,
          item: modifyItem(item),
        })
      );
    },
    onUpdateCustomLinksColor: ({
      customLinkColor,
      customLinkContrastColor,
    }) => {
      dispatch(
        actions.handleUpdateCustomLinks({
          profileId: ownProps.profileId,
          customLinks: false,
          customLinkColor,
          customLinkContrastColor,
          customLinkButtonType: null,
        })
      );
    },
    onUpdateCustomLinksButtonType: ({ customLinkButtonType }) => {
      dispatch(
        actions.handleUpdateCustomLinks({
          profileId: ownProps.profileId,
          customLinks: false,
          customLinkColor: null,
          customLinkContrastColor: null,
          customLinkButtonType,
        })
      );
    },
    onDeleteCustomLink: ({ customLinkId }) => {
      dispatch(
        actions.handleDeleteCustomLink({
          profileId: ownProps.profileId,
          customLinkId,
        })
      );
    },
    onUpdateLinkText: ({ item, value }) => {
      dispatch(
        actions.handleEditCustomLinkText({
          profileId: ownProps.profileId,
          item,
          value,
          prop: 'text',
        })
      );
    },
    onSaveCustomLinkText: ({ item }) => {
      dispatch(
        actions.handleSaveCustomLink({
          profileId: ownProps.profileId,
          item,
        })
      );
    },
    onUpdateLinkUrl: ({ item, value }) => {
      dispatch(
        actions.handleEditCustomLinkUrl({
          profileId: ownProps.profileId,
          item,
          value,
          prop: 'url',
        })
      );
    },
    onToggleEditMode: ({ item, editing }) => {
      dispatch(
        actions.handleToggleEditMode({
          profileId: ownProps.profileId,
          item,
          editing,
        })
      );
    },
    onCancelCustomLinkEdit: ({ item }) => {
      dispatch(
        actions.handleOnCancelCustomLinkEdit({
          profileId: ownProps.profileId,
          item,
        })
      );
    },
    onSwapCustomLinks: ({ customLinkSource, customLinkTarget }) => {
      dispatch(
        actions.handleSwapCustomLinks({
          profileId: ownProps.profileId,
          customLinkSource,
          customLinkTarget,
        })
      );
    },
    isValidItem: ({ item }) => {
      const itemText = (item && item.text) || '';
      const itemUrl = (item && item.url) || '';
      const cleanItemText = itemText.replace(/ /g, '');
      return cleanItemText !== '' && isValidURL(itemUrl);
    },
  })
)(GridPosts);

// export reducer, actions and action types
export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
