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
    this.resultBlock = [];
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
    // this.getResultCodeBlock();
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
    this.preview.removeEventListener('mouseenter', this);
    this.preview.removeEventListener('mouseleave', this);
  }

  // eslint-disable-next-line react/sort-comp
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
    if (this.resultBlock.length === 0) this.getResultCodeBlock();

    if (typeof point === 'object') {
      let scrollPoint = 0;
      if (point.matchLine) {
        scrollPoint = this.resultBlock[point.matchLine].pos[0] + (this.resultBlock[point.matchLine].pos[1] * point.offestAds);
      } else {
        const beforeLineOffset = point.beforeLine === 0 ? 2 : (this.resultBlock[point.beforeLine].pos[0] + this.resultBlock[point.beforeLine].pos[1]);
        scrollPoint = beforeLineOffset + ((this.resultBlock[point.afterLine].pos[0] - beforeLineOffset) * point.offestAds);
        // console.log('AfterTop, BeforeBottom', this.resultBlock[point.afterLine].pos[0], beforeLineOffset);
      }
      this.preview.scrollTop = scrollPoint;
    }
    return this.resultBlock;
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

  handleScroll = (e) => {
    const cPoint = e.srcElement.scrollTop;
    if (this.resultBlock.length === 0) this.getResultCodeBlock();
    if (!this.previewActiveFlag) return;

    const currentPoint = this.resultBlock.find((block) => {
      if (typeof block === 'object') return cPoint < (block.pos[0] + block.pos[1]);
    });
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
        {Parser(this.state.math)}
      </div>
    );
  }
}
