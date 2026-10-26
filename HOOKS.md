# Hook map

Generated from `hooks.json` by `node tools/hooks.mjs docs`. Do not edit by hand. Checked against Immich **v3.3.5** and @immich/ui **0.90.0**.

Each entry says what a group of rules does, why it exists, which selectors it relies on, and which upstream files those selectors come from.
After an update, run `node tools/hooks.mjs check <oldRef> <newRef>` (Immich) and `node tools/hooks.mjs check-ui <oldVer> <newVer>` (@immich/ui) to list the entries whose files changed.

## colors

- **What:** No pure white / pure black surfaces; page background behind fixed bars
- **Why:** Pure #fff / #000 backgrounds are unwanted. Immich hard-codes them in a few places.
- **CSS section:** colors
- **Selectors:** `--immich-ui-light (full color, not a triplet)`, `--immich-bg / --immich-dark-bg (RGB triplets)`, `--color-white / --color-black (Tailwind theme vars)`, `html.dark:root / html.light:root`
- **Immich files** (under `web/src`): `app.css`, `app.html`
- **@immich/ui files** (under `dist`): `theme/default.css`
- **Assumptions checked by `anchors`:**
  - html.dark hard-codes a black background (`app.html`)
  - html.light hard-codes a white background (`app.html`)
  - legacy dark background variable (`app.css`)
  - ui theme still defines --immich-ui-light (`theme/default.css`, @immich/ui)
- **Verified:** source + runtime (pure-black strip on search page traced to app.html)

## accent

- **What:** Optional accent color switch (off by default)
- **Why:** Lets the purple / pale blue accent be changed from one value.
- **CSS section:** accent color
- **Selectors:** `--immich-primary`, `--immich-dark-primary`, `--immich-ui-primary-50..950`
- **Immich files** (under `web/src`): `app.css`
- **@immich/ui files** (under `dist`): `theme/default.css`
- **Assumptions checked by `anchors`:**
  - legacy light accent variable (`app.css`)
  - legacy dark accent variable (`app.css`)
  - ui accent scale base (`theme/default.css`, @immich/ui)
- **Verified:** source only (shown once in a running instance, then reverted)

## photo-grid

- **What:** Rounded day groups and photos, hover zoom (timeline, search, albums, galleries)
- **Why:** Softer look; photos zoom slightly on hover.
- **CSS section:** timeline
- **Selectors:** `[data-image-grid]`, `[data-asset-id]`, `:has(> [data-thumbnail-focus-container])`, `:is(img, video) inside the slot (video thumbnails swap img for <video> on hover)`
- **Immich files** (under `web/src`): `lib/components/timeline/AssetLayout.svelte`, `lib/components/assets/thumbnail/Thumbnail.svelte`, `lib/components/shared-components/gallery-viewer/GalleryViewer.svelte`, `lib/components/assets/thumbnail/VideoThumbnail.svelte`
- **Assumptions checked by `anchors`:**
  - day group container hook (`lib/components/timeline/AssetLayout.svelte`)
  - photo slot hook (`lib/components/timeline/AssetLayout.svelte`)
  - thumbnail root hook (search and album grids) (`lib/components/assets/thumbnail/Thumbnail.svelte`)
  - video thumbnails still use a <video> element that replaces the still image on hover (it must zoom like the img) (`lib/components/assets/thumbnail/VideoThumbnail.svelte`)
- **Verified:** source + runtime (pasted timeline markup)

## navbar-search

- **What:** Search box centered in the top navbar
- **Why:** The search wrapper (max-w-5xl, flex-1) was pushed against the logo side.
- **CSS section:** timeline (Top navbar)
- **Selectors:** `#dashboard-navbar div:has(> div > form[role='search'])`
- **Immich files** (under `web/src`): `lib/components/shared-components/navigation-bar/NavigationBar.svelte`, `lib/components/shared-components/search-bar/SearchBar.svelte`
- **Assumptions checked by `anchors`:**
  - navbar id (`lib/components/shared-components/navigation-bar/NavigationBar.svelte`)
  - search wrapper div directly contains SearchBar (`lib/components/shared-components/navigation-bar/NavigationBar.svelte`)
  - SearchBar renders div > form[role=search] (`lib/components/shared-components/search-bar/SearchBar.svelte`)
