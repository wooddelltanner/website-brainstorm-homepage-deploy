# Netlify looks-different fix — prepared 2026-10-14

## What was verified locally (no guesswork)

- `index.html` links its stylesheet with a relative path on line 13:
  `<link rel="stylesheet" href="styles.css" />`
  and loads `<script src="script.js"></script>` at the end of the body.
- `index.html`, `styles.css`, `script.js`, and `accessibility.html` all sit
  side-by-side in the same folder in this deploy copy — the exact layout that
  relative link requires.
- The Business pricing card badge in this copy reads **Recommended**
  (no "Most Popular" remains).
- This folder was served locally and checked: `/`, `/styles.css`,
  `/script.js`, and `/accessibility.html` all return correctly, and the
  homepage markup served references `styles.css`. So this copy is known-good;
  the problem is in how the GitHub repo / Netlify settings are serving the
  files, not in the code.

## Fastest test that proves it (30 seconds, no settings digging)

1. Open the Netlify site address.
2. Add `/styles.css` to the end of the address and press Enter.
   - Wall of CSS code = the stylesheet IS being served; the issue is the
     path in the page being served (go to the GitHub check below).
   - "Page Not Found" = the stylesheet is NOT at the site root; that is the
     whole visual difference. HTML without CSS loses all layout, colour,
     spacing, and sizing while keeping all the words.

## Most likely causes, in order

1. **Folder nesting in GitHub.** If the repo contains a folder (e.g.
   `homepage-draft-split/`) holding the three files, and Netlify publishes
   the repo root, then the live index page is either missing or is being
   served from a different level than `styles.css`. Fix: in Netlify,
   Site settings → Build & deploy → set **Publish directory** to the folder
   that actually contains `index.html`, OR move the files to the repo root.
2. **Filename mismatch.** Web servers are case-sensitive: the file must be
   exactly `styles.css` (not `Styles.css`, `style.css`, or `styles.css.txt`
   — the `.txt` suffix is a classic Windows upload trap).
3. **Only some files were pushed.** If GitHub shows `index.html` but not
   `styles.css` / `script.js` in the same place, re-add the missing files.

## Known-good shortcut

This `netlify-deploy` folder is a clean, flat copy. Options:
- **Drag-and-drop test:** Netlify → Sites → drag this folder onto the
  "Want to deploy a new site without connecting to Git?" area (or Deploys →
  drag the folder). If it looks right there, the code is exonerated and only
  the GitHub-connected site's publish directory / file layout needs fixing.
- Or copy `netlify.toml` (included here) into the repo root: it tells Netlify
  there is no build step and to publish the folder it sits in. It only helps
  if it sits in the same folder as `index.html`.

## Still needed from Tanner to pinpoint it exactly

The Netlify URL (or a screenshot of the GitHub repo's file list). With the
URL, `/styles.css` can be checked directly and the exact one of the three
causes above identified instead of guessed.

## Not changed

- The footer's Accessibility Statement link in `index.html` still points to
  `#top` — it gets pointed at `accessibility.html` once Tanner OKs that
  page's wording, as previously agreed. Left as-is here on purpose.
