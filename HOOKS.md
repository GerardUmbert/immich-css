# Hook map

Generated from `hooks.json` by `node tools/hooks.mjs docs`. Do not edit by hand. Checked against Immich **v3.3.1** and @immich/ui **0.90.0**.

Each entry says what a group of rules does, why it exists, which selectors it relies on, and which upstream files those selectors come from.
After an update, run `node tools/hooks.mjs check <oldRef> <newRef>` (Immich) and `node tools/hooks.mjs check-ui <oldVer> <newVer>` (@immich/ui) to list the entries whose files changed.

## colors

- **What:** No pure white / pure black surfaces; page background behind fixed bars
- **Why:** Pure #fff / #000 backgrounds are unwanted. Immich hard-codes them in a few places.
- **CSS section:** colors
- **Selectors:** `--immich-ui-light (full color, not a triplet)`, `--immich-bg / --immich-dark-bg (RGB triplets)`, `--color-white / --color-black (Tailwind theme vars)`, `html.dark:root / html.light:root`
- **Immich files** (under `web/src`): `app.css`, `app.html`
- **@immich/ui files** (under `dist`): `theme/default.css`
- **Verified:** source + runtime (pure-black strip on search page traced to app.html)

## accent

- **What:** Optional accent color switch (off by default)
- **Why:** Lets the purple / pale blue accent be changed from one value.
- **CSS section:** accent color
- **Selectors:** `--immich-primary`, `--immich-dark-primary`, `--immich-ui-primary-50..950`
- **Immich files** (under `web/src`): `app.css`
- **@immich/ui files** (under `dist`): `theme/default.css`
- **Verified:** source only (shown once in a running instance, then reverted)

## photo-grid

- **What:** Rounded day groups and photos, hover zoom (timeline, search, albums, galleries)
- **Why:** Softer look; photos zoom slightly on hover.
- **CSS section:** timeline
- **Selectors:** `[data-image-grid]`, `[data-asset-id]`, `:has(> [data-thumbnail-focus-container])`
- **Immich files** (under `web/src`): `lib/components/timeline/AssetLayout.svelte`, `lib/components/assets/thumbnail/Thumbnail.svelte`, `lib/components/shared-components/gallery-viewer/GalleryViewer.svelte`
- **Verified:** source + runtime (pasted timeline markup)

## navbar-search

- **What:** Search box centered in the top navbar
- **Why:** The search wrapper (max-w-5xl, flex-1) was pushed against the logo side.
- **CSS section:** timeline (Top navbar)
- **Selectors:** `#dashboard-navbar div:has(> div > form[role='search'])`
- **Immich files** (under `web/src`): `lib/components/shared-components/navigation-bar/NavigationBar.svelte`, `lib/components/shared-components/search-bar/SearchBar.svelte`
- **Verified:** source only

## selection-bar

- **What:** Frosted-glass selection / control bar
- **Why:** Replace the solid gray pill.
- **CSS section:** timeline (Selection / control bar)
- **Selectors:** `#control-bar > nav`
- **Immich files** (under `web/src`): `lib/components/shared-components/ControlAppBar.svelte`
- **@immich/ui files** (under `dist`): `components/ControlBar/ControlBar.svelte`
- **Verified:** source only

## scroll-behind-bar

- **What:** Photos scroll up behind the top bar instead of being cut off
- **Why:** Top padding sat outside the scroller and clipped content.
- **CSS section:** timeline (Timeline scroll area, Album / person / partner / shared pages)
- **Selectors:** `div:has(> #asset-grid)`, `#asset-grid`, `main:has(> #asset-grid)`, `main > #asset-grid`, `body:has(#asset-grid) #control-bar (keeps the bar clear of the scrubber strip)`
- **Immich files** (under `web/src`): `lib/components/timeline/Timeline.svelte`, `lib/components/layouts/UserPageLayout.svelte`, `lib/components/album-page/AlbumViewer.svelte`, `routes/(user)/albums/[albumId=id]/[[photos=photos]]/[[assetId=id]]/+page.svelte`, `routes/(user)/partners/[userId]/[[photos=photos]]/[[assetId=id]]/+page.svelte`, `routes/(user)/people/[personId]/[[photos=photos]]/[[assetId=id]]/+page.svelte`, `lib/components/timeline/Scrubber.svelte`, `lib/components/shared-components/ControlAppBar.svelte`
- **Verified:** source + runtime (main page and album screenshots)

## account-menu

- **What:** Solid off-white account panel, pill-shaped Sign Out
- **Why:** Remove the gray box, white cards and hard 4px gap. Immich's focusTrap action inserts sentinel <div>s as first and last children, so child-position selectors (:first-child / :last-child) hit those instead of the real content.
- **CSS section:** Account menu
- **Selectors:** `#account-info-panel`, `#account-info-panel > div:has(figure)`, `#account-info-panel > div > a[href$='/auth/logout']`
- **Immich files** (under `web/src`): `lib/components/shared-components/navigation-bar/AccountInfoPanel.svelte`, `lib/actions/focus-trap.ts`
- **@immich/ui files** (under `dist`): `internal/Button.svelte`, `components/IconButton/IconButton.svelte`
- **Verified:** source + runtime (outerHTML pasted from a v3.3.1 server)

