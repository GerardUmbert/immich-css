# immich-css

Custom CSS override for the Immich web UI. Soft colors, rounded shapes, glass surfaces and small hover animations.

## Install

Paste into **Administration > Settings > Theme > Custom CSS**:

```css
@import url('https://gerardumbert.github.io/immich-css/custom.css');
```

Served by GitHub Pages: the URL never changes and updates go live about a minute after each push. Browsers may cache the file for up to 10 minutes, so hard-refresh (Ctrl+F5) to see changes sooner.

## What it changes

- **Colors.** No pure white or pure black backgrounds anywhere: a soft off-white in light mode and a dark gray in dark mode, including the photo viewer and the page background behind fixed bars.
- **Accent color (optional).** Off by default. A ready-made block in `custom.css` recolors Immich's purple (and the dark-mode pale blue) from a single value, for example a pastel orange. See "accent color" in the file for how to turn it on.
- **Photo grids.** Day groups and photos have rounded corners, and each photo zooms slightly on hover. This applies to the timeline, search results, albums and other galleries.
- **Scrolling.** On the timeline, album, person, partner and shared pages, photos scroll up behind the top bar instead of being cut off below it.
- **People.** Cards are circles that grow on hover with a ring. The name is plain text with a box only on hover or focus, the menu button is a glass pill in the corner, and the people grid uses fixed-size cards.
- **Albums.** The menu button on each album card matches the one on people cards.
- **Places and explore.** Tiles zoom and un-dim on hover, with the name overlaid on the cover. Explore's person avatars zoom too.
- **Glass surfaces.** The selection bar is translucent and blurred. The account menu is one solid panel with a pill-shaped sign-out button instead of a gray box with white cards.
- **Sidebar.** The user and admin menus look the same: side padding, fully rounded items, and a scrollbar hidden until you hover the menu.
- **Scrollbars.** The page scrollbar is a slim rounded thumb with no track, turning accent-colored on hover. Other scroll areas get a muted thumb.
- **Search filters.** Button borders are softer instead of matching the text color.
- **Map.** Rounded canvas, glass controls, cluster markers with a solid border, and no scale or attribution.

## How it is written

- All tunable values (radii, zoom amount, glass look, sidebar gap, people card size) are variables at the top of `custom.css`.
- Rules hook onto ids, `data-*` attributes and library class names where possible, with a comment naming the upstream file each one depends on.
- A few rules depend on Tailwind classes and break more easily after Immich updates. They are listed under "FRAGILE HOOKS" at the bottom of `custom.css`. Check there first if something stops working.

## After an Immich update

Written and checked against Immich **v3.3.1** and `@immich/ui` **0.90.0**. The rules hook onto the web UI's source, and the HTML the browser ends up with can differ from the templates (scripts in the source add elements at runtime, such as the focus-trap helper `<div>`s in popups), so a rule that looks right in the source can still miss. Inspect the real element when in doubt.

`HOOKS.md` maps every group of rules to its purpose, its selectors and the upstream files they come from. It is generated from `hooks.json`.

### Keeping track of upstream changes

The upstream sources live in two git-ignored folders next to the CSS: `immich/` (the Immich repo) and `ui/<version>/` (the published `@immich/ui` package). Recreate them on any machine with:

```
node tools/hooks.mjs setup
```

After a new release comes out:

```
git -C immich fetch --depth 1 origin tag <newTag>
node tools/hooks.mjs check <oldTag> <newTag>        # Immich files the rules depend on
node tools/hooks.mjs ui-version <newTag>            # which @immich/ui version it pins
node tools/hooks.mjs check-ui <oldVer> <newVer>     # @immich/ui files the rules depend on
```

Each command lists only the rule groups whose files changed, with their selectors, so you know what to re-inspect. Maplibre (map marker markup) isn't covered; compare its version by hand. When everything is checked, update `checkedAgainst` / `uiVersion` in `hooks.json` and run `node tools/hooks.mjs docs`.

### When something looks off

1. Open the page, right-click the element, **Inspect**, and compare its markup with the rule's selector in `custom.css`.
2. Check the "FRAGILE HOOKS" list at the bottom of `custom.css` first. Those depend on Tailwind or library class names.
3. Walk through the pages that carry the most rules:
   - timeline (photo grid, hover zoom, scrolling behind the top bar)
   - an album page (menu button, scrolling behind the bar)
   - `/people` (cards, names, grid) and `/explore`
   - the search page and its filter panel (button borders, bar)
   - the account menu and sidebar (user and admin)
   - the map (markers and controls), in light and dark mode

`immich/` and `ui/` are reference copies of upstream code and are not tracked.
