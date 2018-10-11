import React from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import decode from 'decode-html'; //eslint-disable-line
import Preview from 'components/Preview';
import CodeMirror from 'react-codemirror';
import hljs from 'highlight.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
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
      } catch (__) {} // eslint-disable-line
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
  .use(require('markdown-it-ins'));
  // .use(
  //   require('markdown-it-incremental-dom'),
  //   IncrementalDOM,
  //   // {
  //   //   incrementalizeDefaultRules: true,
  //   // }
  // );

const math = String.raw`
  # Mathematics

  When $a \ne 0$, there are two solutions to \(ax^2 + bx + c = 0\) and they are
  $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

  $$
  f ( a ) = \frac { 1 } { 2 \pi i } \oint _ { \gamma } \frac { f ( z ) } { z - a } d z
  $$

  $$\lim_{x \to \infty} \exp(-x) = 0$$
  `;

export default class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markdownSrc: math,
    };

    this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
    this.updateCode = this.updateCode.bind(this);
  }

  componentDidMount() {
  }

  handleMarkdownChange(evt) {
    this.setState({ markdownSrc: evt.target.value });
  }

  updateCode(newCode) {
    this.setState({
      markdownSrc: newCode,
    });
  }

  render() {
    const result = md.parse(this.state.markdownSrc, {});
    // const result = md.render(this.state.markdownSrc);
    const options = {
      lineNumbers: true,
      mode: 'markdown',
      lineWrapping: true,
    };

    return (
      <article>
        <Helmet>
          <title>React Markdown</title>
          <meta name="description" content="React Markdown" />
        </Helmet>
        <div>
          <CodeMirror className="editor-pane" value={this.state.markdownSrc} onChange={this.updateCode} options={options} />
          <div className="result-pane">
            <Preview nodes={result} />
          </div>
        </div>
      </article>
    );
  }
}

