import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, Button, Tooltip } from '@bufferapp/ui';
import Select from '@bufferapp/ui/Select';
import MoreIcon from '@bufferapp/ui/Icon/Icons/More';
import TrashIcon from '@bufferapp/ui/Icon/Icons/Trash';
import { grayDark, grayDarker } from '@bufferapp/ui/style/colors';
import { Divider } from '@bufferapp/components';

const HashtagText = styled(Text)`
  font-size: 12px;
  line-height: 21px;
  color: ${props => (props.hover ? grayDarker : grayDark)};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  transition: color 0.3s;
`;

const nameWrapperStyles = {
  paddingRight: '8px',
  flex: '0 1 auto',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const CounterText = styled(Text)`
  color: ${props => (props.hover ? grayDarker : grayDark)};
  flex: 0 1 auto;
`;

const cardStyle = {
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  transition: 'background-color 0.3s',
};

const cardHoverStyle = {
  backgroundColor: 'rgba(107, 129, 255, 0.15)',
  transition: 'all 0.1s ease-out',
};

const buttonWrapperStyle = {
  display: 'flex',
  marginLeft: '16px',
  alignItems: 'center',
};

const getItemWrapperStyle = ({ state }) => {
  let style = cardStyle;
  if (state.hover) {
    style = { ...style, ...cardHoverStyle };
  }
  return style;
};

class HashtagGroupItem extends Component {
  state = {
    hover: false,
  };

  render() {
    const {
      snippetId,
      name,
      numberOfHashtags,
      hashtags,
      onInsertHashtagGroupClick,
      onDeleteHashtagGroupClick,
    } = this.props;
    const { hover } = this.state;

    return (
      <Fragment>
        <div
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
          style={getItemWrapperStyle({ state: this.state })}
        >
          <div style={{ flex: '1', overflow: 'hidden' }}>
            <Tooltip label={hashtags} position="top">
              <div style={{ display: 'flex' }}>
                <span style={nameWrapperStyles}>
                  <Text type="label">{name}</Text>
                </span>
                <CounterText type="label" hover>
                  {numberOfHashtags}
                </CounterText>
              </div>
              <HashtagText hover>{hashtags}</HashtagText>
            </Tooltip>
          </div>
          {hover && (
            <div style={buttonWrapperStyle}>
              <Button
                type="primary"
                size="small"
                label="Insert"
                onClick={onInsertHashtagGroupClick}
              />
              <Select
                onSelectClick={selectedItem => selectedItem.onItemClick()}
                label="Click me"
                icon={<MoreIcon />}
                type="primary"
                items={[
                  {
                    id: 'deleteHashtagGroup',
                    title: 'Delete Group',
                    icon: <TrashIcon color="gray" />,
                    onItemClick: () =>
                      onDeleteHashtagGroupClick(name, hashtags, snippetId),
                  },
                ]}
                hasIconOnly
                xPosition="right"
                yPosition="bottom"
                hideSearch
              />
            </div>
          )}
        </div>
        <Divider marginTop="0" marginBottom="0" />
      </Fragment>
    );
  }
}

HashtagGroupItem.propTypes = {
  onInsertHashtagGroupClick: PropTypes.func.isRequired,
  onDeleteHashtagGroupClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  numberOfHashtags: PropTypes.number.isRequired,
  hashtags: PropTypes.string.isRequired,
  snippetId: PropTypes.string.isRequired,
};

HashtagGroupItem.defaultProps = {};

export default HashtagGroupItem;
