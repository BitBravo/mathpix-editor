import React from 'react';
import { Helmet } from 'react-helmet';
import Preview from 'components/Preview';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/xml/xml';
import './style.scss';

const math = String.raw`
In equation \eqref{eq:7}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:sample}
\end{equation}

In equation \eqref{eq:2}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:2}
\end{equation}
  
In equation \eqref{eq:3}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:3}
\end{equation}
  
In equation \eqref{eq:4}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:4}
\end{equation}
  
In equation \eqref{eq:5}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:5}
\end{equation}



\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:8}
\end{equation}

In equation \eqref{eq:8}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:6}
\end{equation}

In equation \eqref{eq:6}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:7}
\end{equation}

In equation \eqref{eq:sample}, we find the value of an
interesting integral:

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

