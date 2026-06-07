---
title: "Built an interactive essay on what it's like to be a bat"
description: "A single-file HTML essay performing Nagel's philosophy of consciousness through ASCII bat art, sonar oscilloscopes, and echolocation UI."
publishDate: 30 Apr 2026
tags: [interactive, essay, philosophy, html, prototyping, design]
draft: false
---

Built an interactive HTML essay today around Thomas Nagel's 1974 paper *What Is It Like to Be a Bat?* — the argument that subjective experience can never be fully captured from the outside. The piece doesn't just discuss echolocation. It tries to perform the inaccessibility of another creature's inner life through every visual element on the page.

The hero is an ASCII bat rendered in density-mapped characters using `canvas.measureText()` — each glyph is measured for its actual pixel width before placement so the spacing works with proportional fonts, not assumed monospace. The wings breathe on a sine wave.

Click anywhere and a sonar ring emanates from your cursor. A multi-harmonic oscilloscope runs in the background combining four frequency components to approximate real bat sonar harmonics, with a phosphor-trail afterglow. Hover the split panel and the cold taxonomy data fades while Nagel's unanswerable question stays vivid — enacting the essay's argument rather than stating it.

The Nagel quote appears character by character like sonar returning one echo at a time.

Paired with Michael Pollan's album *A World Appears*, which I've been listening to on repeat.

---

[Open the essay](https://verdant-biscuit-8235f9.netlify.app) · [Full project write-up](/projects/what-its-like-to-be-a-bat)
