import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import CreditCardForm from './form';

class StripeWrapper extends Component {
  static propTypes = {
    createSetupIntentRequest: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { stripe: null };
  }

  componentDidMount() {
    const { stripePublishableKey } = this.props;

    if (window.Stripe) {
      this.setState({ stripe: window.Stripe(stripePublishableKey) });
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({ stripe: window.Stripe(stripePublishableKey) });
      });
    }
    const { createSetupIntentRequest } = this.props;
    createSetupIntentRequest();
  }

  render() {
    const { stripe } = this.state;

    return (
      <StripeProvider stripe={stripe}>
        <Elements>
          <CreditCardForm {...this.props} />
        </Elements>
      </StripeProvider>
    );
  }
}

StripeWrapper.propTypes = {
  stripe: PropTypes.any, // eslint-disable-line
  stripePublishableKey: PropTypes.string,
  createSetupIntentRequest: PropTypes.func,
  buttonLabel: PropTypes.string,
  closeButtonLabel: PropTypes.string,
  closeAction: PropTypes.func,
  validating: PropTypes.bool,
};

export default StripeWrapper;
