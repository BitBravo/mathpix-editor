import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadScript from 'load-script';
import './style.scss';

const SCRIPT = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_HTMLorMML';

export default class Preview extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.string,
    math: PropTypes.string,
  }

  static defaultProps = {
    math: ''
  }

  constructor(props) {
    super(props);
    this.delay = 500;
    this.timeout = null;
    this.mjRunning = false;
    this.mjPending = false;
    this.oldText = null;
    this.state = {
      loaded: false,
    };

    this.onLoad = this.onLoad.bind(this);
  }

  componentDidMount() {
    this.state.loaded ? MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.preview]) : loadScript(SCRIPT, this.onLoad); // eslint-disable-line
  }

  componentWillReceiveProps() {
    this.Update();
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
              longdiv: ['{\\overline{\\smash{)}#1}}', 1],
              oint: String.raw`{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x222E}\\,}{\\unicode{x222E}}{\\unicode{x222E}}{\\unicode{x222E}}}\\,}\\nolimits}`,
              oiint: String.raw`{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x222F}\\,}{\\unicode{x222F}}{\\unicode{x222F}}{\\unicode{x222F}}}\\,}\\nolimits}`,
              oiiint: String.raw`{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2230}\\,}{\\unicode{x2230}}{\\unicode{x2230}}{\\unicode{x2230}}}\\,}\\nolimits}`,
              ointclockwise: String.raw`{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2232}\\,}{\\unicode{x2232}}{\\unicode{x2232}}{\\unicode{x2232}}}\\,}\\nolimits}`,
              ointctrclockwise: String.raw`{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2233}\\,}{\\unicode{x2233}}{\\unicode{x2233}}{\\unicode{x2233}}}\\,}\\nolimits}`
            }
          }
        }
      });
      this.Update();
      this.setState({ loaded: true });
    }
  }

  SwapBuffers() {
    const buffer = this.preview;
    const preview = this.buffer;
    this.buffer = buffer.innerHTML;
    this.preview.innerHTML = preview.innerHTML;
    // buffer.style.visibility = "hidden"; buffer.style.position = "absolute";
    // preview.style.position = ""; preview.style.visibility = "";
  }

  Update() {
    const self = this;
    if (this.timeout) { clearTimeout(this.timeout); }
    this.timeout = setTimeout(() => {
      self.CreatePreview(self);
    }, this.delay);
  }

  CreatePreview() {
    this.timeout = null;
    if (this.mjPending) return;
    const text = this.props.math;
    if (text === this.oldtext) return;
    if (this.mjRunning) {
      this.mjPending = true;
      MathJax.Hub.Queue(['CreatePreview', this]); //eslint-disable-line
    } else {
      this.buffer.innerHTML = text;
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
          className={this.props.className}
          id="react-mathjax-preview"
          style={this.props.style}
          ref={(node) => { this.preview = node; }}
        >
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

