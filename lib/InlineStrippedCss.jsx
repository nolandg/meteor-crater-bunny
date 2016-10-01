import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import Helmet from 'react-helmet';

export default class InlineStrippedCss extends Component {
  componentWillMount() {
    // Remove all events that might have been attached by user with inlined scripts
    // that ran before the mother ship arrived
    this.stripAllEventListeners('.event-attached-inline');
  }

  // Return the string of css that is to be inlined
  // Fetches it from the app's
  getInlineCss() {
    let css = '';
    if (Meteor.isServer) {
      css = this.props.appAssets.getText('noland_crash-landing/stripped.css');
    } else {
      css = $('style.crash-landing').html() + '  ';
    }
    return css;
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
            cssText: this.getInlineCss(),
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
