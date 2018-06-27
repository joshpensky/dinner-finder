import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { P } from 'style';
import { black, blue, borderRadius, clearBlue, clearRed, grayBg, grayText, maxTextWidth, red, white, systemFont } from 'style/constants';

const DisablePage = styled.div`
  content: '';
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${black};
  opacity: ${props => props.visible ? 0.35 : 0};
  transition: opacity ${props => props.visible ? 0.2 : 0.3}s ease-out;
  pointer-events: ${props => props.visible ? 'all' : 'none'};
  z-index: 999;
`;

const Container = styled.div`
  z-index: 1000;
  padding: 0 14px;
  position: fixed;
  left: 50%;
  top: 15%;
  width: calc(100% - 30px);
  box-sizing: border-box;
  max-width: ${maxTextWidth};
  border-radius: ${borderRadius};
  background-color: ${white};
  transform: translate(-50%, -50%) translateY(${props => props.visible ? 0 : -30}px);
  transition: 0.2s ease-out;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'all' : 'none'};
`;

const Header = styled.div`
  font-family: ${systemFont};
  font-size: 20px;
  line-height: 20px;
  font-weight: 600;
  padding: 16px 8px 12px;
  padding-right: 49px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  position: relative;
`;

const CloseButton = styled.div`
  width: 49px;
  height: 49px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${clearRed};
  border-top-right-radius: ${borderRadius};
  z-index: 1;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 14px;
    background-color: ${red};
    width: 20px;
    height: 4px;
    transform: translateY(-50%) rotate(45deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 22px;
    background-color: ${red};
    width: 4px;
    height: 20px;
    transform: translateY(-50%) rotate(45deg);
  }
`;

const Description = styled(P)`
  padding: 12px 8px 0px;
  margin-bottom: 20px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 16px;
`

const ActionButton = styled.div`
  cursor: pointer;
  font-family: ${systemFont};
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: ${borderRadius};
  color: ${props => props.main ? blue : grayText};
  background-color: ${props => props.main ? clearBlue : grayBg};
  margin-left: 6px;

  &:first-child {
    margin-left: 0px;
  }
`

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: this.props.actions || [],
      visible: this.props.visible || false,
    };

    this._isMounted = false;
    this._hide = this._hide.bind(this);
    this.buttonAction = this.buttonAction.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      this.onHide();
    } else {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  _hide() {
    if (this._isMounted) {
      this.setState({
        visible: false,
      });
    }
  }

  buttonAction(e) {
    const { index } = e.target.dataset,
          { action } = this.props.actions[index];
    return action
      ? action().then(this.onHide)
      : this.onHide();
  }

  onHide() {
    let { onHide } = this.props;
    return onHide
      ? onHide().then(this._hide)
      : this._hide();
  }

  render() {
    const { actions, visible } = this.state;
    return (
      <Fragment>
        <DisablePage visible={visible} />
        <Container visible={visible}>
          <CloseButton onClick={this.onHide} />
          <Header>Are you sure...</Header>
          <Description>Are you sure you want to delete Amelia's Taqueria?</Description>
          <Buttons>
            {actions.map((a, i) => (
              <ActionButton key={i} data-index={i} main={a.main} onClick={this.buttonAction}>
                {a.text}
              </ActionButton>
            ))}
          </Buttons>
        </Container>
      </Fragment>
    );
  }
}

export default Modal;