Now you can use Meteor for both your app **and** your landing pages for one seamless
experience and attain sub-500ms empty cache page loads
and score 100/100 on [Google PageSpeed](https://developers.google.com/speed/pagespeed/insights/).

Meteor rocks for building apps and web apps but it's initial (empty cache) page load time and time-to-first-render
are way too slow to make landing pages.
Slow landing pages lose customers, increase your AdWords costs, and make bunnies cry.
Building landing pages separately from your Meteor app requires re-writing CSS, templates, scripts, etc.
These two packages fix that by making your Meteor app land super fast, like a bunny.

# What the packages do
- Removes all unused CSS selectors, rules, and media queries (use a CSS framework without penalty!)
- Inlines the lean CSS with the initial HTML delivery
- Loads all JavaScript asynchronously in production mode
- Inlines a single user-supplied script file
See below for more details on each of these points.

## Removing unused CSS
Normally, using a CSS framework like [Semantic](http://semantic-ui.com/) or [Bootstrap](http://getbootstrap.com/)
meant that your app was doomed to carry 1,000s (or 10,000s) of unused CSS lines and reduce performance
and completely eliminate any hope of inlining critical above-the-fold CSS the way Google likes it.

This package automatically removes all unused CSS selectors, rules, and media queries from your final
aggregated and minimized CSS file. You supply the list of unused selectors by copying and pasting the list
from such wonderful tools as Chrome --> Dev Tools --> Audits --> Used CSS Rules.
You might start with 200kB of CSS but in production, the client will only be served the CSS you actually use, maybe 10kB.
As your UI changes you might need to occasionally update the 'unused' list with another copy-paste from the CSS tool.

**Can I still use awesome tools in the CSS build chain like [SASS](http://sass-lang.com/)
and [autoprefixer](https://github.com/postcss/autoprefixer)?**
Yes! The "normal" Meteor workflow seems to be using [juliancwirko:postcss](https://atmospherejs.com/juliancwirko/postcss)
for these things and that works great with these packages.

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

This repo provides a replacement `boilerplate-generator` package that asynchronously loads the mothership script file in production mode.

##

# Installation
This `crater-bunny` package can be installed via [Atmosphere](https://atmospherejs.com/) and the required `boilerplate-generator` package must be installed
manually because it must override Meteor's default `boilerplate-generator` package.



# What these packages provide