- **Verified:** source only

## selection-bar

- **What:** Frosted-glass selection / control bar
- **Why:** Replace the solid gray pill.
- **CSS section:** timeline (Selection / control bar)
- **Selectors:** `#control-bar > nav`
- **Immich files** (under `web/src`): `lib/components/shared-components/ControlAppBar.svelte`
- **@immich/ui files** (under `dist`): `components/ControlBar/ControlBar.svelte`
- **Assumptions checked by `anchors`:**
  - control bar wrapper id (`lib/components/shared-components/ControlAppBar.svelte`)
  - ControlBar renders a <nav> (`components/ControlBar/ControlBar.svelte`, @immich/ui)
- **Verified:** source only

## scroll-behind-bar

- **What:** Photos scroll up behind the top bar instead of being cut off
- **Why:** Top padding sat outside the scroller and clipped content.
- **CSS section:** timeline (Timeline scroll area, Album / person / partner / shared pages)
- **Selectors:** `div:has(> #asset-grid)`, `#asset-grid`, `main:has(> #asset-grid)`, `main > #asset-grid`, `body:has(#asset-grid) #control-bar (keeps the bar clear of the scrubber strip)`
- **Immich files** (under `web/src`): `lib/components/timeline/Timeline.svelte`, `lib/components/layouts/UserPageLayout.svelte`, `lib/components/album-page/AlbumViewer.svelte`, `routes/(user)/albums/[albumId=id]/[[photos=photos]]/[[assetId=id]]/+page.svelte`, `routes/(user)/partners/[userId]/[[photos=photos]]/[[assetId=id]]/+page.svelte`, `routes/(user)/people/[personId]/[[photos=photos]]/[[assetId=id]]/+page.svelte`, `lib/components/timeline/Scrubber.svelte`, `lib/components/shared-components/ControlAppBar.svelte`
- **Assumptions checked by `anchors`:**
  - timeline scroller id (`lib/components/timeline/Timeline.svelte`)
  - scrubber width is 60px (hard-coded as --c-scrubber-w in the CSS) (`lib/components/timeline/Scrubber.svelte`)
  - scrubber hook (`lib/components/timeline/Scrubber.svelte`)
- **Verified:** source + runtime (main page and album screenshots)

## timeline-skeleton

- **What:** Loading placeholder of the timeline looks like a justified gallery (mixed widths, rounded cells)
- **Why:** Immich tiles one flat square image over a whole unloaded month; this mimics real rows instead, colored from the accent scale.
- **CSS section:** Timeline loading placeholder
- **Selectors:** `#virtual-timeline [data-skeleton]`
- **Immich files** (under `web/src`): `lib/elements/Skeleton.svelte`, `lib/components/timeline/Timeline.svelte`
- **Assumptions checked by `anchors`:**
  - skeleton element hook (`lib/elements/Skeleton.svelte`)
  - skeleton draws its pattern with a background-image (replaced by the mask) (`lib/elements/Skeleton.svelte`)
  - skeleton is rendered inside #virtual-timeline (`lib/components/timeline/Timeline.svelte`)
  - desktop row height is 235 (hard-coded in the mask) (`lib/components/timeline/Timeline.svelte`)
  - mobile row height is 100 (hard-coded in the mask) (`lib/components/timeline/Timeline.svelte`)
  - skeleton switches size at 767px (the mask media query matches it) (`lib/elements/Skeleton.svelte`)
- **Verified:** rendered in headless Chrome (light, dark, mobile width); not yet seen in a running Immich

