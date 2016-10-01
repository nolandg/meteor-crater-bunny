import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import Helmet from 'react-helmet';

const paths = require('./global-paths');

export default class InlineStrippedCss extends Component {
  constructor(props) {
    super(props);

    if (Meteor.isServer) {
      this.inlineCss = paths.getAsset('stylesheets', 'css', this.props.appAssets);
    } else {
      const inlineStyleElement = document.querySelector('style.crash-landing');
      if (inlineStyleElement) this.inlineCss = inlineStyleElement.innerHtml;
      else this.inlineCss = '';
    }
  }

  componentWillMount() {
    // Remove all events that might have been attached by user with inlined scripts
    // that ran before the mother ship arrived
    this.stripAllEventListeners('.event-attached-inline');
  }

  // Strips all event listeners from an element by replacing it with a clone
  stripAllEventListeners(selector) {
    if (!Meteor.isClient) {
      return;
    }

    const elements = document.querySelectorAll(selector);

    for (let i = 0; i < elements.length; i += 1) {
      const node = elements[i];
      const clone = node.cloneNode(true);
      node.parentNode.replaceChild(clone, node);
    }
  }

  render() {
    return (
      <div className="">
        <Helmet
          style={[{
            cssText: this.inlineCss,
            class: 'crash-landing',
          }]}
        />
      </div>
    );
  }
}

InlineStrippedCss.propTypes = {
  appAssets: React.PropTypes.object,
};

const inlineJsHelpersString = `
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
`
