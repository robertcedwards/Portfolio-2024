---
title: "Built a Lua Pomodoro timer for e-ink"
description: "A native Lua app running on the X4 Xteink with a donut-ring countdown, screen-flash alarm, and a smiling tomato menu."
publishDate: 01 May 2026
tags: [hardware, lua, eink, embedded, prototyping, pomodoro]
draft: true
---

Wrote a Pomodoro timer in Lua that runs natively on the X4 Xteink e-ink reader. Three screens: a menu with a smiling tomato face, a work/break countdown, and a flash alarm.

The countdown is a donut ring with 12 clock-face tick marks that depletes as time passes. Work mode fills clockwise in black; break mode inverts to white-on-black so you can read the mode at a glance without thinking about it. A pulse dot inside the ring ticks every second.

The alarm fires 10 rapid screen flashes — full black / full white alternating over about 2.5 seconds. Any button skips it early. On e-ink, the flash is genuinely startling. Works better than a phone notification.

Had to fix a display conflict with the charging clock: when plugged in via USB-C for serial debugging, the clock condition would activate and draw over the entire lower half of the screen, silently overwriting the Pomodoro countdown. Added a `&& !pom.active` guard. Small fix, annoying to track down.
