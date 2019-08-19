import getSource from './source';

describe('Plans Utils', () => {
  describe('returns correct source', () => {
    it('returns pro upgrade source', () => {
      const source = getSource({ newPlan: 'pro', currentPlan: 'free' });
      expect(source).toEqual('plans_pro_upgrade');
    });
    it('returns pro downgrade source', () => {
      const source = getSource({ newPlan: 'pro', currentPlan: 'small' });
      expect(source).toEqual('plans_pro_downgrade');
    });
    it('returns premium upgrade source', () => {
      const source = getSource({ newPlan: 'premium_business', currentPlan: 'pro' });
      expect(source).toEqual('plans_premium_upgrade');
    });
  });
});