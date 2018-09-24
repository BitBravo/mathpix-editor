import React from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import './style.scss';

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
          <div className="result-pane">
            <ReactMarkdown
              source={this.state.markdownSrc}
              skipHtml={this.state.htmlMode === 'skip'}
              escapeHtml={this.state.htmlMode === 'escape'}
            />,
          </div>
        </div>
      </article>
    );
  }
}

