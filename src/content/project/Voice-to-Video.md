---
title: "Voice to Video"
description: 'ElevenLabs hackathon build combining conversational AI, Heygen avatar video generation, and a public Bolt.new web app — built in 2 hours.'
publishDate: 17 July 2025
tags: [project, ai, elevenlabs, hackathon, bolt]
draft: false
---

# Voice to Video

**Role**: Developer, Hackathon Participant
**Technologies**: ElevenLabs Conversational AI, Heygen API, Bolt.new, Netlify
**Focus Areas**: Voice AI, Video Generation, Rapid Prototyping, Public Web Interface

## Project Overview

Built during the **ElevenLabs Online Conversational Agent Hackathon** — a 2-hour competitive sprint celebrating 1 million+ conversational AI agents on the platform, with $20,000+ in prizes. The project creates a complete ecosystem that transforms spoken input into polished avatar video content, accessible to anyone through a public web interface.

The core workflow: speak to an ElevenLabs conversational agent → agent generates a script and title → Heygen creates a professional avatar video → anyone can use it via a Bolt.new web app.

## Why It Stands Out

- **Dual prize qualification**: entered both the main ElevenLabs prize and the Bolt.new partner track ($5,000 cash)
- **Public-first**: rather than a developer demo, the Bolt.new interface makes the tool usable by non-technical users
- **Built and shipped in 2 hours**: from idea to live Netlify URL within the hackathon window

## Technical Stack

- **ElevenLabs** — conversational agent with custom webhook tool that triggers Heygen on voice input
- **Heygen** — avatar video generation API, producing 1280×720 video from script + avatar config
- **Bolt.new** — browser-based full-stack app builder used to create and deploy the public interface
- **Netlify** — one-click deployment from Bolt.new

## Links

- [Full writeup & implementation details](/posts/voice-to-video)
- [ElevenLabs Hackathon](https://elevenlabs.io/blog/online-conversational-agent-hackathon)
