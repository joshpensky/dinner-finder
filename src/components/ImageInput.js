import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { P } from 'style';
import { blue, borderRadius, clearBlue, clearGreen, clearRed, grayBg, green, placeholderColor, red, screenSm, screenMd, systemFont, white } from 'style/constants';

const BYTE_SIZE = 1048576;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Preview = styled.div`
  display: table;
  width: 100%;
  height: 0;
  background-color: ${grayBg};
  background-image: url("${props => props.source}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: ${props => props.circle ? '50%' : borderRadius};
  margin-bottom: ${props => props.circle ? 25 : 15}px;
  position: relative;
  z-index: 1;

  ${props => (props.square || props.circle) ? css`
    padding-top: 100%;
  ` : css`
    padding-top: calc(100% / 3);

    @media (max-width: ${screenMd}) {
      padding-top: calc(100% / 2);
    }

    @media (max-width: ${screenSm}) {
      padding-top: calc(200% / 3);
    }
  `}

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 30px);
    height: calc(100% - 30px);
    border: 2px dashed ${props => props.active ? green : placeholderColor};
    opacity: ${props => props.source ? 0 : 1};
    border-radius: ${props => props.circle ? '50%' : borderRadius};
    transition: border 0.2s ease-out;
    z-index: 3;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${clearGreen};
    border-radius: ${borderRadius};
    opacity: ${props => props.active ? 0.6 : 0};
    transition: 0.2s ease-out;
    z-index: 3;
  }
`;

const Hint = styled(P)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  z-index: 2;
  color: ${props => props.active ? green : placeholderColor};
  transition: 0.2s ease-out;
  text-align: center;
`;

const Input = styled.input.attrs({
  type: 'file',
  accept: 'image/*',
})`
  display: none;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const Upload = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${clearBlue};
  color: ${blue};
  border-radius: ${borderRadius};
  flex: 1;
  font-family: ${systemFont};
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
  padding: 14px 0;
  cursor: pointer;
`

const Clear = styled.div`
  width: 44px;
  height: 44px;
  background-color: ${clearRed};
  margin-left: 10px;
  border-radius: ${borderRadius};
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 12px;
    background-color: ${red};
    width: 20px;
    height: 4px;
    transform: translateY(-50%) rotate(45deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 20px;
    background-color: ${red};
    width: 4px;
    height: 20px;
    transform: translateY(-50%) rotate(45deg);
  }
`

class ImageInput extends Component {
  constructor(props) {
    super(props);
    var div = document.createElement('div');
    this.state = {
      isDragUpload: 'draggable' in div || ('ondragstart' in div && 'ondrop' in div),
      dropActive: false,
      maxSize: (props.maxSize || 5) * BYTE_SIZE,
      selectedFile: null,
      selectedFilePreview: '',
      initPreviewed: false,
    };

    this.fileHandler = this.fileHandler.bind(this);
    this.onClear = this.onClear.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.dropTarget = this.dropTarget.bind(this);
    this.dropLeave = this.dropLeave.bind(this);
    this.droppedFile = this.droppedFile.bind(this);
  }

  componentDidMount() {
    if (this.state.isDragUpload) {
      ['dragover', 'dragenter'].forEach(e => {
        this.preview.addEventListener(e, this.dropTarget);
      });
      ['dragleave', 'dragend', 'drop'].forEach(e => {
        this.preview.addEventListener(e, this.dropLeave);
      });
      this.preview.addEventListener('drop', this.droppedFile);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { preview } = nextProps;
    if (!this.state.initPreviewed && preview && preview.length > 0 && this.state.selectedFile === null) {
      this.setState({
        initPreviewed: true,
        selectedFilePreview: preview,
      })
    }
  }

  dropTarget(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.dropActive) {
      this.setState({
        dropActive: true,
      });
    }
  }

  dropLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.dropActive) {
      this.setState({
        dropActive: false,
      });
    }
  }

  droppedFile(e) {
    e.preventDefault();
    e.stopPropagation();
    this.fileHandler({
      target: e.dataTransfer
    });
  }

  fileHandler(e) {
    const file = e.target.files[0];
    if (file.type.includes('image/') && file.size <= this.state.maxSize) {
      this.setState({
        selectedFile: file,
        selectedFilePreview: URL.createObjectURL(file),
      }, () => {
        this.props.onChange({
          target: {
            file: this.state.selectedFile,
          },
        });
      });
    }
  }

  onClear() {
    const { onClear } = this.props;
    if (onClear) {
      onClear().then(this.clearSelection).catch(err => {
        if (err) console.log(err);
      });
    } else {
      this.clearSelection();
    }
  }

  clearSelection() {
    this.setState({
      selectedFile: null,
      selectedFilePreview: '',
    }, () => {
      this.props.onChange({
        target: {
          file: null,
        },
      });
    });
  }

  render() {
    const { dropActive: active, selectedFilePreview } = this.state;
    return (
      <Container>
        <Input id={this.props.id} onChange={this.fileHandler} />
        <Preview source={selectedFilePreview} active={active} circle={this.props.circle} square={this.props.square} innerRef={ref => this.preview = ref}>
          {this.state.isDragUpload && selectedFilePreview.length === 0 && <Hint active={active}>Drag to upload</Hint>}
        </Preview>
        <Buttons>
          <Upload htmlFor={this.props.id}>Upload</Upload>
          {selectedFilePreview.length > 0 && <Clear onClick={this.onClear} />}
        </Buttons>
      </Container>
    );
  }
}

export default ImageInput;