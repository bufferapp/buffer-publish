import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, TextArea } from '@bufferapp/ui';
import { grayDarker } from '@bufferapp/ui/style/colors';
import { fontSize } from '@bufferapp/ui/style/fonts';
import { translationsPropTypes } from '../../utils/commonPropTypes';

const NoteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 16px;
`;

const SubtextText = styled(Text)`
  color: ${grayDarker};
  margin: 8px 0px;
  font-size: ${fontSize};
`;

const NoteSection = ({ note, setNote, translations }) => (
  <Fragment>
    <NoteWrapper>
      <TextArea
        label="Note"
        maxLength="2000"
        value={note}
        placeholder={translations.notePlaceholder}
        onChange={setNote}
        id="noteText"
        fullHeight
        autoFocus
      />
      <SubtextText>{translations.noteSubText}</SubtextText>
    </NoteWrapper>
  </Fragment>
);

NoteSection.propTypes = {
  note: PropTypes.string,
  setNote: PropTypes.func.isRequired,
  translations: translationsPropTypes, // eslint-disable-line react/require-default-props,,
};

NoteSection.defaultProps = {
  note: '',
};

export default NoteSection;
