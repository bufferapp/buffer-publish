import React from 'react';
import PropTypes from 'prop-types';
import {
  Toggle, Input, Card,
} from '@bufferapp/components';
import { Text, Button } from '@bufferapp/ui';
import { Field, reduxForm } from 'redux-form';

const googleAnalyticsWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0.5rem 0',
};

const enableGoogleAnalyticsStyle = {
  marginBottom: '0.5rem',
};

const generalWrapperStyle = {
  display: 'flex',
  marginBottom: '0.5rem',
};

const enableCampaignWrapperStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flex: '1 1 0%',
};

const formWrapperStyle = {
  marginBottom: '0.5rem',
  width: '50%',
};

const headerTextWrapperStyle = {
  display: 'flex',
};

const rightContainerStyle = {
  flex: 0.3,
};

const saveChangesStyle = {
  whiteSpace: 'nowrap',
  marginTop: '1rem',
};

const switchStyle = {
  ...rightContainerStyle,
  whiteSpace: 'nowrap',
  marginLeft: '1rem',
  textAlign: 'right',
};

const textStyle = {
  flex: 1,
};

const inputStyle = {
  marginTop: '0.5rem',
};

const customizeButtonStyle = {
  marginTop: '0.5rem',
  flexBasis: '170px',
};

const GoogleAnalytics = ({
  googleAnalyticsIsEnabled,
  showGACustomizationForm,
  onShowGACustomizationFormClick,
  onToggleGoogleAnalyticsClick,
  onSaveGATrackingSettingsClick,
  utmCampaign,
  onChangeUtmCampaign,
  utmSource,
  onChangeUtmSource,
  utmMedium,
  onChangeUtmMedium,
  isManager,
  isBusinessAccount,
  features,

  }) => (
    <div style={googleAnalyticsWrapperStyle}>
      <div style={headerTextWrapperStyle}>
        <Text type="h3">
          Google Analytics Campaign Tracking
        </Text>
      </div>
      <div style={generalWrapperStyle}>
        <div style={textStyle}>
          <Text type="p">
            With campaign tracking enabled in Buffer, you will be able to see how much traffic
            you receive from social media posts directly inside your Google Analytics dashboard. You
            can disable this below if you&rsquo;d like.
          </Text>
        </div>
        <div style={rightContainerStyle} />
      </div>
      <div style={enableCampaignWrapperStyle}>
        <div style={textStyle}>
          <div style={headerTextWrapperStyle}>
            <Text type="p">
              <strong>Enable Campaign Tracking</strong>
            </Text>
          </div>
          <div style={enableGoogleAnalyticsStyle}>
            <Text type="p">
              This enables Google Analytics Tracking via UTM parameters added to links you share.
            </Text>
            <div>
              <Text type="p">
                (This will override any existing UTM parameters)
              </Text>
            </div>
          </div>
        </div>
        <div style={switchStyle}>
          <Toggle
            disabled={!isManager}
            onText={'Enabled'}
            offText={'Disabled'}
            on={googleAnalyticsIsEnabled}
            size={'small'}
            onClick={() => onToggleGoogleAnalyticsClick(!googleAnalyticsIsEnabled)}
          />
        </div>
      </div>
      {showGACustomizationForm && googleAnalyticsIsEnabled &&
        <div>
          <Card noBorder noPadding>
            <form style={formWrapperStyle}>
              <div style={inputStyle}>
                <Text type="label">
                  Campaign Name
                </Text>
                <Field
                  name={'utmCampaign'}
                  component={Input}
                  type={'text'}
                  placeholder={'buffer'}
                  input={{
                    value: utmCampaign,
                    onChange: onChangeUtmCampaign,
                  }}
                />
              </div>
              <div style={inputStyle}>
                <Text type="label">
                  Campaign Source
                </Text>
                <Input
                  type="text"
                  input={{
                    value: utmSource,
                    onChange: onChangeUtmSource,
                  }}
                  name={'utmSource'}
                  placeholder={'bufferapp.com'}
                />
              </div>
              <div style={inputStyle}>
                <Text type="label">
                  Campaign Medium
                </Text>
                <Input
                  type="text"
                  input={{
                    value: utmMedium,
                    onChange: onChangeUtmMedium,
                  }}
                  name={'utmMedium'}
                  placeholder={'social'}
                />
              </div>
              <div style={saveChangesStyle}>
                <Button
                  type="primary"
                  label="Update tracking"
                  onClick={(e) => {
                    e.preventDefault();
                    onSaveGATrackingSettingsClick(utmCampaign, utmSource, utmMedium);
                  }}
                />
              </div>
            </form>
          </Card>
        </div>
      }
      {!showGACustomizationForm && googleAnalyticsIsEnabled &&
      (!features.isFreeUser() || (isBusinessAccount && isManager)) &&
        <div style={customizeButtonStyle}>
          <Button
            type="secondary"
            label="Customize Campaign Tracking"
            onClick={onShowGACustomizationFormClick}
          />
        </div>
      }
    </div>
);

GoogleAnalytics.defaultProps = {
  trackingSettings: null,
  utmCampaign: null,
  utmSource: null,
  utmMedium: null,
};

GoogleAnalytics.propTypes = {
  showGACustomizationForm: PropTypes.bool.isRequired,
  onShowGACustomizationFormClick: PropTypes.func.isRequired,
  googleAnalyticsIsEnabled: PropTypes.bool.isRequired,
  onToggleGoogleAnalyticsClick: PropTypes.func.isRequired,
  onSaveGATrackingSettingsClick: PropTypes.func.isRequired,
  onChangeUtmCampaign: PropTypes.func.isRequired,
  onChangeUtmSource: PropTypes.func.isRequired,
  onChangeUtmMedium: PropTypes.func.isRequired,
  utmCampaign: PropTypes.string,
  utmSource: PropTypes.string,
  utmMedium: PropTypes.string,
  isManager: PropTypes.bool.isRequired,
  isBusinessAccount: PropTypes.bool.isRequired,
  features: PropTypes.any.isRequired, // eslint-disable-line
};

export default reduxForm({
  form: 'gaCustomForm',
})(GoogleAnalytics);
