---
title: "Claude Desktop Buddy"
description: 'Running Claude sessions on a custom e-ink device with hardware mods, firmware integrations, and Lua apps — a portable AI companion on a $70 reader.'
publishDate: 01 May 2025
tags: [project, ai, claude, hardware, eink, firmware, embedded]
draft: false
---

# Claude Desktop Buddy

**Role**: Developer, Hardware Integrator
**Technologies**: Claude API, Lua, Custom Firmware, E-Ink Display, USB Serial
**Focus Areas**: Embedded AI, Portable Computing, Hardware Integration, Custom Firmware

## Project Overview

A project to run Claude sessions on the X4 Xteink e-ink reader — combining custom firmware, Lua apps, and hardware modifications to create a portable, always-on AI companion that lives in your pocket on a low-power e-paper display.

The goal: a device that's readable in sunlight, draws minimal power, has physical buttons, and runs Claude. Less laptop, more dedicated tool.

## What It Does

Claude sessions run natively on the device. The firmware manages state between apps — tracking whether a Claude session is active, coordinating with the charging clock and Pomodoro timer so they don't step on each other on the single e-ink screen.

The Pomodoro HUD required a specific fix: when the device was plugged in via USB-C for serial debugging, the charging clock condition (`_onUsb = true && RTC synced && no sessions`) would activate and draw over the entire lower half of the screen, silently overwriting the Pomodoro countdown before it could render. The guard `&& !pom.active` ensures the clock only takes over when no other app has the screen.

## Hardware + Apps Stack

- **X4 Xteink** — $70 e-ink reader, reflashed with custom firmware
- **Lua Pomodoro** — Focus timer with donut-ring progress, session tracking, and flash alarm
- **Charging Clock** — Full-screen clock when idle and plugged in
- **WiFi Scanner** — SSIDs displayed on e-paper via Biscuit firmware
- **Claude Sessions** — Native AI conversation on e-ink

## Why E-Ink for AI

Most AI interaction happens on backlit glass. E-ink is readable in sun, comfortable for long sessions, and has a physicality that glass doesn't. A dedicated device for Claude — with hardware buttons and a paper-like screen — changes how you interact with it. It's closer to a notebook than a phone.

## Related

This project is part of the broader [X4 Xteink firmware hacking](/projects/x4-ereader-hacking) work.
