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
    this.state = {
      loaded: false,
      oldMath: props.math
    };

    this.onLoad = this.onLoad.bind(this);
  }

  componentDidMount() {
    this.preview.innerHTML = this.props.math;
    this.state.loaded ? MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.preview]) : loadScript(SCRIPT, this.onLoad); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ oldMath: nextProps.math });
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.math) return false;
    return nextProps.math !== this.state.oldMath;
  }

  componentDidUpdate() {
    this.preview.innerHTML = this.props.math;
    MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.preview]); // eslint-disable-line
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
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.preview]);
      this.setState({ loaded: true });
    }
  }

  render() {
    return (
      <div
        className={this.props.className}
        id="react-mathjax-preview"
        style={this.props.style}
      >
        <div
          id="react-mathjax-preview-result"
          ref={(node) => { this.preview = node; }}
        >
        </div>
      </div>
    );
  }
}

