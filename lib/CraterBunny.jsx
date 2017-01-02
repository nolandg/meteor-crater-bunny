/* eslint-disable no-use-before-define */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import Helmet from 'react-helmet';

const paths = require('./global-paths');

// A component to add once to the top level App component.
//
// Insert inline CSS stripped clean of unused rules (saved by build plugin)
// Insert user's inline script
export default class InlineStrippedCss extends Component {
  constructor(props) {
    super(props);

    this.stripAllEventListeners();
  }

  // Remove all events that might have been attached by user with inlined scripts
  // that ran before the mothership arrived
  stripAllEventListeners() {
    if (!Meteor.isClient || (typeof CraterBunnyEventElements === 'undefined')) {
      return;
    }

    // this is defined in the inlined script
    const elements = CraterBunnyEventElements; // eslint-disable-line no-undef

    for (let i = 0; i < elements.length; i += 1) {
      const node = elements[i];
      const clone = node.cloneNode(true);
      node.parentNode.replaceChild(clone, node);
    }
  }

  render() {
    return (
      <div className="crater-bunny">
        <Helmet
          script={[
            { innerHTML: Meteor.isServer ? inlineJsHelpersString : '', type: 'text/javascript' },
            { innerHTML: Meteor.isServer ? paths.getUserInlineJs(this.props.appAssets) : '', type: 'text/javascript' },
          ]}
        />
      </div>
    );
  }
}

InlineStrippedCss.propTypes = {
  appAssets: React.PropTypes.object,
};

const inlineJsHelpersString = `
var CraterBunnyEventElements = [];

Element.prototype.addCraterBunnyEventListener = function (eventName, handler) {
  this.addEventListener(eventName, handler);
  CraterBunnyEventElements.push(this);
}

Element.prototype.hasClass = function (className) {
    return new RegExp(' ' + className + ' ').test(' ' + this.className + ' ');
};

Element.prototype.addClass = function (className) {
    if (!this.hasClass(className)) {
        this.className += ' ' + className;
    }
    return this;
};

Element.prototype.removeClass = function (className) {
    var newClass = ' ' + this.className.replace(/[\\t\\r\\n]/g, ' ') + ' ';
    if (this.hasClass(className)) {
        while (newClass.indexOf( ' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        this.className = newClass.replace(/^\s+|\s+$/g, ' ');
    }
    return this;
};

Element.prototype.toggleClass = function (className) {
    var newClass = ' ' + this.className.replace(/[\\t\\r\\n]/g, " ") + ' ';
    if (this.hasClass(className)) {
        while (newClass.indexOf(" " + className + " ") >= 0) {
            newClass = newClass.replace(" " + className + " ", " ");
        }
        this.className = newClass.replace(/^\s+|\s+$/g, ' ');
    } else {
        this.className += ' ' + className;
    }
    return this;
};

var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
};
`;
