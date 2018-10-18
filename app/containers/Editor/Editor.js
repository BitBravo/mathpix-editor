import React from 'react';
import { Helmet } from 'react-helmet';
import Preview from 'components/Preview';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import './style.scss';

const math = String.raw`
  # Mathematics
  When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
  $$ x = {-b \pm \sqrt{b^2-4ac} \over 2a}. $$
  $$
  f ( a ) = \frac { 1 } { 2 \pi i } \oint _ { \gamma } \frac { f ( z ) } { z - a } d z
  $$
  $$ \lim_{x \to \infty} \exp(-x) = 0 $$
  \begin{equation}
  it's ok
  \end{equation}
  `;

export default class Editor extends React.PureComponent {
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

  updateCode(code) {
    this.setState({
      markdownSrc: code,
    });
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'markdown',
      lineWrapping: true,
      autoRefresh: true,
      extraKeys: {
        Enter: (cm) => cm.replaceSelection('\n')
      },
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
            <Preview math={this.state.markdownSrc} />
          </div>
        </div>
      </article>
    );
  }
}

