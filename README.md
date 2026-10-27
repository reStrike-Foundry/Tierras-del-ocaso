# Imperial Frontier Encyclopedia (starter site)

A static, in-world encyclopedia for a Pathfinder 2e campaign, built with Jekyll (the engine GitHub Pages runs natively). No backend, no database, no external services, no build tooling beyond Jekyll itself. Ordinary reading works without JavaScript; only search needs it.

## File tree

```
_config.yml            site name, baseurl, collections, default layouts
Gemfile                local testing only (GitHub Pages ignores it)
index.html             homepage (featured, recent, categories, documents)
about.md               about / editorial statement
search.md, search.json search page and generated index
archive/index.html     expedition archive landing page
categories/            index + one tiny page per category
_data/categories.yml   category list (edit here to add/rename/reorder)
_data/navigation.yml   primary navigation links
_layouts/              default, article, category, dossier, log
_includes/             header, footer, sidebar-left, toc, infobox, related,
                       status, category-cards, emblem, link
_articles/             encyclopedia articles (Markdown)
_expeditions/          expedition dossiers
_records/              individual logs and reports (listed)
_supplemental/         direct-URL-only records (never listed)
assets/css/main.css    the only stylesheet
assets/js/search.js    client-side search
```

## 1. Create the repository and enable GitHub Pages

1. Create a new public repository (for example `imperial-encyclopedia`) and upload all files, keeping the folder structure.
2. In `_config.yml` set `url: "https://YOUR-USERNAME.github.io"` and `baseurl: "/imperial-encyclopedia"` (your repository name, leading slash, no trailing slash). Use `baseurl: ""` for a user site (`username.github.io`) or a custom domain.
3. Repository **Settings > Pages**: set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, then Save.
4. After a minute the site appears at `https://YOUR-USERNAME.github.io/imperial-encyclopedia/`.

## 2. Files that control appearance

Everything visual is in `assets/css/main.css`. The `:root` block at the top holds colours, fonts, sizes, and column widths. The emblem is `_includes/emblem.html` (an inline SVG placeholder). Site name and institution are in `_config.yml`.

## 3. Add an article

Create `_articles/your-slug.md`:

```yaml
---
title: "Article Title"
category: geography          # a key from _data/categories.yml
summary: "One or two sentences shown under the title and in lists."
status: established          # established | provisional | disputed | incomplete | placeholder
updated: 2026-10-27          # optional; drives "Recently updated"
featured: true               # optional; shows on the homepage
tags: [optional, tags]
related: [other-slug, another-slug]   # slugs = file names without .md
infobox_title: "Optional"
infobox:                     # optional; any labels you like
  - { label: "Capital", value: "..." }
sources:                     # optional notes
  - "Source note."
---
Intro text.

## First section
Text.
```

Use `##` headings; the contents list is built from them. The article's URL is `/articles/your-slug/`. `status` other than `established` shows a visible notice, so provisional or disputed material is labelled in words, not only colour.

**Internal links.** Use the link include, which works at any base path and degrades to plain text if the target is not written yet:

```
{% include link.html to="six-orders" %}
{% include link.html to="six-orders" text="the orders" %}
```

For non-article pages write `[text]({{ '/archive/' | relative_url }})`. Never write `[text](/archive/)`; root-relative links break under a repository subpath.

## 4. Add a category

Add an entry to `_data/categories.yml` (`key`, `title`, `description`), then create `categories/<key>.md`, copying an existing one and changing `title`, `category_key`, and `permalink`. Articles join it with `category: <key>`. Homepage cards and sidebars update automatically.

## 5. Add an expedition dossier or log

- **Dossier:** copy `_expeditions/exp-placeholder.md`. Set a unique `expedition_id`. Fields: name, authority, period, destination, objective, outcome, casualties, `personnel` list, `provenance`.
- **Log or report:** copy `_records/log-01.md`. Set `expedition:` to the dossier's `expedition_id`; it will then be listed on that dossier automatically. Fields: `record_id`, `author`, `datetime`, `doc_type`, `status` (original, copy, transcription, annotation), `notes` (editorial/preservation notes). Set `form:` to `formal`, `field`, `personal`, or `summary` for a subtly different look. Mark redactions with `<span class="redacted">text</span>`.
- Set `featured_doc: true` to show an item under "Featured documents".

## 6. Pages reachable by direct URL only

Put the file in `_supplemental/` (copy `memo-example.md`). Everything there gets `nav: false` and `noindex: true` by default, so it is omitted from the homepage, categories, dossier record lists, related lists, and the search index. It is served at `/archive/supplemental/<name>/`. To hide any other article or record, add `nav: false` to its front matter. To link to one deliberately, write `[text]({{ '/archive/supplemental/name/' | relative_url }})`, or set `nav: true` to list it.

## 7. Test locally

```
gem install bundler
bundle install
bundle exec jekyll serve --baseurl /imperial-encyclopedia
```

Open `http://localhost:4000/imperial-encyclopedia/`. Using the same baseurl locally as in production is the best way to catch broken links.

## 8. Avoiding broken links under a subpath

All site links use the `relative_url` filter, which prepends `baseurl`. Do not hand-write root-relative URLs (`/foo/`) in templates or Markdown. Keep `baseurl` in `_config.yml` matching the repository name.

## 9. Unlinked documents are not private

GitHub Pages is public hosting. A page omitted from navigation, lists, and search is only unlisted, and anyone with the URL (or who guesses it) can read it. If the repository is public, the source files are readable too. It is not authentication or access control. Treat the effect as atmosphere, not security.

## 10. Placeholder material to replace

Everything in square brackets is a placeholder: `[ENCYCLOPEDIA NAME]`, `[INSTITUTION NAME]`, `[EMPIRE NAME]`, `[ORDER NAMES]`, `[GOD NAMES]`, `[ORGANIZATION NAME]`, all `[EXPEDITION ...]` and `[RECORD ...]` fields, the editorial statement in `about.md`, and the footer notice. The six sample articles (all `status: placeholder`) contain no setting canon beyond your brief. The emblem is a generic shield.

## Notes and limits

- **Search:** client-side, matches titles, summaries, and article text, with title matches ranked first. It runs on the Markdown source, so link-include tags may occasionally match. The search page needs JavaScript; without it, browse by category.
- **"Recently updated"** is empty until you add `updated:` dates. No dates are invented.
- Only plugins bundled with GitHub Pages are used (none beyond defaults).
