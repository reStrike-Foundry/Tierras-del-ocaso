---
layout: default
title: Search
permalink: /search/
---
<div class="wrap narrow">
  <h1 class="page-title">Search</h1>
  <form class="big-search" role="search" id="search-form" action="{{ '/search/' | relative_url }}" method="get" data-index="{{ '/search.json' | relative_url }}">
    <label for="search-q">Search article titles and text</label>
    <div class="row"><input id="search-q" type="search" name="q" autocomplete="off"><button type="submit">Search</button></div>
  </form>
  <p id="search-status" class="muted" role="status" aria-live="polite"></p>
  <ol id="search-results" class="plain results"></ol>
  <noscript><p class="notice">Search needs JavaScript. You can still browse by <a href="{{ '/categories/' | relative_url }}">category</a>.</p></noscript>
</div>
<script src="{{ '/assets/js/search.js' | relative_url }}" defer></script>
