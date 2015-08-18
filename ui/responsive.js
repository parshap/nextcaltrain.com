// A component that renders conditional children depending on the width and
// height of itself.
//
// Think @media queries but relative to an element instead of the device.
//
"use strict";

var React = require("react");
var el = React.createElement;

module.exports.Self = React.createClass({
  propTypes: {
    cases: React.PropTypes.arrayOf(React.PropTypes.func),
    getState: React.PropTypes.func.isRequired,
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

module.exports.Window = React.createClass({
  propTypes: {
    renderChildren: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      width: null,
      height: null,
    };
  },

  getState: function() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  componentDidMount: function() {
    this.updateState();
    window.addEventListener("resize", this.updateState);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.updateState);
  },

  updateState: function() {
    if ( ! this.isMounted()) {
      throw new Error("Component must be mounted when setState() is called.");
    }

    this.setState(this.getState());
  },

  render: function() {
    if (this.props.renderChildren) {
      return this.props.renderChildren(this.state);
    }
    else {
      return null;
    }
  },
});
