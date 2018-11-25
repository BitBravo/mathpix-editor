import React from 'react';
import { Helmet } from 'react-helmet';
import Preview from 'components/Preview';
import CodeMirror from 'react-codemirror';
import 'libs/codemirror/markdown';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
import './style.scss';

const math = String.raw`
## Mathematics

### Simple inline, block mathematics formulas.

Input your mathematics formula inline like: $\vec{F} \ =\ m\vec{a}$ and \\(ax^2 + bx + c = 0 \\) or new line mathematics formulas like this:



$$
x = \frac { - b \pm \sqrt { b ^ { 2 } - 4 a c } } { 2 a }
$$

\\[
  y = \frac { \sum _ { i } w _ { i } y _ { i } } { \sum _ { i } w _ { i } } , i = 1,2 \ldots k
\\]

### Matrix

$$
\left[ \begin{array} { l } { x _ { 1 } } \\ { x _ { 2 } } \end{array} \right] = \left[ \begin{array} { c c } { A } & { B } \\ { C } & { D } \end{array} \right] \times \left[ \begin{array} { l } { y _ { 1 } } \\ { y _ { 2 } } \end{array} \right]
$$

$$
\left[ \begin{array} { c c c } { 3 } & { - 2 } & { 1 } \\ { 1 } & { 2 } & { - 2 } \\ { 1 } & { 1 } & { - 4 } \end{array} \right] \left[ \begin{array} { l } { x } \\ { y } \\ { z } \end{array} \right] = \left[ \begin{array} { c } { 9 } \\ { - 5 } \\ { - 2 } \end{array} \right]
$$

### Brackets

\\[
  \left( \frac { x d x } { d y } - \frac { y d y } { d x } \right) ^ { 2 } ,
  [ \vec { F } = m \vec { a } ] ,
  \left| \frac { a } { b } \right| \left\| \frac { a } { b } \right\| \left\langle \frac { a } { b } \right\rangle \{ \sqrt { a + \sqrt { a + \sqrt { a } } } \rightarrow \infty \}
\\]

### Complex display

$$
  \frac { 1 } { 4 } W _ { \mu \nu } \cdot W ^ { \mu \nu } - \frac { 1 } { 4 } B _ { \mu \nu } B ^ { \mu \nu } - \frac { 1 } { 4 } G _ { \mu \nu } ^ { a } G _ { a } ^ { \mu \nu }
$$

$$
\nabla \times \mathbf { E } = - \frac { \partial \mathbf { B } } { \partial t } \text { and } \nabla \times \mathbf { H } = \mathbf { J } + \frac { \partial \mathbf { D } } { \partial t }
$$


$$
  y = \frac { \sum w _ { i } y _ { i } } { \sum _ { i } w _ { i } } , i = 1,2 \ldots k
$$

### Mathematics formulas with equation number
<i>Equation 1</i>
\begin{equation}
  1 +  \frac{q^2}{(1-q)}+\frac{q^6}{(1-q)(1-q^2)}+\cdots =
    \prod_{j=0}^{\infty}\frac{1}{(1-q^{5j+2})(1-q^{5j+3})},
     \quad\quad \text{for $|q|<1$}.
\end{equation}

<i>Equation 2</i>

\begin{equation}
  f ( a ) = \frac { 1 } { 2 \pi i } \oint _ { \gamma } \frac { f ( z ) } { z - a } d z
\end{equation}

<i>Equation 3</i>

\begin{equation}
  \left( \sum_{k=1}^n a_k b_k \right)^{\!\!2} \leq
  \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
\end{equation}

### Mathematics formulas with clickable reference

In equation \eqref{eq:1}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:1}
\end{equation}

\begin{equation}
  \| x + y \| \geq | \| x | | - \| y \| |
  \label{eq:2}
\end{equation}

\begin{equation}
  \int _ { b } ^ { a } f ^ { \prime } ( x ) d x = f ( b ) - f ( a )
  \label{eq:3}
\end{equation}

Look at the Equation \eqref{eq:2}.

Please use Equation \eqref{eq:last} to solve this issue:


# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'

## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as 1.

Start numbering with offset:

57. foo
1. bar


## Code

Inline code

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"
"

Sample text here...

Syntax highlighting

 js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));




## Links

[link text](http://google.com/)

[link with title](http://google.com/ "title text!")

Autoconverted link http://google.com/ (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"


## Plugins

The killer feature of "markdown-it" is very effective support of
[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).


### [Emojies](https://github.com/markdown-it/markdown-it-emoji)

> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)

see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.


### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

- 19^th^
- H~2~O


### [\<ins>](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++


### [\<mark>](https://github.com/markdown-it/markdown-it-mark)

==Marked text==


### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b



This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language

::: warning
*here be dragons*
:::

\begin{equation}
  H ( Y | X ) = \sum _ { x \in \mathcal { X } , y \in \mathcal { Y } } p ( x , y ) \log \left( \frac { p ( x ) } { p ( x , y ) } \right)
  \label{eq:last}
\end{equation}
ok, Great.
`;

