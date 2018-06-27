import React, { Component } from 'react';
import styled from 'styled-components';
import { black, blue, borderRadius, grayBg, grayText, placeholderColor, systemFont, white } from 'style/constants';
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
  overflow: hidden;
  padding: 10px 16px;
  box-sizing: border-box;
  color: ${grayText};
  font-family: ${systemFont};
  font-weight: 400;
  font-size: ${props => props.fontSize}px;
  line-height: 22px;
  vertical-align: middle;
  background-color: ${grayBg};
  outline: none;
  border: none;
  border-radius: ${borderRadius};

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
  line-height: 22px;
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
    const singleLineHeight = 46,
          fontSize = 18;
    this.state = {
      value: this.props.value || '',
      fontSize,
      defaultHeight: singleLineHeight + fontSize,
      height: singleLineHeight + fontSize,
      scrollbarPresent: false,
    };

    this.onChange = this.onChange.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.newLineHandler = this.newLineHandler.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.updateMessage({
        target: { 
          value: this.state.value
        },
      })
    });
    const { value } = this.state;
    this.updateHeight(this.state.height
      + (value.length <= 0
        ? 0
        : this.state.fontSize * JSON.stringify(value).split(/\r\n|\r|\n/).length));
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.updateMessage({
        target: {
          value: nextProps.value,
        }
      });
    }
  }

  updateHeight(height) {
    this.setState({
      height: height,
    });
  }

  updateMessage(e) {
    const { value: targetValue } = e.target;
    if (targetValue.trim().length <= 0) {
      this.updateHeight(this.state.defaultHeight);
    }
    this.setState({
      value: targetValue,
    }, () => {
      this.onChange();
      const shadowHeight = this.shadowInput.offsetHeight;
      if (shadowHeight !== this.state.height) {
        this.updateHeight(shadowHeight, () => {
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
    if (e.keyCode === 13 && e.shiftKey) {
      this.updateHeight(this.state.height + this.state.fontSize);
    }
  }

  render() {
    const { value } = this.state;
    return (
      <Wrapper>
        <ShadowInput
          innerRef={r => this.shadowInput = r}
          minHeight={this.state.defaultHeight}
          fontSize={this.state.fontSize}
          scrollbarPresent={this.state.scrollbarPresent}>
          {newlineResolver(value)}
        </ShadowInput>
        <Input 
          innerRef={r => this.textBox = r}
          tabIndex={this.props.tabIndex}
          id={this.props.id}
          value={value}
          placeholder={this.props.placeholder}
          onChange={this.updateMessage}
          onKeyDown={this.newLineHandler}
          height={this.state.height}
          fontSize={this.state.fontSize} />
      </Wrapper>
    );
  }
}

export default TextArea;