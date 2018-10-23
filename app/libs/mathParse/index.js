
require('../mathjax');


let count = 0,
  mathNumber = [];
(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.markdownitMathjax = factory();
  }
}(this, () => {
  function multiMath(state, silent) {
    count = 0;
    let startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5C /* \ */) {
      return false;
    }
    const match = state.src.slice(++startMathPos).match(/^(?:\\\[|\\\(|begin\{([^}]*)\}|eqref\{([^}]*)\})/); // eslint-disable-line
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
    } else if (match[0].includes('eqref')) {
      type = 'reference_note';
      endMarker = '';
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
      if (includeMarkers) {
        token.content = state.src.slice(state.pos, nextPos);
      } else if (type === 'reference_note') {
        token.content = match ? match[2] : '';
      } else {
        token.content = state.src.slice(startMathPos, endMarkerPos);
      }
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

  // function escapeHtml(html) {
  //   return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
  // }

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
    equation_math: 'EquationMath',
    reference_note: 'Reference_note'
  };

  const checkReference = (data) => {
    const match = data.match(/label\{([^}]*)\}/);
    return { tagId: match ? match[1] : '', math: data.replace(/\\label\{([^}]*)\}/, '') };
  };

  const renderMath = (a, token) => {
    const { tagId, math } = checkReference(token.content);
    const mathEquation = MathJax.Typeset(math, true).outerHTML; // eslint-disable-line
    const equationNode = token.type === 'equation_math' ? `<span class='equation-number' ${tagId ? `id="${tagId}"` : ''}>(${++count})</span>` : ''; // eslint-disable-line
    if (tagId) {
      mathNumber[tagId] = `(${count})`;
    }
    return token.type === 'inline_math' ? `<span className="math-block">${mathEquation}</span>` : `<p className="math-block">${mathEquation}${equationNode}</p>`;
  };

  const renderReference = (token) => {
    return `<span className="clickable-link" value=${token.content}>${mathNumber[token.content] || token.content}</span>`;
  };

  return (options) => {
    const defaults = {
      beforeMath: '',
      afterMath: '',
      beforeInlineMath: '\\(',
      afterInlineMath: '\\)',
      beforeDisplayMath: '\\[',
      afterDisplayMath: '\\]'
    };
    options = extend(options || {}, defaults);

    return (md) => {
      md.inline.ruler.before('escape', 'multiMath', multiMath);
      md.inline.ruler.push('simpleMath', simpleMath);

      Object.keys(mapping).forEach((key) => {
        md.renderer.rules[key] = (tokens, idx) => (
          tokens[idx].type === 'reference_note' ?
            renderReference(tokens[idx])
            : renderMath(tokens, tokens[idx]));
      });
    };
  };
}));