export default class Editor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.lineNumber = 0;
    this.editorActiveFlag = true;
    this.codeBlock = [];
    this.lineOffsetArray = [];
    this.updateTime = null;

    this.state = {
      markdownSrc: math,
    };
  }

  getBlockNumbers = () => {
    const currentLine = this.editor.codeMirror.lineAtHeight(0);
    const ObjectKeys = Object.keys(this.codeBlock);
    const matchLine = ObjectKeys.find((key) => (parseInt(key, 10) === currentLine));
    const afterLine = ObjectKeys.find((key) => parseInt(key, 10) > currentLine);
    const beforeLineTemp = ObjectKeys[(ObjectKeys.indexOf(afterLine) - 1)] || 0;
    const beforeLine = (parseInt(beforeLineTemp, 10)) < 0 ? parseInt(0, 10) : parseInt(beforeLineTemp, 10);

    return {
      lineNumbers: {
        ...{ beforeLine }, ...{ currentLine }, ...{ matchLine }, ...{ afterLine }
      }
    };
  }

  focusControl = (e) => {
    this.editorActiveFlag = !e;
  }

  updateCode = (code) => {
    if (this.updateTime) clearTimeout(this.updateTime);
    this.updateTime = setTimeout(() => {
      this.setState({
        markdownSrc: code,
      });
    }, 200);
  }

  createLineArray = (flag) => {
    if (flag) this.lineOffsetArray = [];
    const doc = this.editor.codeMirror.getDoc();
    if (this.lineOffsetArray.length === 0) {
      for (let i = 0; i < doc.size; i += 1) {
        this.lineOffsetArray[i] = this.editor.codeMirror.heightAtLine(i, 'local');
      }
    }
  }

  scrollhandler = (lineNumbers, offset) => {
    this.createLineArray();
    const blockHeight = this.lineOffsetArray[lineNumbers[1]] - this.lineOffsetArray[lineNumbers[0]];
    const cPoint = this.lineOffsetArray[lineNumbers[0]] + (blockHeight * offset);
    document.querySelector('.CodeMirror-scroll').scrollTop = cPoint;
  }

  scrollEvent = (e) => {
    if (!this.editorActiveFlag) return;
    this.createLineArray();

    if (!this.codeBlock.length) {
      this.codeBlock = this.preview.scrollSync(false);
    }

    const { lineNumbers } = this.getBlockNumbers();
    let { ads, blockStartLine, blockEndLine } = !lineNumbers.matchLine ?
      (() => {
        blockStartLine = lineNumbers.beforeLine === 0 ? lineNumbers.beforeLine : (lineNumbers.beforeLine + 1);
        blockEndLine = lineNumbers.afterLine;
        ads = (e.top - this.lineOffsetArray[blockStartLine]) / (this.lineOffsetArray[blockEndLine] - this.lineOffsetArray[blockStartLine]);
        return { blockStartLine, blockEndLine, ads };
      })
      :
      (() => {
        blockStartLine = this.codeBlock[lineNumbers.currentLine].area['0'] || 0;
        blockEndLine = this.codeBlock[lineNumbers.currentLine].area['1'] || 0;
        ads = (e.top - this.lineOffsetArray[blockStartLine]) / (this.lineOffsetArray[blockEndLine] - this.lineOffsetArray[blockStartLine]) || 0;
        return { blockStartLine, blockEndLine, ads };
      })();

    this.preview.scrollSync({ ...lineNumbers, offestAds: ads });
  }

  scrollhandler = (lineNumbers, offset) => {
    this.createLineArray();
    const blockHeight = this.lineOffsetArray[lineNumbers[1]] - this.lineOffsetArray[lineNumbers[0]];
    const cPoint = this.lineOffsetArray[lineNumbers[0]] + (blockHeight * offset);
    document.querySelector('.CodeMirror-scroll').scrollTop = cPoint;
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'markdown',
      lineWrapping: true,
      autoRefresh: true,
      extraKeys: {
        Enter: (cm) => cm.replaceSelection('\n'),
        Backspace: (cm) => {
          const Pos = cm.doc.getCursor();
          const previousLine = Pos.line - 1;
          const beforeLine = cm.doc.getLine(previousLine);
          cm.execCommand('delCharBefore');
          if (!beforeLine.match(/[a-zA-Z0-9$-/:-?{-~!"^_`[\]]/g) && Pos.ch === 0) {
            cm.execCommand('goLineStart');
          }
        }
      },
    };

    return (
      <article>
        <Helmet>
          <title>React Markdown</title>
          <meta name="description" content="React Markdown" />
        </Helmet>
        <div>
          <CodeMirror className="editor-pane" value={this.state.markdownSrc} ref={(editor) => { this.editor = editor; }} onChange={this.updateCode} onScroll={this.scrollEvent} options={options} />
          <Preview math={this.state.markdownSrc} ref={(ref) => { this.preview = ref; }} scrollhandler={this.scrollhandler} focusControl={this.focusControl} />
        </div>
      </article>
    );
  }
}

