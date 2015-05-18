"use strict";

var React = require("react");
var el = React.createElement;

module.exports = React.createClass({
  propTypes: {
    cases: React.PropTypes.arrayOf(React.PropTypes.func),
  },

  getDefaultProps: function() {
    return {
      cases: [],
    };
  },

  getInitialState: function() {
    return {
      width: null,
      height: null,
    };
  },

  componentDidMount: function() {
    this.setSize();
    window.addEventListener("resize", this.setSize);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.setSize);
  },

  setSize: function() {
    if ( ! this.isMounted()) {
      throw new Error("Component must be mounted when setSize() is called.");
    }

    var node = this.refs.container.getDOMNode();
    this.setState({
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  },

  render: function() {
    var size = {
      width: this.state.width,
      height: this.state.height,
    };
    return el("div", {
      ref: "container",
      children: this.props.cases.map(function(renderCase) {
        return renderCase(size);
      })
    });
  },
});
