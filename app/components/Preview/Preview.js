import React, { Component } from 'react';
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
  .use(require('libs/mathParse')())
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-highlightjs'), { auto: true, code: true })
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-ins'))
  .use(require('libs/lineNumber'))
  .use(require('markdown-it-ins'));

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
    this.previewActiveFlag = false;
    this.resultBlock = [];
    this.state = {
      math: '',
    };
  }

  componentWillMount() {
    this.updateMath(this.props.math);
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

  componentWillReceiveProps(nextProps) {
    this.updateMath(nextProps.math);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick, false);
    this.preview.removeEventListener('scroll', this.handleScroll);
    this.preview.removeEventListener('mouseenter', this);
    this.preview.removeEventListener('mouseleave', this);
  }

  getResultCodeBlock = () => {
    const elements = document.querySelectorAll('.line-block');
    elements.forEach((element, i) => {
      let blockArea = elements[i].attributes['data-line'].value.split(',');
      blockArea = blockArea.map((v) => parseInt(v, 10));
      const blockContent = [(elements[i].offsetTop - 2), elements[i].clientHeight];
      for (let j = blockArea[0]; j < blockArea[1]; j += 1) {
        this.resultBlock[j] = { area: blockArea, pos: blockContent };
      }
    });
  }

  updateMath = (mathString) => {
    const { math } = this.state;
    md.render(mathString);
    const newMath = Parser(md.render(mathString));
    if (math !== newMath) {
      this.setState({
        math: newMath
      });
    }
  }

  scrollSync = (point) => {
    if (this.resultBlock.length === 0) this.getResultCodeBlock();

    this.preview.scrollTop = typeof point === 'object' ?
      (() => {
        const scrollPoint = point.matchLine ?
          (this.resultBlock[point.matchLine].pos[0] + (this.resultBlock[point.matchLine].pos[1] * point.offestAds))
          :
          (() => {
            const beforeLineOffset = point.beforeLine === 0 ? 2 : (this.resultBlock[point.beforeLine].pos[0] + this.resultBlock[point.beforeLine].pos[1]);
            return (beforeLineOffset + ((this.resultBlock[point.afterLine].pos[0] - beforeLineOffset) * point.offestAds));
          })();
        return scrollPoint;
      })()
      :
      null;

    return this.resultBlock;
  }

  handleClick = (e) => {
    const domNode = e.target.attributes;
    if (domNode.length > 1 && domNode[1].value === 'clickable-link') {
      const domID = domNode[2].value;
      document.getElementById(domID).scrollIntoView({ behavior: 'smooth' });
    }
  };

  handleScroll = (e) => {
    const cPoint = e.srcElement.scrollTop;
    if (this.resultBlock.length === 0) this.getResultCodeBlock();
    if (!this.previewActiveFlag) return;

    const currentPoint = this.resultBlock.find((block) => (
      typeof block === 'object' ?
        (cPoint < (block.pos[0] + block.pos[1]))
        :
        false));

    if (currentPoint) {
      const ads = (cPoint - currentPoint.pos[0]) / currentPoint.pos[1];
      this.props.scrollhandler(currentPoint.area, ads);
    }
  }

  render() {
    return (
      <div
        className="react-mathjax-preview result-pane"
        ref={(node) => { this.preview = node; }}
      >
        {this.state.math}
      </div>
    );
  }
}
