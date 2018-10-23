import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import hljs from 'highlight.js';
import './style.scss';

const md = require('markdown-it')({
  html: true,
  xhtmlOut: false,
  breaks: true,
  langPrefix: 'language-',
  linkify: false,
  typographer: true,
  quotes: '“”‘’',
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) { } // eslint-disable-line
    }

    return '';
  }
})
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-highlightjs'), { auto: true, code: true })
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-ins'))
  .use(require('libs/mathParse')());

export default class Preview extends Component {
  static propTypes = {
    math: PropTypes.string,
  }

  static defaultProps = {
    math: ''
  }

  constructor(props) {
    super(props);
    this.delay = 1000;
    this.timeout = null;
    this.state = {
      loaded: false,  // eslint-disable-line
      hasError: false, // eslint-disable-line
      math: '', // eslint-disable-line
    };
  }

  componentWillMount() {
    this.Update();
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClick, false);
    // const node = ReactDOM.findDOMNode(this);
    // console.log(node)
    // const mainElement = node.querySelector('main');
    // mainElement.addEventListener('scroll', this.onScroll);
  }


  componentWillReceiveProps() {
    this.Update();
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.math) return false;
    return nextProps.math !== this.state.math;
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line
    this.setState({ hasError: true });
    // eslint-disable-next-line
    logErrorToMyService(error, info);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick, false);
  }

  mathConverter() {
    this.timeout = null;
    const data = md.render(this.props.math);
    this.setState({ math: data });
  }

  Update() {
    const self = this;
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        md.render(this.props.math);
        self.mathConverter(self);
      }, this.delay);
    }
  }

  handleClick = (e) => {
    const domNode = e.target.attributes;
    if (domNode.length > 1 && domNode[1].value === 'clickable-link') {
      const domID = domNode[2].value;
      document.getElementById(domID).scrollIntoView({ behavior: 'smooth' });
    }
  };

  scrollSync = (point) => {
    this.preview.scrollTop = point.top;
  }

  render() {
    return (
      <div
        className="react-mathjax-preview result-pane"
        ref={(node) => { this.preview = node; }}
      >
        {Parser(this.state.math)}
      </div>
    );
  }
}
