import React from 'react';
import { Helmet } from 'react-helmet';
import Preview from 'components/Preview';
import 'libs/codemirror/markdown';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
import './style.scss';
import hljs from "highlight.js";
import Parser from "html-react-parser";

import {mathDef} from "./data.js";

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
      } catch (__) { } // eslint-disable-line
    }

    return '';
  }
})
  .use(require('libs/mathParse')())
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-highlightjs'), { auto: true, code: true })
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-ins'))
  .use(require('libs/lineNumber'))
  .use(require('markdown-it-ins'));


export default class Editor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markdownSrc: mathDef,
      math: '',
    };
    // this.exportMethods = this.exportMethods.bind(this);
    // this.setMarkdown = this.setMarkdown.bind(this);
    // this.clear = this.clear.bind(this);
  }

 //  componentDidMount() {
 //    this.exportMethods();
 // //   let res = window.setMarkdown(this.state.markdownSrc)
 //   // console.log('res=>', res);
 //  }
 //
 //  componentWillMount() {
 //    //this.updateMath(this.state.markdownSrc);
 //    //window.setMarkdown(this.state.markdownSrc)
 //  }
  //
  // updateMath = (mathString) => {
  //   const { math } = this.state;
  //   md.render(mathString);
  //   const newMath = Parser(md.render(mathString));
  //   if (math !== newMath) {
  //     this.setState({
  //       math: newMath
  //     });
  //   }
  // }

  // exportMethods() {
  //   const that = this;
  //
  //   window.clear = function () {
  //     that.clear();
  //   }
  //
  //   window.setMarkdown = function (mathString) {
  //     window.clear();
  //     that.setMarkdown(mathString);
  //     let width = window.equationWidth();
  //     let height = window.equationHeight();
  //
  //    // return [width, height];
  //
  //     const w = width;//this.props.dialogWidth;
  //     const h = height;//this.props.dialogHeight;
  //     const left = window.screen.width / 2 - w / 2;
  //     const top = window.screen.height / 2 - h / 2;
  //
  //     return window.open(
  //       'no-editor',
  //       'text',
  //       'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
  //       w +
  //       ', height=' +
  //       h +
  //       ', top=' +
  //       top +
  //       ', left=' +
  //       left
  //     );
  //
  //
  //   };
  //
  //   window.equationWidth = function() {
  //     var result = null;
  //     var equationSpan = document.getElementsByClassName('setMarkdown')[0];
  //     if (equationSpan) {
  //       result = equationSpan.offsetWidth;
  //     }
  //     return result;
  //   }
  //
  //   window.equationHeight = function() {
  //     var equationBox = document.getElementsByClassName('setMarkdown')[0];
  //     if (equationBox) {
  //       return equationBox.clientHeight;
  //     } else {
  //       return null;
  //     }
  //   }
  // }
  //
  // clear() {
  //   this.setState({
  //     math: '',
  //   })
  // }
  //
  // setMarkdown(mathString) {
  //   const { math } = this.state;
  //   md.render(mathString);
  //   const newMath = Parser(md.render(mathString));
  //   if (math !== newMath) {
  //     this.setState({
  //       math: newMath
  //     });
  //   }
  // }

  render() {
    return (
      <article>
        <Helmet>
          <title>React Markdown</title>
          <meta name="description" content="React Markdown" />
        </Helmet>
        <div>
          <h1>No-editor</h1>
          <div
            className="setMarkdown"
            style={{display:'inline-block'}}
            ref={(node) => { this.preview = node; }}
          >
            {this.state.math}
          </div>
        </div>
      </article>
    );
  }
}

