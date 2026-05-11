---
title: "What It's Like to Be a Bat"
description: 'An interactive HTML essay pairing Nagel's philosophy of consciousness with Michael Pollan's "A World Appears" — rendered through ASCII bat art, sonar oscilloscopes, and echolocation UI.'
publishDate: 01 May 2025
tags: [project, interactive, essay, philosophy, design, html]
ogImage: '/projects/bat-essay.png'
draft: false
---

# What It's Like to Be a Bat

**Role**: Designer, Developer, Writer
**Technologies**: HTML, CSS, JavaScript, Canvas API, Variable Typography
**Focus Areas**: Interactive Essays, Philosophy, Creative Coding, Generative UI

## Project Overview

An interactive HTML essay built around Thomas Nagel's 1974 philosophy paper *"What Is It Like to Be a Bat?"* — the foundational argument that subjective experience can never be fully captured from the outside — paired with Michael Pollan's album *A World Appears* and its exploration of consciousness and perception.

The piece doesn't just discuss echolocation. It tries to *perform* the inaccessibility of another creature's inner life through every visual element on the page.

## What's in the Experience

**ASCII bat hero** — A bat silhouette rendered in density-mapped characters using `canvas.measureText()`. Each glyph is measured for its actual pixel width before placement, so the character spacing accounts for proportional fonts rather than an assumed monospace grid. The wings breathe on a sine wave.

**Click-anywhere sonar ping** — Click anywhere on the dark hero and a ring emanates from your cursor, exactly like echolocation. Three ambient rings pulse continuously in the background.

**Multi-harmonic oscilloscope** — A waveform combining four frequency components (3.1×, 5.7×, 11.3×, 0.9×) approximating real bat sonar harmonics, with a phosphor-trail afterglow and scan grid.

**Split objective/subjective panel** — Hover and the left column (cold taxonomy data) fades while the right column (Nagel's unanswerable question) stays vivid — *enacting* the essay's argument rather than just stating it.

**Sonar text reveal** — The central Nagel quote materialises character by character with an amber trailing glow when it scrolls into view, like sonar returning information one echo at a time.

**Variable typography** — Pull quotes use `clamp()` fluid sizing. The title cascades small-to-large on the word "LIKE" — placing the semantic weight where echolocation would place it.

## Sources

- Thomas Nagel — *What Is It Like to Be a Bat?* (1974)
- Michael Pollan — *A World Appears* ([Penguin Random House](https://www.penguinrandomhouse.com/books/646644/a-world-appears-by-michael-pollan/))
- [Album visualizer by Finn Streuper / Onnoquist](https://www.youtube.com/watch?v=BuqKwlKF2y8)
