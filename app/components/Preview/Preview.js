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
    this.delay = 1000;
    this.timeout = null;
    this.previewActiveFlag = false;
    this.resultBlock = [];
    this.repeatCount = 0;
    this.clickPoint = 0;
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

  shouldComponentUpdate(nextProps) {
    if (!nextProps.math) return false;
    return nextProps.math !== this.state.math;
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
      console.log(document.getElementById(domID))
      // document.getElementById(domID).scrollIntoView({ behavior: 'smooth' });
      const offsetTarget = (document.getElementById(domID).offsetTop) - (window.innerHeight / 2) || 0;
      const offsetStart = this.preview.scrollTop;
      const step = Math.abs(offsetTarget - offsetStart) / 20;
      this.clickPoint = offsetStart;
      const refeatTimer = setInterval(() => {
        this.clickPoint = offsetTarget > offsetStart ? (this.clickPoint + step) : (this.clickPoint - step);
        this.preview.scrollTop = this.clickPoint;
        if (Math.abs(this.clickPoint - offsetTarget) < step) clearInterval(refeatTimer);
      }, 10);
    }
  };

  handleScroll = (e) => {
    const { scrollHeight: cHeight, clientHeight: wHeight, scrollTop: cScrollTop } = e.srcElement;
    if (this.resultBlock.length === 0) this.getResultCodeBlock();
    if (!this.previewActiveFlag) return;
    if (cScrollTop === (cHeight - wHeight - 1) && this.repeatCount) return;

    let currentCodeBlock = [];
    let ads = 0;
    if (cScrollTop < (cHeight - wHeight)) {
      currentCodeBlock = this.resultBlock.find((block) => (typeof block === 'object' ? cScrollTop < (block.pos[0] + block.pos[1]) : null));
      this.repeatCount = 0;
      ads = (cScrollTop - currentCodeBlock.pos[0]) / currentCodeBlock.pos[1];
    } else {
      const remainCodeBlocks = this.resultBlock.filter((block, index) => {
        if (typeof block === 'object') {
          if (cScrollTop < (block.pos[0] + block.pos[1])) {
            // eslint-disable-next-line no-nested-ternary
            return index === 0 ?
              true
              :
              (typeof this.resultBlock[index - 1] === 'object' ?
                (this.resultBlock[index - 1].pos[0] + this.resultBlock[index - 1].pos[1]) < (block.pos[0] + block.pos[1])
                :
                null);
          }
        }
      });
      currentCodeBlock = remainCodeBlocks[this.repeatCount];
      e.srcElement.scrollTop = cScrollTop - 1;
      this.repeatCount = this.repeatCount < remainCodeBlocks.length - 1 ? (this.repeatCount + 1) : remainCodeBlocks.length - 1;
      ads = 0;
    }
    if (currentCodeBlock) {
      this.props.scrollhandler(currentCodeBlock.area, ads);
    }
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
