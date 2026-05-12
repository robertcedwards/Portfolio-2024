---
title: "Running Claude on a $70 e-ink reader"
description: "Claude sessions running natively on the X4 Xteink — what it's like to use AI on e-paper with hardware buttons and a screen readable in full sunlight."
publishDate: 01 May 2026
tags: [ai, claude, hardware, eink, embedded, prototyping]
draft: true
---

Got Claude sessions running natively on the X4 Xteink e-ink reader. Hardware buttons, e-paper display, readable in full sunlight, fits in a pocket.

Most AI interaction happens on backlit glass. E-ink changes the feel of it — there's a physicality that glass doesn't have. It's closer to a notebook than a phone. You slow down slightly, which turns out to be a feature.

The firmware tracks session state across apps. The main thing I had to solve: when the device is plugged in via USB-C and no sessions are running, the charging clock activates and takes over the lower half of the screen. Added a session-aware guard so the clock only draws when nothing else needs the display.

This is what a dedicated Claude device could look like. Not a phone app, not a laptop tab — a small, single-purpose thing you carry for thinking.
