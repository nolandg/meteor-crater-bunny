Now you can use Meteor for both your app **and** your landing pages for one seamless
experience and attain sub-500ms empty cache page loads
and score 100/100 on [Google PageSpeed](https://developers.google.com/speed/pagespeed/insights/).

Meteor rocks for building apps and web apps but it's initial (empty cache) page load time and time-to-first-render
are way too slow to make landing pages.
Slow landing pages lose customers, increase your AdWords costs, and make bunnies cry.
Building landing pages separately from your Meteor app requires re-writing CSS, templates, scripts, etc.
These [two packages](https://github.com/nolandg/meteor-boilerplate-generator)
fix that by making your Meteor app land super fast, like a bunny.

(currently only for [React](https://facebook.github.io/react/)-based apps and not well-polished. I'm open to PRs though...)

# What the packages do
- Removes all unused CSS selectors, rules, and media queries (use a CSS framework without penalty!)
- Inlines the lean CSS with the initial HTML delivery
- Loads all JavaScript asynchronously in production mode
- Inlines a single user-supplied script file
See below for more details on each of these points.

## Removing unused CSS
Normally, using a CSS framework like [Semantic](http://semantic-ui.com/) or [Bootstrap](http://getbootstrap.com/)
meant that your app was doomed to carry 1,000s of unused CSS lines with poor performance
and eliminate any hope of inlining critical above-the-fold CSS the way Google likes it.

This package automatically removes all unused CSS selectors, rules, and media queries from your final
aggregated and minimized CSS file. You supply the list of unused selectors by copying and pasting the list
from such wonderful tools as Chrome Dev Tools --> Audits --> Unused CSS Rules.

As your UI changes you might need to occasionally update the 'unused' list with another copy-paste from the CSS tool.

#### What if my unused CSS tool makes a mistake and the app actually does use an obscure rule?
The missing rule will only be missing for a few seconds. The full CSS file is loaded
asynchronously in the background and replaces the inline CSS as soon as it arrives.

#### Can I still use awesome tools in the CSS build chain like [SASS](http://sass-lang.com/) and [autoprefixer](https://github.com/postcss/autoprefixer)?
Yes! The "normal" Meteor workflow seems to be using [juliancwirko:postcss](https://atmospherejs.com/juliancwirko/postcss)
for these things and (because this package needs to be the CSS minifier) it provides the same functionality as `juliancwirko:postcss`.

#### But will my icon font still work? Even with embedded octet streams?
Yes! But don't use a full icon font if you want to inline it because that would be huge.
Use an excellent service like [Fontello](http://fontello.com/) to build a custom iconic font
with only the icons you actually use and embed that.

And yes, you can inline a few icons with the initial HTML delivery and your page will render immediately with the pretty
icons--no flash of weird unsupported symbols.

## Inlining the lean CSS
Now that you have a very lean CSS files, why force your user to do another request for it?
This packages serves your CSS inline with the inital page request HTML.
Thus the initial render happens faster than a bunny can shake a paw.
Inlining critical above-the-fold CSS is also a requirement
to score 100/100 on [Google PageSpeed](https://developers.google.com/speed/pagespeed/insights/) and reduce your AdWords cost.

## Loading JavaScript asynchronously
Meteor's biggest empty cache speed killer is the JavaScript payload. Often over 1MB, it can take a mobile phone
a significant time to download and parse it and your user is left waiting with a blank screen.
Again, [Google PageSpeed](https://developers.google.com/speed/pagespeed/insights/) requires critical scripts to be inline
and everything else to load async so the page can at least render and give the user something to read while the rest comes in.

Using server-side-rendering (SSR), you can deliver rendered HTML with the initial request, but because of Meteor's
inflexible [`boilerplate-generator` core package](https://github.com/meteor/meteor/tree/devel/packages/boilerplate-generator),
the script files still load synchronously and tools like [Google PageSpeed](https://developers.google.com/speed/pagespeed/insights/)
perceive your page's performance as very poor.

This [`boilerplate-generator` replacement package](https://github.com/nolandg/meteor-boilerplate-generator)
asynchronously loads the mothership script file in production mode.
Thus your page renders immediately and a few seconds later it transparently becomes a fully functional Meteor web app.

## But I need a few small script functions right away!
Often, your UI will have a few features that require script to be functional--like menus or "Subscribe Now!" buttons
that would really suck if your user had to wait 4 seconds for the mothership to arrive before they become functional.

This package inlines a single user-supplied script file into the initial request. This is where you can
attach a few events and define some simple behaviours your user might need in the first few seconds.
This packages also provides a few simple utility functions like `addClass()`, `removeClass()`, and `toggleClass()`
to make life easier without jQuery.

#### But won't those extra events mess with the events my Meteor app will attach later?
No. This package also provides a safe event attachment method that will track all the events you attach
and when the mothership script arrives, all your events will be removed to avoid any conflicts or double actions.

# Requirements
This packages currently requires React-based server-side-rendering using these packages:
- [`react-router`](https://github.com/ReactTraining/react-router)
- [`react-router-ssr`](https://github.com/thereactivestack-legacy/meteor-react-router-ssr)
- [`react-helmet`](https://github.com/nfl/react-helmet)

These give you an awesome SSR app and full control over your `<head>` tags for SEO.

# Installation
This `crater-bunny` package can be installed via [Atmosphere](https://atmospherejs.com/)
but the required `boilerplate-generator` package must be installed
manually because it overrides Meteor's core `boilerplate-generator` package.

1. `meteor add noland:crater-bunny`
1. Create a directory structure and files like so:
    - my-meteor-app/private/noland_crater-bunny/unused-css-selectors.txt
    - my-meteor-app/private/noland_crater-bunny/.lib/  
    (PR to auto-generate these anyone?)  
1. Follow the [`boilerplate-generator` installation instructions](https://github.com/nolandg/meteor-boilerplate-generator)

# Usage
Add the React component to your top-level app component:  
````jsx
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { CraterBunny } from 'meteor/noland:crater-bunny';

export default class App extends Component {
  render() {
    // We need to pass a handle to our Assets to the <CraterBunny> component
    const appAssets = Meteor.isServer ? Assets : null;

    return (
      <div>
        <CraterBunny appAssets={appAssets} />
        <Helmet
          meta={[
            { charset: 'UTF-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          ]}
          script={[
            // External, non-inlinable scripts could go here, preferably async true
            { type: 'text/javascript', src: 'https://js.stripe.com/v2/', async: 'true' },
          ]}
        />
        {this.props.children}
      </div>
    );
  }

}

App.propTypes = {
  children: React.PropTypes.node,
};
````
Write some script that needs to be available instantly into `my-meteor-app/private/noland_crater-bunny/inline.js`:
````js
document.addEventListener('DOMContentLoaded', function () {
  var navicon = document.getElementById('main-menu-navicon');

  if (navicon) {
    // Use the safe event listener function so this event will be automatically
    // removed later to avoid conflicts with the Meteor app
    navicon.addCraterBunnyEventListener('click', function(){
      console.log('Navicon was clicked');
    });
  }
});
````
Copy-paste a list of unused CSS rules from a tool like Chrome Dev Tools (Audits --> Unused CSS rules) into
`my-meteor-app/private/noland_crater-bunny/unused-css-selectors.txt`. These can be one per line
or separated by a comma:
````
p:first-child
audio, canvas, progress, video
audio:not([controls])
.ui.menu:not(.vertical) .item > .input
.ui.menu .item > .input input
````
Launch your app in production mode:
````
meteor --production
````
View the page source and ensure that the mothership script tag is async, your CSS is
inline and doesn't include any unused rules, and your inline script runs.

# Next Steps
The packages work great for me in production now and I'm happy to take PRs and/or fix
bugs that are well reported.

**To Do:**
- Clean out legacy code from `global-paths`
- Auto-generate required files and directories if not existing
- Get MDG to modify `boilerplate-generator` to avoid needing the override
- Make proper whitelisting functionality to save/remove `@font-face`s from CSS
