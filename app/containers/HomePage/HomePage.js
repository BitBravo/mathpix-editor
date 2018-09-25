import React from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import decode from 'decode-html';
import './style.scss';

// let MarkdownIt = require('markdown-it'),
//   md = new MarkdownIt();

const md = require('markdown-it')()
  .use(require('markdown-it-mathjax')());

// const md = require('markdown-it')({
//   highlight(str, lang) {
//     if (lang && hljs.getLanguage(lang)) {
//       try {
//         return `<pre class="hljs"><code>${
//           hljs.highlight(lang, str, true).value
//         }</code></pre>`;
//       } catch (__) {}
//     }

//     return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
//   }
// });

export default class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markdownSrc: '# This is a header\n\nAnd this is a paragraph',
    };

    this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
  }

  componentDidMount() {
  }

  handleMarkdownChange(evt) {
    this.setState({ markdownSrc: evt.target.value });
  }

  render() {
    const result = md.render(this.state.markdownSrc);

    return (
      <article>
        <Helmet>
          <title>React Markdown</title>
          <meta name="description" content="React Markdown" />
        </Helmet>
        <div>
          <textarea className="editor-pane" onChange={this.handleMarkdownChange}>
            {this.state.markdownSrc}
          </textarea>
          <div className="result-pane" dangerouslySetInnerHTML={{ __html: decode(result) }}>
          </div>
        </div>
      </article>
    );
  }
}

