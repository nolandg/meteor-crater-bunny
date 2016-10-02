/* eslint-disable no-use-before-define */
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import React, { Component } from 'react';
import Helmet from 'react-helmet';

const paths = require('./global-paths');

WebApp.connectHandlers.use('/noland_crater-bunny/scripts', (req, res, next) => {
  res.writeHead(200);
  res.end('Hello world from: ' + Meteor.release);
});

// A tag to add once to the top level App component.
// Insert as inline style CSS stripped clean of unused rules (saved by build plugin)
// Insert user's inline script
// Load the Meteor script mothership as async
export default class InlineStrippedCss extends Component {
  constructor(props) {
    super(props);

    // Remove all events that might have been attached by user with inlined scripts
    // that ran before the mother ship arrived
    this.stripAllEventListeners('.event-attached-inline');

    if (Meteor.isServer) {
      // Set this.inlineCss to the stripped css that the build plugin saved
      this.inlineCss = paths.getStrippedCss(this.props.appAssets);
    } else {
      // or on the client, grab the css from the style tag set on the server
      // but this doesn't seem to work, the tag is already destroyed...by helmet?
      // React doesn't seem to mind though and this doesn't trigger a re-render
      const inlineStyleElement = document.querySelector('style.crash-landing');
      if (inlineStyleElement) this.inlineCss = inlineStyleElement.innerHtml;
      else this.inlineCss = '';
    }
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
Element.prototype.addBunnyCraterEventListener = function (eventName, handler) {
  this.addEventListener(eventName, handler);
  this.addClass('bunny-crater-event');
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
`;