## account-menu

- **What:** Solid off-white account panel, pill-shaped Sign Out
- **Why:** Remove the gray box, white cards and hard 4px gap. Immich's focusTrap action inserts sentinel <div>s as first and last children, so child-position selectors (:first-child / :last-child) hit those instead of the real content.
- **CSS section:** Account menu
- **Selectors:** `#account-info-panel`, `#account-info-panel > div:has(figure)`, `#account-info-panel > div > a[href$='/auth/logout']`
- **Immich files** (under `web/src`): `lib/components/shared-components/navigation-bar/AccountInfoPanel.svelte`, `lib/actions/focus-trap.ts`
- **@immich/ui files** (under `dist`): `internal/Button.svelte`, `components/IconButton/IconButton.svelte`
- **Assumptions checked by `anchors`:**
  - panel id (`lib/components/shared-components/navigation-bar/AccountInfoPanel.svelte`)
  - sign-out link comes from Route.logout() (`lib/components/shared-components/navigation-bar/AccountInfoPanel.svelte`)
  - logout path (selector matches an href ending in /auth/logout) (`lib/route.ts`)
  - focus trap still inserts sentinel divs (why child-position selectors are avoided) (`lib/actions/focus-trap.ts`)
  - avatar renders a <figure> (the profile card is found by it) (`lib/components/shared-components/UserAvatar.svelte`)
- **Verified:** source + runtime (outerHTML pasted from a v3.3.1 server)

## search-buttons (fragile)

- **What:** Softer borders on search filter buttons
- **Why:** @immich/ui outline buttons draw the border in the exact text color.
- **CSS section:** Search filter panel
- **Selectors:** `[role='listbox'] button[class*='border-dark']`
- **Immich files** (under `web/src`): `lib/components/shared-components/search-bar/SearchFilters.svelte`, `lib/components/shared-components/search-bar/SearchButton.svelte`
- **@immich/ui files** (under `dist`): `internal/Button.svelte`
- **Assumptions checked by `anchors`:**
  - search dropdown keeps role=listbox (`lib/components/shared-components/search-bar/SearchFilters.svelte`)
  - ui secondary outline button still uses the border-dark class (`internal/Button.svelte`, @immich/ui)
- **Verified:** source only

## people

- **What:** Circle people cards (grow + ring), plain-text names, glass menu button, fixed-size grid
- **Why:** Cleaner people page; same grow effect as explore avatars.
- **CSS section:** people
- **Selectors:** `#people-card`, `div:has(> #people-card)`, `#people-card + input[type='text']`, `#people-card a > div:has(> button)`, `div:has(> div > #people-card) (grid)`
- **Immich files** (under `web/src`): `routes/(user)/people/PeopleCard.svelte`, `routes/(user)/people/+page.svelte`, `routes/(user)/people/PeopleInfiniteScroll.svelte`
- **@immich/ui files** (under `dist`): `components/ContextMenu/ContextMenuButton.svelte`, `internal/Button.svelte`
- **Assumptions checked by `anchors`:**
  - card id (`routes/(user)/people/PeopleCard.svelte`)
  - name input is the next sibling of the card (`routes/(user)/people/+page.svelte`)
  - people grid container (`routes/(user)/people/PeopleInfiniteScroll.svelte`)
- **Verified:** source only

## album-card-button

- **What:** Album card menu button uses the glass pill from people cards
- **Why:** Consistency between albums and people.
- **CSS section:** people (menu button)
- **Selectors:** `[data-testid='context-button-parent'] button`
- **Immich files** (under `web/src`): `lib/components/album-page/AlbumCard.svelte`
- **@immich/ui files** (under `dist`): `components/ContextMenu/ContextMenuButton.svelte`, `internal/Button.svelte`
- **Assumptions checked by `anchors`:**
  - menu button wrapper test id (`lib/components/album-page/AlbumCard.svelte`)
