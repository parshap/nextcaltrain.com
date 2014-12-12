# nextcaltrain.com

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
