import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@bufferapp/ui';
import Input from '@bufferapp/ui/Input';

import { ButtonWrapper, StyledLabel, MaxCount } from './style';

const UserTagInput = ({
  translations,
  inputValue,
  setInputValue,
  coordinates,
  addTag,
  reachedMaxLimit,
}) => {
  if (reachedMaxLimit) {
    return (
      <MaxCount>
        <Text>{translations.maxLimitText}</Text>
      </MaxCount>
    );
  }
  return (
    <Fragment>
      <Input
        type="input"
        onChange={e => {
          setInputValue(e.target.value);
        }}
        placeholder={translations.placeholder}
        value={inputValue}
        name="tagInput"
        label={translations.inputLabel}
      />
      <StyledLabel>@</StyledLabel>
      <ButtonWrapper>
        <Button
          type="primary"
          size="small"
          onClick={addTag}
          label={translations.inputBtnLabel}
          disabled={!coordinates.y}
        />
      </ButtonWrapper>
    </Fragment>
  );
};

UserTagInput.propTypes = {
  translations: PropTypes.shape({
    placeholder: PropTypes.string,
    inputLabel: PropTypes.string,
    inputBtnLabel: PropTypes.string,
    maxLimitText: PropTypes.string,
  }).isRequired,
  reachedMaxLimit: PropTypes.bool.isRequired,
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  coordinates: PropTypes.shape({ y: PropTypes.string }).isRequired,
};

export default UserTagInput;
