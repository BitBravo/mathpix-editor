import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import ReactDOM from 'react-dom';
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
  .use(require('libs/mathParse')())
  .use(require('libs/lineNumber'));

export default class Preview extends Component {
  static propTypes = {
    math: PropTypes.string,
    scrollhandler: PropTypes.func,
    focusControl: PropTypes.func
  }

  static defaultProps = {
    math: ''
  }

  constructor(props) {
    super(props);
    this.delay = 1000;
    this.timeout = null;
    this.previewActiveFlag = false;
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
    this.preview.addEventListener('scroll', this.handleScroll);
    this.preview.addEventListener('mouseenter', () => {
      this.previewActiveFlag = true;
      this.props.focusControl(true);
    });
    this.preview.addEventListener('mouseleave', () => {
      this.previewActiveFlag = false;
      this.props.focusControl(false);
    });
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
    this.preview.removeEventListener('scroll', this.handleScroll);
    this.preview.removeEventListener('mouseenter', this.focus);
    this.preview.removeEventListener('mouseleave', this.focus);
  }

  focus = (e) => {
    console.log(e);
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
    const className = `line${point.lineNumber}`;
    const child = document.querySelector(`.${className}`);
    this.preview.scrollTop = (child.offsetTop - point.offset);
  }

  handleScroll = (e) => {
    if (!this.previewActiveFlag) return;
    const elements = document.querySelectorAll('.line-block');
    let lineNumber = 0;
    let offset = 0;
    const scrTop = e.srcElement.scrollTop;
    for (let i = 0; i < elements.length; i += 1) {
      offset = elements[i].offsetTop;
      if (offset > scrTop) {
        lineNumber = elements[i].attributes['data-line'].value;
        this.props.scrollhandler(lineNumber, (offset - scrTop));
        return;
      }
    }
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
