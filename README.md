# immich-css

Custom CSS override for the Immich web UI. Soft colors, rounded shapes, glass surfaces and small hover animations.

## Install

Paste into **Administration > Settings > Theme > Custom CSS**:

```css
@import url('https://gerardumbert.github.io/immich-css/custom.css');
```

Served by GitHub Pages: the URL never changes and updates go live about a minute after each push. Browsers may cache the file for up to 10 minutes, so hard-refresh (Ctrl+F5) to see changes sooner.

## What it changes

- **Colors.** No pure white or pure black backgrounds anywhere: a soft off-white in light mode and a dark gray in dark mode, including the photo viewer.
- **Photo grids.** Day groups and photos have rounded corners, and each photo zooms slightly on hover. This applies to the timeline, search results, albums and other galleries.
- **Scrolling.** On the timeline, album, person, partner and shared pages, photos scroll up behind the top bar instead of being cut off below it.
- **People.** Cards are circles that grow on hover with a ring. The name is plain text with a box only on hover or focus, the menu button is a glass pill in the corner, and the people grid uses fixed-size cards.
- **Albums.** The menu button on each album card matches the one on people cards.
- **Places and explore.** Tiles zoom and un-dim on hover, with the name overlaid on the cover. Explore's person avatars zoom too.
- **Glass surfaces.** The selection bar and the account menu are translucent and blurred. The account menu is one panel with a 1px divider instead of a gray box with white cards.
- **Sidebar.** The user and admin menus look the same: side padding, fully rounded items, and a scrollbar hidden until you hover the menu.
- **Search filters.** Button borders are softer instead of matching the text color.
- **Map.** Rounded canvas, glass controls and markers, and no scale or attribution.

## How it is written

- All tunable values (radii, zoom amount, glass look, sidebar gap, people card size) are variables at the top of `custom.css`.
- Rules hook onto ids, `data-*` attributes and library class names where possible, with a comment naming the upstream file each one depends on.
- A few rules depend on Tailwind classes and break more easily after Immich updates. They are listed under "FRAGILE HOOKS" at the bottom of `custom.css`. Check there first if something stops working.

`immich/` is a local clone of the upstream source used for reference only and is not tracked.
