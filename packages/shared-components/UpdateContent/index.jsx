import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UpdateMediaContent from '../UpdateMediaContent';
import UpdateAttachmentContent from '../UpdateAttachmentContent';
import UpdateTextContent from '../UpdateTextContent';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: ${props => (props.isLink ? 'column' : 'row')};
`;

const UpdateContent = ({ ...props }) => {
  const { type, linkAttachment, basic, links, text } = props;
  const isMedia =
    type === 'image' || type === 'video' || type === 'multipleImage';
  const isLink = type === 'link';

  return (
    <ContentWrapper isLink={isLink}>
      <UpdateTextContent basic={basic} links={links} text={text} />
      {isLink && <UpdateAttachmentContent linkAttachment={linkAttachment} />}
      {isMedia && <UpdateMediaContent {...props} />}
    </ContentWrapper>
  );
};

UpdateContent.propTypes = {
  type: PropTypes.oneOf(['text', 'image', 'multipleImage', 'link', 'video'])
    .isRequired,
  linkAttachment: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    thumbnailUrl: PropTypes.string,
  }),
  basic: PropTypes.bool,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      displayString: PropTypes.string,
      expandedUrl: PropTypes.string,
      indices: PropTypes.arrayOf(PropTypes.number),
      rawString: PropTypes.string,
    })
  ),
  text: PropTypes.string,
};

UpdateContent.defaultProps = {
  linkAttachment: {},
  basic: false,
  links: [],
  text: '',
};

export default UpdateContent;