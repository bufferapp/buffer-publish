export default (
  state = { stripePublishableKey: null, stripe: null },
  action
) => {
  switch (action.type) {
    case 'INIT_STRIPE_DETAILS':
      return {
        ...state,
        stripe: window._stripe,
        stripePublishableKey: window.STRIPE_PUBLISHABLE_KEY,
      };
    default:
      return state;
  }
};
