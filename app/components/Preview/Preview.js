import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import './style.scss';

export default class Preview extends Component {
  static propTypes = {
    nodes: PropTypes.string,
  }

  static defaultProps = {
    nodes: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,  // eslint-disable-line
      hasError: false // eslint-disable-line
    };
  }

  shouldComponentUpdate(newProps, oldProps) {
    return newProps.nodes !== oldProps.nodes;
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line
    this.setState({ hasError: true });
    // eslint-disable-next-line
    logErrorToMyService(error, info);
  }

  render() {
    return (
      <div>
        <div
          className="react-mathjax-preview"
          ref={(node) => { this.preview = node; }}
        >
          {Parser(this.props.nodes)}
        </div>
      </div>
    );
  }
}
