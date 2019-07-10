import React from 'react';
import { Helmet } from 'react-helmet';
import setMarkdown  from '../../libs/setMarkdown'
import './style.scss';

import {mathDef} from "./data.js";

const math3 = String.raw`
\\[ y = \frac { \sum _ { i } w _ { i } y _ { i } } { \sum _ { i } w _ { i } } , i = 1,2 \ldots k \\]
`;

export default class Editor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markdownSrc: mathDef,
      math: '',
    };
    this.exportMethods = this.exportMethods.bind(this);
    this.setMarkdown = this.setMarkdown.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
     this.exportMethods();
      window.setMarkdown(math3);
  }

  exportMethods() {
    const that = this;

    window.clear = function () {
      that.clear();
    };

    window.setMarkdown = function (mathString) {
      window.clear();
      that.setMarkdown(mathString);

      let width = window.equationWidth();
      let height = window.equationHeight();

      return [width, height];
    };

    window.equationWidth = function() {
      let result = null;
      const equationSpan = document.getElementById('setMarkdown');
      if (equationSpan) {
        result = equationSpan.offsetWidth;
      }
      return result;
    };

    window.equationHeight = function() {
      const equationBox = document.getElementById('setMarkdown');
      if (equationBox) {
        return equationBox.clientHeight;
      } else {
        return null;
      }
    };
  }

  clear() {
    this.setState({
      math: '',
    })
  }

  setMarkdown(mathString) {
    const { math } = this.state;
    const newMath = setMarkdown(mathString);

    if (math !== newMath) {
      this.setState({
        math: newMath
      });
    }
  }

  render() {
    return (
      <article>
        <Helmet>
          <title>React Markdown</title>
          <meta name="description" content="React Markdown" />
        </Helmet>
        <div>
          <div id='setMarkdown' style={{display:'inline-block'}} ref={(node) => { this.preview = node; }} >
            {this.state.math}
          </div>
        </div>
      </article>
    );
  }
}

