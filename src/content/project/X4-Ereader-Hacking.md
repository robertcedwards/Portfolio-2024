---
title: "X4 Xteink eReader — Firmware Hacking & Custom Apps"
description: 'Flashing and running four alternative firmwares on the X4 Xteink e-ink reader, including a WiFi scanner, Lua Pomodoro timer, and Claude session integration.'
publishDate: 01 May 2025
tags: [project, hardware, firmware, hacking, ereader, lua, eink]
draft: false
---

# X4 Xteink eReader — Firmware Hacking & Custom Apps

**Role**: Hardware Hacker, Firmware Developer, Lua Developer
**Technologies**: Custom Firmware, Lua, E-Ink Display, USB Serial, WiFi Scanning, ArduPilot-style build toolchain
**Focus Areas**: Embedded Systems, E-Ink Computing, Custom Apps, Hardware Hacking

## Project Overview

The X4 Xteink is a $70 e-ink reader — and with custom firmware it becomes something significantly more interesting. This project covers flashing four alternative firmwares, debugging display conflicts, and building original Lua apps that run natively on the device.

## The Four Firmwares

Each firmware transforms the device's personality entirely. Side-by-side, the four home screens alone tell the story — the stock interface shares almost nothing with what the custom options unlock.

Highlights include **Biscuit**, which runs a WiFi scanner on the e-ink screen — watching SSIDs populate on an e-paper display is striking in a way that's hard to convey in a screenshot. It's the kind of thing that makes people do a double-take.

## Custom Lua Apps

**Pomodoro Timer** — A full Lua app running natively on the device with three screens:

- **Menu** — A smiling tomato face. Up/Down cycles work durations (20, 25, 30, 35, or 45 min). Session count persists.
- **Work/Break** — A donut ring with 12 clock-face tick marks depletes as time passes. Work fills clockwise in black; break inverts to white-on-black so you can read the mode at a glance. A pulse dot ticks inside the ring every second.
- **Alarm** — On session end, 10 rapid screen flashes alternate full-black/full-white over ~2.5 seconds. Any button skips early.

**Charging Clock** — A full-screen clock that activates when USB power is present and no sessions are running. Required a firmware fix to prevent it from drawing over the Pomodoro HUD when the device was plugged in for serial debugging.

## Claude Integration

The device runs Claude sessions natively. The firmware tracks session state — the charging clock condition checks `_onUsb && RTC synced && no active sessions` — which required a guard (`&& !pom.active`) to prevent the clock from silently overwriting the Pomodoro countdown during USB-connected debugging.

## Links

- [SUMI firmware](https://github.com/robertcedwards/SUMI) — full custom firmware for the X4 Xteink
- [sumi.page](https://sumi.page) — companion web tools (converter, flasher, file transfer)
- [Build post](/posts/x4-ereader-firmware)
- [Lua Pomodoro post](/posts/lua-pomodoro-eink)

## Why This Project

E-ink is an underexplored computing surface. It's readable in full sunlight, draws almost no power, and has a tactile presence that screens don't. Getting Lua apps and Claude running on a $70 reader is a proof of concept for a different kind of portable computing.
