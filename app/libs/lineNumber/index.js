
module.exports = function lineNumbers(md) {
  function appendAttribute(state) {
    const { tokens } = state;
    for (let i = 0; i < tokens.length; i += 1) {
      if (tokens[i].map) {
        tokens[i].attrJoin('class', `line${String(tokens[i].map[0])} line-block`);
        tokens[i].attrJoin('data-line', `${String([tokens[i].map[0], tokens[i].map[1]])}`);
      }
    }
  }
  md.core.ruler.before('linkify', 'curly_attributes', appendAttribute);
};