## search-buttons (fragile)

- **What:** Softer borders on search filter buttons
- **Why:** @immich/ui outline buttons draw the border in the exact text color.
- **CSS section:** Search filter panel
- **Selectors:** `[role='listbox'] button[class*='border-dark']`
- **Immich files** (under `web/src`): `lib/components/shared-components/search-bar/SearchFilters.svelte`, `lib/components/shared-components/search-bar/SearchButton.svelte`
- **@immich/ui files** (under `dist`): `internal/Button.svelte`
- **Verified:** source only

## people

- **What:** Circle people cards (grow + ring), plain-text names, glass menu button, fixed-size grid
- **Why:** Cleaner people page; same grow effect as explore avatars.
- **CSS section:** people
- **Selectors:** `#people-card`, `div:has(> #people-card)`, `#people-card + input[type='text']`, `#people-card a > div:has(> button)`, `div:has(> div > #people-card) (grid)`
- **Immich files** (under `web/src`): `routes/(user)/people/PeopleCard.svelte`, `routes/(user)/people/+page.svelte`, `routes/(user)/people/PeopleInfiniteScroll.svelte`
- **@immich/ui files** (under `dist`): `components/ContextMenu/ContextMenuButton.svelte`, `internal/Button.svelte`
- **Verified:** source only

## album-card-button

- **What:** Album card menu button uses the glass pill from people cards
- **Why:** Consistency between albums and people.
- **CSS section:** people (menu button)
- **Selectors:** `[data-testid='context-button-parent'] button`
- **Immich files** (under `web/src`): `lib/components/album-page/AlbumCard.svelte`
- **@immich/ui files** (under `dist`): `components/ContextMenu/ContextMenuButton.svelte`, `internal/Button.svelte`
- **Verified:** source only

## places-explore-tiles (fragile)

- **What:** Places / explore tiles zoom and un-dim; explore person avatars zoom; memory cards and recently-added images zoom inside their frame
- **Why:** Hover feedback; name overlaid on the cover.
- **CSS section:** places/explore, people (explore page avatars)
- **Selectors:** `a:has(> div.brightness-75)`, `a[href*='/people/']:not(#people-card *)`, `a[href*='/memories']:has(> img)`, `button[draggable='false']:has(> img:only-child) (recently added)`
- **Immich files** (under `web/src`): `routes/(user)/explore/+page.svelte`, `routes/(user)/places/PlacesCardGroup.svelte`, `lib/components/memories/MemoryCard.svelte`
- **Verified:** source only

## sidebar

- **What:** Same padding / pill items for user and admin menus, scrollbar hidden until hover, scrollbar on the left
- **Why:** User and admin menus looked different; items were flush left.
- **CSS section:** sidebar
- **Selectors:** `#sidebar`, `div:has(> div > div > div > a[href='/admin/users']) (admin menu has no id)`
- **Immich files** (under `web/src`): `lib/components/sidebar/Sidebar.svelte`, `lib/components/layouts/AdminPageLayout.svelte`, `lib/components/shared-components/side-bar/UserSidebar.svelte`, `lib/components/shared-components/side-bar/RecentAlbums.svelte`
- **@immich/ui files** (under `dist`): `components/Navbar/NavbarItem.svelte`, `components/AppShell/AppShellSidebar.svelte`, `components/Scrollable/Scrollable.svelte`
- **Verified:** source only (left scrollbar and unified spacing not yet confirmed in a running instance)

## map

- **What:** Rounded canvas, glass controls and markers, solid border on cluster markers, no scale / attribution
- **Why:** Match the glass style; hide attribution.
- **CSS section:** map
- **Selectors:** `.maplibregl-canvas`, `.maplibregl-ctrl-bottom-left / -right`, `.maplibregl-map .maplibregl-ctrl-group`, `.maplibregl-marker div / img`
- **Immich files** (under `web/src`): `lib/components/shared-components/map/Map.svelte`
- **Also depends on:** maplibre-gl and svelte-maplibre-gl (marker DOM is generated there)
- **Verified:** unverified (marker DOM not inspected; reported as different from the source)

## scrollbars (fragile)

- **What:** Slim rounded page scrollbar, muted thumbs elsewhere
- **Why:** The default scrollbars have a hard solid track.
- **CSS section:** scrollbars
- **Selectors:** `html::-webkit-scrollbar*`, `.immich-scrollbar`
- **Immich files** (under `web/src`): `app.css`
- **Verified:** source only
