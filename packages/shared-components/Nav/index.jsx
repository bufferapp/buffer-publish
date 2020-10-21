import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { grayLight } from '@bufferapp/ui/style/colors';

const NavList = styled.ul`
  margin: 0;
  padding: 0;
  position: relative;
  border-bottom: 1px solid ${grayLight};
  box-sizing: border-box;
`;

const NavWrapper = styled.nav`
  padding: 0 0.5rem;
`;

const Nav = ({ children, disabled }) => (
  <NavWrapper
    aria-label={
      disabled ? 'Connect a social account to explore the tabs' : undefined
    }
    aria-disabled={disabled}
  >
    <NavList>{children}</NavList>
  </NavWrapper>
);

Nav.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

Nav.defaultProps = {
  disabled: false,
};

export default Nav;