- **Verified:** source only

## album-card-dates

- **What:** Album cards hide the date range under the name; the item count stays
- **Why:** The dates are noise; the item count is what matters.
- **CSS section:** people (menu button), album card dates rule
- **Selectors:** `[data-testid='album-card'] [data-testid='album-name'] + p`
- **Immich files** (under `web/src`): `lib/components/album-page/AlbumCard.svelte`
- **Assumptions checked by `anchors`:**
  - album card test id (`lib/components/album-page/AlbumCard.svelte`)
  - the date range is a <p> right after the name <p> (`lib/components/album-page/AlbumCard.svelte`)
  - the item count is inside a <span>, not a <p> next to the name, so the rule does not hide it (`lib/components/album-page/AlbumCard.svelte`)
- **Verified:** source only

## album-card-empty

- **What:** Empty albums (no cover image) are hidden from the album list
- **Why:** Albums with 0 items are clutter; CSS cannot match the count text, so the missing cover is the signal.
- **CSS section:** people (menu button), empty albums rule
- **Selectors:** `a:has(> [data-testid='album-card'] img[data-testid='album-image'][src*='no-thumbnail'])`
- **Immich files** (under `web/src`): `lib/components/album-page/AlbumCard.svelte`, `lib/components/album-page/AlbumCardGroup.svelte`, `lib/components/album-page/AlbumCover.svelte`, `lib/components/sharedlinks-page/covers/NoCover.svelte`
- **Assumptions checked by `anchors`:**
  - the card is the direct child of its link, which is what gets hidden (`lib/components/album-page/AlbumCardGroup.svelte`)
  - no thumbnail asset id means the placeholder cover (`lib/components/album-page/AlbumCover.svelte`)
  - the placeholder image has the album-image test id and a no-thumbnail source (`lib/components/sharedlinks-page/covers/NoCover.svelte`)
- **Verified:** source only

## places-tiles (fragile)

- **What:** Places tiles (explore and /places) zoom and un-dim, name overlaid on the cover
- **Why:** Hover feedback; name overlaid on the cover.
- **CSS section:** places/explore
- **Selectors:** `a:has(> div.brightness-75)`
- **Immich files** (under `web/src`): `routes/(user)/explore/+page.svelte`, `routes/(user)/places/PlacesCardGroup.svelte`
- **Assumptions checked by `anchors`:**
  - places tile image keeps its Tailwind brightness-75 class (the only hook) (`routes/(user)/explore/+page.svelte`)
  - places page tile keeps brightness-75 (`routes/(user)/places/PlacesCardGroup.svelte`)
- **Verified:** source only

## explore-zoom (fragile)

- **What:** Explore page: person avatars, memory cards and recently-added images zoom on hover
- **Why:** Same hover zoom as the photo grid, inside the frame (the frame does not grow).
- **CSS section:** people (explore avatars), places/explore (memories and recently added)
- **Selectors:** `a[href*='/people/']:not(#people-card *) > div:first-child`, `a[href*='/memories']:has(> img)`, `button[draggable='false']:has(> img:only-child) (recently added)`
- **Immich files** (under `web/src`): `routes/(user)/explore/+page.svelte`, `lib/components/memories/MemoryCard.svelte`, `lib/route.ts`
- **Assumptions checked by `anchors`:**
  - explore person link has a div (avatar frame) as first child (`routes/(user)/explore/+page.svelte`)
  - recently-added item is a draggable="false" button whose only child is an img (`routes/(user)/explore/+page.svelte`)
  - memory card is a link with the img as direct first child (`lib/components/memories/MemoryCard.svelte`)
  - memory links still come from Route.memories (selector looks for /memories in the href) (`lib/route.ts`)
- **Verified:** source only

## explore-spacing (fragile)

