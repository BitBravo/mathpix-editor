import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import loadScript from 'load-script';
// import Parser from 'html-react-parser';
import IncrementalDOM from 'incremental-dom';
import MathJax from 'components/Mathjax';

import './style.scss';

export default class Preview extends Component {
  static propTypes = {
    // className: PropTypes.string,
    // style: PropTypes.string,
    // math: PropTypes.string,
    nodes: PropTypes.array,
    // nodes: PropTypes.string,
  }

  // static defaultProps = {
  //   math: ''
  // }

  constructor(props) {
    super(props);
    this.delay = 0;
    this.mathNum = 0;
    this.mjRunning = false;
    this.mjPending = false;
    this.oldText = null;
    // this.state = {
    //   loaded: false,
    //   math: 'value'
    // };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.nodes !== oldProps.nodes) {
      this.Update(this.props.nodes);
    }
  }

  Update = (nodes) => {
    this.renderTest(nodes);
    // console.log(nodes);
    // IncrementalDOM.patch(this.Nodes, () => this.renderNodes(nodes));
  }

  Tex2htmlConverter = (tex, status) => (
    <MathJax.Provider>
      <MathJax.Node formula={tex} status={status} />
    </MathJax.Provider>
  )

  html = (content) => {
    console.log(content);

    IncrementalDOM.elementOpen('html-blob');
    const el = document.createElement('html');
    el.innerHTML = "<html><head><title>titleTest</title></head><body><a href='test0'>test01</a><a href='test1'>test02</a><a href='test2'>test03</a></body></html>";
    console.log(el.getElementsByTagName('a'));
    IncrementalDOM.elementClose('html-blob');
  }

  MathNodeCheck = (contents) => {
    const mathNodes = [];
    const blockNodes = contents.split('$$');
    for (let i = 0; i < blockNodes.length; i++) { // eslint-disable-line
      if (i > 0 && i < blockNodes.length - 1) {
        this.mathNum = this.mathNum + 1;
        mathNodes.push({ type: 'block', content: blockNodes[i], equationNum: this.mathNum });
      } else {
        const inlineNodes = blockNodes[i].split('$');

        for (let j = 0; j < inlineNodes.length; j++) { // eslint-disable-line
          if (j > 0 && j < inlineNodes.length - 1) {
            mathNodes.push({ type: 'inline', content: inlineNodes[j] });
          } else {
            mathNodes.push({ type: 'text', content: inlineNodes[j] });
          }
        }
      }
    }
    return mathNodes;
  }

  renderNodes = (nodes) => {
    console.log(nodes);
    nodes.map((node) => {
      if (node.tag) {
        if (node.nesting === 1) {
          IncrementalDOM.elementOpen(node.tag);
        } else if (node.nesting === -1) {
          IncrementalDOM.elementClose(node.tag);
        }
      }
      if (node.type === 'inline') {
        const data = this.MathNodeCheck(node.content);
        for (let i = 0; i < data.length; i++) {  //eslint-disable-line
          // console.log(data[i]);
          if (data[i].type === 'text') {
            IncrementalDOM.text(data[i].content);
          } else if (data[i].type === 'inline') {
            this.html(this.Tex2htmlConverter(data[i].content, 'inline'));
            // IncrementalDOM.text(this.Tex2htmlConverter(data[i].content, 'inline'));
          } else {
            this.html(this.Tex2htmlConverter(data[i].content, 'inline'));
            // IncrementalDOM.text(this.Tex2htmlConverter(data[i].content, 'block'));
          }
        }
      }
      if (node.children && node.children.length) {
        this.renderNodes(node.children);
      }
      return true;
    });
  }

  renderTest = (nodes) => {
    console.log(nodes);
    nodes.map((node) => {
      // if (node.tag) {
      //   if (node.nesting === 1) {
      //     IncrementalDOM.elementOpen(node.tag);
      //   } else if (node.nesting === -1) {
      //     IncrementalDOM.elementClose(node.tag);
      //   }
      // }
      if (node.type === 'inline') {
        const data = this.MathNodeCheck(node.content);
        for (let i = 0; i < data.length; i++) { //eslint-disable-line
          // console.log(data[i]);
          if (data[i].type === 'text') {
            // IncrementalDOM.text(data[i].content);
          } else if (data[i].type === 'inline') {
            (this.Tex2htmlConverter(data[i].content, 'inline'));
            // IncrementalDOM.text(this.Tex2htmlConverter(data[i].content, 'inline'));
          } else {
            (this.Tex2htmlConverter(data[i].content, 'inline'));
            // IncrementalDOM.text(this.Tex2htmlConverter(data[i].content, 'block'));
          }
        }
      }
      if (node.children && node.children.length) {
        this.renderNodes(node.children);
      }
      return true;
    });
  }

  render() {
    return (
      <div>
        <div
          ref={(node) => { this.Nodes = node; }}
        >
        </div>
      </div>
    );
  }
}
