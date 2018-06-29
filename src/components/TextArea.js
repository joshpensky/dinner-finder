import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { black, blue, borderRadius, grayBg, grayText, placeholderColor, systemFont } from 'style/constants';
import { newlineResolver } from 'utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
`;

const Input = styled.textarea`
  position: relative;
  width: 100%;
  height: ${props => props.height}px;
  resize: none;
  overflow-y: auto;
  padding: 10px 16px;
  box-sizing: border-box;
  color: ${grayText};
  font-family: ${systemFont};
  font-weight: 400;
  font-size: ${props => props.fontSize}px;
  line-height: ${props => props.lineHeight}px;
  vertical-align: middle;
  background-color: ${grayBg};
  outline: none;
  border: none;
  border-radius: ${borderRadius};
  max-height: ${props => props.maxHeight}px;

  &::placeholder {
    color: ${placeholderColor};
  }
`;

const ShadowInput = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  padding: 10px 16px;
  box-sizing: border-box;
  font-family: ${systemFont};
  font-weight: 400;
  font-size: ${props => props.fontSize}px;
  line-height: ${props => props.lineHeight}px;
  vertical-align: middle;
  min-height: ${props => props.minHeight}px;
  pointer-events: none;
  word-wrap: break-word;
  text-wrap: unrestricted;
  visibility: hidden;
`;

class TextArea extends Component {
  constructor(props) {
    super(props);
    let fontSize = 18,
        lineHeight = fontSize * 1.2,
        singleLineHeight = lineHeight + (2 * 10),
        visibleLines = (this.props.visibleLines || 2) - 1;
    this.state = {
      value: this.props.value || '',
      fontSize,
      lineHeight,
      defaultHeight: singleLineHeight + (visibleLines * lineHeight),
      height: singleLineHeight + (visibleLines * lineHeight),
      scrollbarPresent: false,
      maxHeight: this.props.maxHeight || 250,
    };

    this._isMounted = false;
    this.targetMessage = this.targetMessage.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.newLineHandler = this.newLineHandler.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.updateScroll = this.updateScroll.bind(this);
  }

  setState(nextState, callback) {
    if (this._isMounted) {
      super.setState(nextState, callback);
    }
  }

  componentDidMount() {
    this._isMounted = true;
    const { value } = this.state;
    this.targetMessage(value);
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.onResize(nextProps.value);
    }
  }

  onResize(value) {
    this.targetMessage(this.state.value);
  }

  targetMessage(value) {
    this.updateMessage({
      target: {
        value: value,
      },
    });
  }

  updateHeight(height) {
    this.setState({
      height: height,
    }, this.updateScroll);
  }

  updateScroll() {
    this.textBox.scrollTop = this.textBox.scrollHeight - this.textBox.clientHeight;
  }

  updateMessage(e) {
    const { value } = e.target;
    const triggerOnChange = value !== this.state.value;
    if (value.trim().length <= 0) {
      this.updateHeight(this.state.defaultHeight);
    }
    this.setState({ value }, () => {
      if (triggerOnChange) this.onChange();
      const shadowHeight = this.shadowInput.offsetHeight;
      if (shadowHeight !== this.state.height) {
        this.updateHeight(shadowHeight, () => {
          this.updateScroll();
          this.setState({
            scrollbarPresent: this.textBox.clientHeight < this.textBox.scrollHeight,
          });
        });
      }
    });
  }

  onChange() {
    this.props.onChange({
      target: {
        id: this.props.id,
        value: this.state.value,
      }
    });
  }

  newLineHandler(e) {
    if (e.keyCode === 13) {
      if (!this.props.shiftOnly || e.shiftKey) {
        this.updateHeight(this.state.height + this.state.fontSize);
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  render() {
    const { placeholder } = this.props;
    const { fontSize, lineHeight, value } = this.state;
    return (
      <Wrapper>
        <ShadowInput
          innerRef={r => this.shadowInput = r}
          minHeight={this.state.defaultHeight}
          fontSize={fontSize}
          lineHeight={lineHeight}
          scrollbarPresent={this.state.scrollbarPresent}>
          {newlineResolver(value)}
        </ShadowInput>
        <Input 
          innerRef={r => this.textBox = r}
          tabIndex={this.props.tabIndex}
          id={this.props.id}
          value={value}
          placeholder={placeholder}
          onChange={this.updateMessage}
          onKeyDown={this.newLineHandler}
          height={this.state.height}
          maxHeight={this.state.maxHeight}
          fontSize={fontSize}
          lineHeight={lineHeight} />
      </Wrapper>
    );
  }
}

TextArea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  tabIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  visibleLines: PropTypes.number,
  maxHeight: PropTypes.number,
  shiftOnly: PropTypes.bool,
}

export default TextArea;