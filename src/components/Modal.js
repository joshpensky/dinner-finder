import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { toggleModal } from 'actions/modal';
import PropTypes from 'prop-types';
import { P } from 'style';
import { black, blue, borderRadius, clearRed, grayBg, grayText, maxTextWidth, red, white, systemFont } from 'style/constants';
import { domainToASCII } from 'url';

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
  top: 125px;
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
  border-bottom: 1px solid ${grayBg};
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
  color: ${props => props.main ? white : grayText};
  background-color: ${props => props.main ? blue : grayBg};
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
    this._topScroll = 0;
    this._hide = this._hide.bind(this);
    this.buttonAction = this.buttonAction.bind(this);
    this.onHide = this.onHide.bind(this);
    this.stopBodyScroll = this.stopBodyScroll.bind(this);
  }

  setState(nextState, callback) {
    let updateBody = this.state.visible !== nextState.visible;
    super.setState(nextState, () => {
      if (callback) callback();
      if (updateBody) this.stopBodyScroll();
    });
  }

  componentDidMount() {
    this._isMounted = true;
  }
  
  componentWillUnmount() {
    this._isMounted = false;
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
      document.body.style.top = `0px`;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    if (!visible) {
      this.onHide();
    }
    this.setState(Object.assign({
      actions: nextProps.actions,
    }, visible ? { visible } : {}));
  }

  stopBodyScroll() {
    if (this.state.visible) {
      this._topScroll = Math.max(0, window.scrollY);
      document.body.classList.add('modal-open');
      document.body.style.top = `-${this._topScroll}px`;
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.top = `0px`;
      window.scrollTo(0, this._topScroll);
    }
  }

  _hide() {
    this.props.toggleModal(false);
    this.setState({
      visible: false,
    });
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
          <Header>{this.props.title}</Header>
          <Description>{this.props.description}</Description>
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

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    main: PropTypes.bool,
    action: PropTypes.func,
  })),
};

export const mapStateToProps = state => state.modal;

export default connect(mapStateToProps, { toggleModal })(Modal);