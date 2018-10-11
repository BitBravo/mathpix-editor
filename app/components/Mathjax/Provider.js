import * as React from 'react';
import loadScript from 'load-script';
import MathJaxContext, { type MathJaxContextValue } from './context';

class MathJaxProvider extends React.Component<*, *> {
    props: {
        script?: string | boolean,
        options?: Object,
        children: React.Node
    };

    state: MathJaxContextValue;

    static defaultProps = {
      script:
            'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_HTMLorMML',
      options: {
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
      }
    };

    constructor(props: *) {
      super(props);

      this.state = {
        MathJax: null,
        registerNode: this.registerNode
      };
    }

    componentDidMount() {
      this.load();
    }

    componentDidUpdate() {
      this.load();
    }

    // Is there any math nodes to typeset ?
    hasNodes: boolean = false;

    // Have we already loaded MathJax ?
    loaded: boolean = false;

    /*
     * Signal that there is at least one node to typeset.
     * It will trigger the mathjax loading.
     */
    registerNode = () => {
      this.hasNodes = true;
    };

    /*
     * Load the MathJax library
     */
    load = () => {
      const { script } = this.props;

      if (this.loaded || !this.hasNodes) {
        return;
      }

      this.loaded = true;

      if (!script) {
        this.onLoad(null);
        return;
      }

      loadScript(script, this.onLoad);
    };

    onLoad = (err: ?Error) => {
      const { options } = this.props;
      MathJax.Hub.Config(options);

      this.setState({
        MathJax
      });
    };

    render() {
      const { children } = this.props;

      return (
        <MathJaxContext.Provider value={this.state}>
          {children}
        </MathJaxContext.Provider>
      );
    }
}

export default MathJaxProvider;
