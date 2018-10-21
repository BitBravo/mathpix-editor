import React from 'react';
import { Helmet } from 'react-helmet';
import Preview from 'components/Preview';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import './style.scss';

const math = String.raw`# Mathematic editing made simple
When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b + \sqrt{b^2-4ac} \over 2a}. $$ and
$$ x = {-b - \sqrt{b^2-4ac} \over 2a}. $$
Numbered equations can be represented using:` + "\n```\\begin{equation} ... \\end{equation}```\n" + String.raw`
For example, here are some important equations in statistics:
\begin{equation}
f ( x | \mu , \sigma ^ { 2 } ) = \frac { 1 } { \sigma } \varphi \left( \frac { x - \mu } { \sigma } \right)
\end{equation}

\begin{equation}
F ( x ) = \Phi \left( \frac { x - \mu } { \sigma } \right) = \frac { 1 } { 2 } \left[ 1 + \operatorname { erf } \left( \frac { x - \mu } { \sigma \sqrt { 2 } } \right) \right] \end{equation}

\begin{equation}
\varphi ( x ) = \frac { 1 } { \sqrt { 2 \pi } } e ^ { - \frac { 1 } { 2 } x ^ { 2 } }
\end{equation}

You can even insert raw HTML:

<img text-align="center" width="800px" src="https://i.ytimg.com/vi/xgQhefFOXrM/maxresdefault.jpg" />
`

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

