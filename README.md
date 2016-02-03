# nextcaltrain.com [![build status](https://secure.travis-ci.org/parshap/nextcaltrain.com.svg?branch=master)](http://travis-ci.org/parshap/nextcaltrain.com)

[Caltrain][] schedule web application

[caltrain]: http://www.caltrain.com/ "California commuter rail line"

## nextcaltrain

Caltrain schedule is provided by the *[nextcaltrain][]* module.

[nextcaltrain]: https://github.com/parshap/nextcaltrain

## Features

### Self-contained HTML

The client application is contained in a single HTML payload with no
external resources. This allows clients to retrieve and cache only a
single resource and simplifies offline access.

See `generate.js` for how this HTML payload is generated.

### localStorage

The last selected route will be saved to localStorage. The next time the
application is used, this route will be loaded.

### URL Hash

The URL hash will always represent the currently selected route.
Updating the URL will also update the currently selected route. This
URL is shareable with others.

### Immutable state

The entire application state is represented as a single immutable value
using the *[immutable][immutable-js]* module. State is updated by
dispatching actions in a *[Flux][]-like* manner. See
[`ui/state.js`][ui/state.js].

[immutable-js]: https://www.npmjs.com/package/immutable
[flux]: http://facebook.github.io/flux/docs/overview.html
[ui/state.js]: ./ui/state.js
