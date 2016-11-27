Meteor rocks for building apps and web apps but it's initial (empty cache) page load time and time-to-first-render
are way too slow to make good landing pages. This collection of packages fixes that by making your Meteor app
land super fast, like a bunny. Now you can use Meteor for both your app **and** your landing pages for one seamless
experience and attain sub-500ms empty cache page loads.

**What the packages do:**
-Removes all unused CSS selectors, rules, and media queries (use a CSS lib without penalty!)
-Inlines the lean CSS with the initial HTML delivery
-Loads all JavaScript asynchronously in production mode
-Inlines a single user-supplied script file

# Installation
This `crater-bunny` pacakge can be installed via [Atmosphere](https://atmospherejs.com/) and the required `boilerplate-generator` package must be installed
manually because it must override Meteor's default `boilerplate-generator` package.



# What these packages provide
