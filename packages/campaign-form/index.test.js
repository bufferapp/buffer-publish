import React from 'react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { green, purple } from '@bufferapp/ui/style/colors';
import {
  render,
  screen,
  waitFor,
} from '@bufferapp/publish-test-utils/test-utils';
import '@bufferapp/publish-web/components/i18n';
import RPCClient from '@bufferapp/micro-rpc-client';

import CampaignForm from './index';

const campaignForm = () => {
  const input = screen.getByLabelText(/name/i);
  const purpleColor = screen.getByLabelText(/purple/i);
  const greenColor = screen.getByLabelText(/green/i);
  const saveButton = screen.getByRole('button', { name: /save campaign/i });
  const cancelButton = screen.getByRole('button', { name: /cancel/i });

  return {
    input,
    purpleColor,
    greenColor,
    saveButton,
    cancelButton,
  };
};

const initialState = {
  appSidebar: { user: { features: ['campaigns'] } },
};

describe('CampaignForm | user interaction', () => {
  test('entering values in create form enables save option', async () => {
    render(<CampaignForm />, {
      initialState,
    });

    const { input, purpleColor, greenColor, saveButton } = campaignForm();

    expect(purpleColor).toBeChecked();
    expect(saveButton).toBeDisabled();

    await userEvent.type(input, 'Campaign Test');
    expect(input).toHaveValue('Campaign Test');

    userEvent.click(greenColor);

    expect(purpleColor).not.toBeChecked();
    expect(greenColor).toBeChecked();
    expect(saveButton).not.toBeDisabled();

    userEvent.click(saveButton);

    expect(RPCClient.prototype.call).toHaveBeenCalledWith('createCampaign', {
      color: green,
      name: 'Campaign Test',
    });
    expect(RPCClient.prototype.call).toHaveBeenCalledTimes(1);
  });

  test('entering values in update form enables save option', async () => {
    const campaignId = '18027';
    const campaign = {
      id: campaignId,
      _id: campaignId,
      name: 'Test Campaign',
      color: green,
      globalOrganizationId: '1',
      channels: [],
    };

    RPCClient.prototype.call = jest.fn(() => {
      return Promise.resolve({ ...campaign });
    });

    render(<CampaignForm editMode />, {
      initialState: {
        ...initialState,
        campaignForm: { campaignId, isLoading: false },
      },
    });

    expect(RPCClient.prototype.call).toHaveBeenCalledWith('getCampaign', {
      campaignId,
      fullItems: false,
      past: false,
    });
    expect(RPCClient.prototype.call).toHaveBeenCalledTimes(1);

    const { input, purpleColor, greenColor, saveButton } = campaignForm();
    await waitFor(() => expect(input).toHaveValue('Test Campaign'));
    await waitFor(() => expect(greenColor).toBeChecked());

    userEvent.click(purpleColor);
    expect(purpleColor).toBeChecked();

    userEvent.clear(input);
    await userEvent.type(input, 'Campaign updated');
    expect(input).toHaveValue('Campaign updated');
    expect(saveButton).not.toBeDisabled();

    userEvent.click(saveButton);

    expect(RPCClient.prototype.call).toHaveBeenCalledWith('updateCampaign', {
      campaignId,
      color: purple,
      name: 'Campaign updated',
    });
    expect(RPCClient.prototype.call).toHaveBeenCalledTimes(2);
  });

  test('not entering all values in the form disables save button', () => {
    render(<CampaignForm />, {
      initialState,
    });

    const { purpleColor, saveButton } = campaignForm();

    expect(purpleColor).toBeChecked();
    expect(saveButton).toBeDisabled();
  });

  test('user should access create form when having the feature flip', () => {
    render(<CampaignForm />, {
      initialState,
    });

    expect(screen.getByRole('heading')).toHaveTextContent(/create campaign/i);
  });

  test.skip('user should not be able to access campaigns without having the feature flip', async () => {
    render(<CampaignForm />, {
      initialState: {
        appSidebar: { user: { features: [''] } },
      },
    });

    expect(screen.queryByRole('heading')).toBeNull();
  });

  test('a11y | campaign form is accessible', async () => {
    const { container } = render(<CampaignForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
