
require('../mathjax');

let count = 0;
(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.markdownitMathjax = factory();
  }
}(this, () => {
  function multiMath(state, silent) {
    count = 1;
    let startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5C /* \ */) {
      return false;
    }
    const match = state.src.slice(++startMathPos).match(/^(?:\\\[|\\\(|begin\{([^}]*)\})/); // eslint-disable-line
    if (!match) {
      return false;
    }
    startMathPos += match[0].length;
    let type, endMarker, includeMarkers; // eslint-disable-line
    if (match[0] === '\\[') {
      type = 'display_math';
      endMarker = '\\\\]';
    } else if (match[0] === '\\(') {
      type = 'inline_math';
      endMarker = '\\\\)';
    } else if (match[1]) {
      type = 'equation_math';
      endMarker = `\\end{${match[1]}}`;
      includeMarkers = true;
    }
    const endMarkerPos = state.src.indexOf(endMarker, startMathPos);
    if (endMarkerPos === -1) {
      return false;
    }
    const nextPos = endMarkerPos + endMarker.length;
    if (!silent) {
      const token = state.push(type, '', 0);
      token.content = includeMarkers
        ? state.src.slice(state.pos, nextPos)
        : state.src.slice(startMathPos, endMarkerPos);
    }
    state.pos = nextPos;
    return true;
  }

  function simpleMath(state, silent) {
    let startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) {
      return false;
    }

    // Parse tex math according to http://pandoc.org/README.html#math
    let endMarker = '$';
    const afterStartMarker = state.src.charCodeAt(++startMathPos); // eslint-disable-line
    if (afterStartMarker === 0x24 /* $ */) {
      endMarker = '$$';
      if (state.src.charCodeAt(++startMathPos) === 0x24 /* $ */) { // eslint-disable-line
        return false;
      }
    } else {
      // Skip if opening $ is succeeded by a space character
      if (afterStartMarker === 0x20 /* space */ || afterStartMarker === 0x09 /* \t */ || afterStartMarker === 0x0a /* \n */) { // eslint-disable-line
        return false;
      }
    }
    const endMarkerPos = state.src.indexOf(endMarker, startMathPos);
    if (endMarkerPos === -1) {
      return false;
    }
    if (state.src.charCodeAt(endMarkerPos - 1) === 0x5C /* \ */) {
      return false;
    }
    const nextPos = endMarkerPos + endMarker.length;
    if (endMarker.length === 1) {
      // Skip if $ is preceded by a space character
      const beforeEndMarker = state.src.charCodeAt(endMarkerPos - 1);
      if (beforeEndMarker === 0x20 /* space */ || beforeEndMarker === 0x09 /* \t */ || beforeEndMarker === 0x0a /* \n */) {
        return false;
      }
      // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
      const suffix = state.src.charCodeAt(nextPos);
      if (suffix >= 0x30 && suffix < 0x3A) {
        return false;
      }
    }

    if (!silent) {
      const token = state.push(endMarker.length === 1 ? 'inline_math' : 'display_math', '', 0);
      token.content = state.src.slice(startMathPos, endMarkerPos);
    }
    state.pos = nextPos;
    return true;
  }

  function escapeHtml(html) {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
  }

  function extend(options, defaults) {
    return Object.keys(defaults).reduce((result, key) => {
      if (result[key] === undefined) {
        result[key] = defaults[key];
      }
      return result;
    }, options);
  }

  const mapping = {
    math: 'Math',
    inline_math: 'InlineMath',
    display_math: 'DisplayMath',
    equation_math: 'EquationMath'
  };

  const renderMath = function (token) {
    const mathEquation = MathJax.Typeset(token.content, true).outerHTML; // eslint-disable-line
    const equationNode = token.type === 'equation_math' ? `<span class='equation-number'>(${count++})</span>` : ''; // eslint-disable-line
    return token.type === 'inline_math' ? `<span className="math-block">${mathEquation}</span>` : `<p className="math-block">${mathEquation}${equationNode}</p>`;
  };

  return function (options) {
    const defaults = {
      beforeMath: '',
      afterMath: '',
      beforeInlineMath: '\\(',
      afterInlineMath: '\\)',
      beforeDisplayMath: '\\[',
      afterDisplayMath: '\\]'
    };
    options = extend(options || {}, defaults);

    return function (md) {
      md.inline.ruler.before('escape', 'multiMath', multiMath);
      md.inline.ruler.push('simpleMath', simpleMath);

      Object.keys(mapping).forEach((key) => {
        md.renderer.rules[key] = function (tokens, idx) {
          return renderMath(tokens[idx]);
        };
      });
    };
  };
}));
