import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadScript from 'load-script';
import Parser from 'html-react-parser';
import IncrementalDOM from 'incremental-dom';
import './style.scss';

const SCRIPT = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_HTMLorMML';
export default class Preview extends Component {
  static propTypes = {
    nodes: PropTypes.array,
  }

  static defaultProps = {
    nodes: ''
  }

  constructor(props) {
    super(props);
    this.delay = 0;
    this.timeout = null;
    this.mjRunning = false;
    this.mjPending = false;
    this.oldText = null;
    this.state = {
      loaded: false,
      math: '',
      buffer: '',
      hasError: false,
    };

    this.onLoad = this.onLoad.bind(this);
  }

  componentDidMount() {
    this.state.loaded ? MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.preview]) : loadScript(SCRIPT, this.onLoad); // eslint-disable-line
  }

  componentWillReceiveProps() {
    this.onLoad();
  }

  shouldComponentUpdate(newProps, oldProps) {
    return newProps.nodes !== oldProps.nodes;
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    logErrorToMyService(error, info);
  }

  onLoad = (err) => {
    if (err) { console.log(err); } else {
      MathJax.Hub.Config({    // eslint-disable-line
        'fast-preview': { disabled: true },
        tex2jax: { preview: 'none', inlineMath: [['$', '$'], ['\\(', '\\)']] },
        messageStyle: 'none',
        TeX: {
          Macros: {
            Macros: {
              longdiv: ['{\overline{\\smash{)}#1}}', 1],
              oint: String.raw`{\mathop{\vcenter{\mathchoice{\huge\\unicode{x222E}\,}{\\unicode{x222E}}{\\unicode{x222E}}{\\unicode{x222E}}}\,}\nolimits}`,
              oiint: String.raw`{\mathop{\vcenter{\mathchoice{\huge\/unicode{x222F}\,}{\/unicode{x222F}}{\/unicode{x222F}}{\/unicode{x222F}}}\,}\nolimits}`,
              oiiint: String.raw`{\mathop{\vcenter{\mathchoice{\huge\/unicode{x2230}\,}{\/unicode{x2230}}{\/unicode{x2230}}{\/unicode{x2230}}}\,}\nolimits}`,
              ointclockwise: String.raw`{\mathop{\vcenter{\mathchoice{\huge\/unicode{x2232}\,}{\/unicode{x2232}}{\/unicode{x2232}}{\/unicode{x2232}}}\,}\nolimits}`,
              ointctrclockwise: String.raw`{\mathop{\vcenter{\mathchoice{\huge\/unicode{x2233}\,}{\/unicode{x2233}}{\/unicode{x2233}}{\/unicode{x2233}}}\,}\nolimits}`
            }
          }
        }
      });
      this.Update();
      this.setState({ loaded: true });
    }
  }

  EquationNumber = () => {
    const elements = document.querySelectorAll('.react-mathjax-preview p .mjx-chtml.MJXc-display');
    elements.forEach((element, index) => {
      const data = document.querySelectorAll('.react-mathjax-preview p .mjx-chtml.MJXc-display')[index].innerHTML;
      if (!data.includes('lineNumber')) {
        const newElement = document.createElement('span');
        newElement.className = 'lineNumber';
        newElement.style = 'margin-left:40px;';
        const node = document.createTextNode(`(${index + 1})`);
        newElement.appendChild(node);
        elements[index].appendChild(newElement);
      } else {
        // const textnode = document.createTextNode(`(${index + 1})`);
        // const item = elements[index].childNodes[0];
        // item.replaceChild(textnode, item.childNodes[1]);
      }
    });
  }

  SwapBuffers = () => {
    this.EquationNumber();
    const preview = this.buffer;
    this.setState({ math: preview.innerHTML });
  }

  Update() {
    const self = this;
    if (this.timeout) { clearTimeout(this.timeout); }
    this.timeout = setTimeout(() => {
      self.CreatePreview(self);
    }, this.delay);
  }

  renderNodes = (nodes) => {
    nodes.map((node) => {
      if (node.tag) {
        if (node.nesting === 1) {
          IncrementalDOM.elementOpen(node.tag);
        } else if (node.nesting === -1) {
          IncrementalDOM.elementClose(node.tag);
        }
      }
      if (node.type === 'text') {
        IncrementalDOM.text(node.content);
      }
      if (node.children && node.children.length) {
        this.renderNodes(node.children);
      }
    });
  }

  CreatePreview() {
    this.timeout = null;
    if (this.mjPending) return;
    const text = this.props.nodes;
    if (text === this.oldtext) return;
    if (this.mjRunning) {
      this.mjPending = true;
      MathJax.Hub.Queue(['CreatePreview', this]); //eslint-disable-line
    } else {
      IncrementalDOM.patch(this.buffer, () => this.renderNodes(text));
      // this.buffer.innerHTML = text;
      this.oldtext = text;
      this.mjRunning = true;
      MathJax.Hub.Queue( //eslint-disable-line
        ['Typeset', MathJax.Hub, this.buffer], //eslint-disable-line
        ['PreviewDone', this]
      );
    }
  }

  PreviewDone() {
    this.mjRunning = false;
    this.mjPending = false;
    this.SwapBuffers();
  }


  render() {
    return (
      <div>
        <div
          className="react-mathjax-preview"
        >
          {Parser(this.state.math)}
        </div>
        <div
          ref={(node) => { this.buffer = node; }}
          style={{
            visibility: 'hidden', position: 'absolute', top: 0, left: 0
          }}
        >
        </div>
      </div>
    );
  }
}
