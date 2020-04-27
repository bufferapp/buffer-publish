import React from 'react';
import PropTypes from 'prop-types';
import { List, Text } from '@bufferapp/components';
import { Button } from '@bufferapp/ui';
import styled from 'styled-components';
import { WithFeatureLoader } from '@bufferapp/product-features';
import Post from '../Post';
import Story from '../Story';
import BannerAdvancedAnalytics from '../BannerAdvancedAnalytics';

const RemindersButtons = styled.div``;

const ShareAgainWrapper = styled.div`
  padding-left: 1rem;
  padding-bottom: 0.5rem;
  min-width: 146px;
`;

const PostStyle = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const HeaderStyle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: ${props => (props.isFirstItem ? '2rem' : '1rem')};
  margin-left: 0.5rem;
`;

/* eslint-disable react/prop-types */

const renderPost = ({
  post,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onCampaignTagClick,
  onDropPost,
  onSwapPosts,
  isSent,
  isBusinessAccount,
  isPastReminder,
  hasFirstCommentFlip,
  hasCampaignsFeature,
  userData,
  onPreviewClick,
  profileService,
  profileServiceType,
}) => {
  const campaignId = post.campaignDetails?.id ?? null;
  const postWithEventHandlers = {
    ...post,
    service_geolocation_name: post.locationName,
    source_url: post.sourceUrl,
    subprofile_id: post.subprofileID,
    service_user_tags: post.userTags,
    key: post.id,
    onDeleteConfirmClick: () => onDeleteConfirmClick({ post }),
    onEditClick: () => onEditClick({ post }),
    onShareNowClick: () => onShareNowClick({ post }),
    onCampaignTagClick: () => onCampaignTagClick(campaignId),
    onDropPost,
    onSwapPosts,
    isSent,
    isBusinessAccount,
    isPastReminder,
    hasFirstCommentFlip,
    hasCampaignsFeature,
    userData,
    onPreviewClick,
    profileService,
    profileServiceType,
  };
  const PostComponent = post.type === 'storyGroup' ? Story : Post;

  return <PostComponent {...postWithEventHandlers} />;
};

const Header = ({ listHeader, isFirstItem }) => (
  <HeaderStyle isFirstItem={isFirstItem}>
    <Text color="black">{listHeader}</Text>
  </HeaderStyle>
);

/* eslint-enable react/prop-types */

const PostList = ({
  listHeader,
  posts,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onCampaignTagClick,
  onDropPost,
  onSwapPosts,
  onShareAgainClick,
  onMobileClick,
  isSent,
  isManager,
  isPastReminder,
  isBusinessAccount,
  features,
  hasFirstCommentFlip,
  hasCampaignsFeature,
  index,
  userData,
  onPreviewClick,
  showAnalyzeBannerAfterFirstPost,
  isAnalyzeCustomer,
  profileService,
  profileServiceType,
}) => (
  <React.Fragment>
    <Header listHeader={listHeader} isFirstItem={index === 0} />
    <List
      items={posts.map(post => (
        <React.Fragment>
          <PostStyle
            id={`update-${post.id}`}
            className={[
              'update',
              `post_${post.profile_service}`,
              post.postDetails && post.postDetails.isRetweet
                ? 'is_retweet'
                : 'not_retweet',
            ].join(' ')}
          >
            {renderPost({
              post,
              onDeleteConfirmClick,
              onEditClick,
              onShareNowClick,
              onCampaignTagClick,
              onDropPost,
              onSwapPosts,
              onShareAgainClick,
              isSent,
              isBusinessAccount,
              isPastReminder,
              hasFirstCommentFlip,
              hasCampaignsFeature,
              userData,
              onPreviewClick,
              profileService,
              profileServiceType,
            })}
            {(!features.isFreeUser() || isBusinessAccount) && !isPastReminder && (
              <ShareAgainWrapper>
                <Button
                  type="secondary"
                  label="Share Again"
                  onClick={() => {
                    onShareAgainClick({ post });
                  }}
                />
              </ShareAgainWrapper>
            )}
            {isPastReminder && (
              <RemindersButtons>
                {(!features.isFreeUser() || isBusinessAccount) && (
                  <ShareAgainWrapper>
                    <Button
                      fullWidth
                      type="secondary"
                      label="Share Again"
                      onClick={() => {
                        onShareAgainClick({ post });
                      }}
                    />
                  </ShareAgainWrapper>
                )}
                {isManager && (
                  <ShareAgainWrapper>
                    <Button
                      fullWidth
                      type="secondary"
                      label="Send to Mobile"
                      onClick={() => {
                        onMobileClick({ post });
                      }}
                    />
                  </ShareAgainWrapper>
                )}
              </RemindersButtons>
            )}
          </PostStyle>
          {showAnalyzeBannerAfterFirstPost && index === 0 ? (
            <BannerAdvancedAnalytics isAnalyzeCustomer={isAnalyzeCustomer} />
          ) : null}
        </React.Fragment>
      ))}
    />
  </React.Fragment>
);

PostList.propTypes = {
  index: PropTypes.number,
  listHeader: PropTypes.string,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    })
  ),
  onDeleteConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onShareNowClick: PropTypes.func,
  onCampaignTagClick: PropTypes.func,
  onDropPost: PropTypes.func,
  onSwapPosts: PropTypes.func,
  onShareAgainClick: PropTypes.func,
  onMobileClick: PropTypes.func,
  onPreviewClick: PropTypes.func,
  isSent: PropTypes.bool,
  isManager: PropTypes.bool,
  isPastReminder: PropTypes.bool,
  isBusinessAccount: PropTypes.bool,
  hasFirstCommentFlip: PropTypes.bool,
  hasCampaignsFeature: PropTypes.bool,
  showAnalyzeBannerAfterFirstPost: PropTypes.bool,
  isAnalyzeCustomer: PropTypes.bool,
  features: PropTypes.object.isRequired, // eslint-disable-line
};

PostList.defaultProps = {
  index: 0,
  posts: [],
  isAnalyzeCustomer: false,
  showAnalyzeBannerAfterFirstPost: false,
  onPreviewClick: () => {},
};

export default WithFeatureLoader(PostList);