- **What:** Explore page: more space between sections (not above the first); carousel top margin removed under a heading
- **Why:** Sections felt cramped; the memories carousel adds its own mt-3 on top of the heading margin.
- **CSS section:** places/explore (section spacing, carousel spacing)
- **Selectors:** `div:has(> div > p + a[draggable='false']) ~ div:has(...) (section spacing)`, `div:has(> p) + section[style*='scrollbar-width:none'] (carousel mt-3)`
- **Immich files** (under `web/src`): `routes/(user)/explore/+page.svelte`
- **@immich/ui files** (under `dist`): `components/ImageCarousel/ImageCarousel.svelte`
- **Assumptions checked by `anchors`:**
  - heading row: <p> title directly followed by a "view all" link with draggable="false" (people) (`routes/(user)/explore/+page.svelte`)
  - heading row shape (places) (`routes/(user)/explore/+page.svelte`)
  - heading row shape (memories) (`routes/(user)/explore/+page.svelte`)
  - heading row shape (recently added) (`routes/(user)/explore/+page.svelte`)
  - carousel section keeps its inline scrollbar-width:none style (the hook) (`components/ImageCarousel/ImageCarousel.svelte`, @immich/ui)
  - carousel still adds its own mt-3 (the margin being removed) (`components/ImageCarousel/ImageCarousel.svelte`, @immich/ui)
- **Verified:** source only

## sidebar

- **What:** Same padding / pill items for user and admin menus, scrollbar hidden until hover, scrollbar on the left
- **Why:** User and admin menus looked different; items were flush left.
- **CSS section:** sidebar
- **Selectors:** `#sidebar`, `div:has(> div > div > div > a[href='/admin/users']) (admin menu has no id)`
- **Immich files** (under `web/src`): `lib/components/sidebar/Sidebar.svelte`, `lib/components/layouts/AdminPageLayout.svelte`, `lib/components/shared-components/side-bar/UserSidebar.svelte`, `lib/components/shared-components/side-bar/RecentAlbums.svelte`
- **@immich/ui files** (under `dist`): `components/Navbar/NavbarItem.svelte`, `components/AppShell/AppShellSidebar.svelte`, `components/Scrollable/Scrollable.svelte`
- **Assumptions checked by `anchors`:**
  - sidebar id (`lib/components/sidebar/Sidebar.svelte`)
  - admin sidebar first link is Route.users() (how the admin menu is found) (`lib/components/layouts/AdminPageLayout.svelte`)
  - users path (selector uses a[href="/admin/users"]) (`lib/route.ts`)
- **Verified:** source only (left scrollbar and unified spacing not yet confirmed in a running instance)

## map

- **What:** Rounded canvas, glass controls and markers, solid border on cluster markers, no scale / attribution
- **Why:** Match the glass style; hide attribution.
- **CSS section:** map
- **Selectors:** `.maplibregl-canvas`, `.maplibregl-ctrl-bottom-left / -right`, `.maplibregl-map .maplibregl-ctrl-group`, `.maplibregl-marker div / img`
- **Immich files** (under `web/src`): `lib/components/shared-components/map/Map.svelte`
- **Also depends on:** maplibre-gl and svelte-maplibre-gl (marker DOM is generated there)
- **Assumptions checked by `anchors`:**
  - markers still come from MarkerLayer (`lib/components/shared-components/map/Map.svelte`)
- **Verified:** unverified (marker DOM not inspected; reported as different from the source)

## scrollbars (fragile)

- **What:** Slim rounded page scrollbar, muted thumbs elsewhere
- **Why:** The default scrollbars have a hard solid track.
- **CSS section:** scrollbars
- **Selectors:** `html::-webkit-scrollbar*`, `.immich-scrollbar`
- **Immich files** (under `web/src`): `app.css`
- **Assumptions checked by `anchors`:**
  - immich-scrollbar utility still exists (`app.css`)
  - page scrollbar still styled via html::-webkit-scrollbar (`app.css`)
- **Verified:** source only
