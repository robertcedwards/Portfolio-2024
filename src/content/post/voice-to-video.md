---
title: "From Voice to Video"
description: 'Building an ElevenLabs Conversational Agent Hackathon Project with Heygen Integration and Bolt.new'
publishDate: 17 July 2025
tags: [article, ]
draft: false
---
# AI Voice Agent on a Custom Page, Built with Bolt.new, ElevenLabs, & Heygen

---

This project was developed as part of the **ElevenLabs Online Conversational Agent Hackathon**, a competitive 2-hour sprint event celebrating over 1 million conversational AI agents created on the platform. The hackathon offered **$20,000+ in prizes** and featured incredible partners including Exa, Notion, Lovable, Bolt.new, n8n, and NFX.

The hackathon format was uniquely challenging:

1. **Register your intent** to secure your spot
2. **Build your agent** in exactly 2 hours during the live event
3. **Create a video demonstration** within 24 hours after the hackathon ends
4. **Submit and wait for results** (winners announced 1 week later)

**Important constraint:** Any modifications to your agent after the 2-hour limit would disqualify your submission.

---

## Project Overview: Voice-to-Video with Public Web Interface

The hackathon project creates a complete ecosystem that transforms spoken input into polished video content, made accessible to everyone through a public web interface.

### Core Workflow

1. **Voice Input:** Users interact with an ElevenLabs conversational agent through natural speech
2. **Content Processing:** The agent transcribes, processes, and generates appropriate scripts and titles
3. **Video Generation:** Heygen's API creates professional avatar videos with synchronized speech
4. **Public Access:** A Bolt.new web app provides a user-friendly interface for anyone to use the system

### Hackathon Advantages

This project qualified for both the **main ElevenLabs prize** and the **Bolt.new partner track** (Best Bolt.new Integration - $5,000 cash prize), demonstrating multi-platform innovation within the 2-hour constraint.

---

## Technical Implementation

### 1. ElevenLabs Voice Agent Configuration

The foundation remains the properly configured ElevenLabs conversational agent with custom tools for Heygen integration. Under tools, you'll find the Add webhook tool.

You'll see this dialog pop-up on the right side of the screen. You can click "Edit as JSON" in the lower left corner and use the JSON from down below.

```json
{
  "type": "client",
  "name": "Create_New_Heygen_Video",
  "description": "Create a new video from heygen for hackathon project",
  "parameters": [
    {
      "id": "title",
      "type": "string",
      "description": "Generate a compelling title for the video based on the conversation content",
      "required": true,
      "value_type": "llm_prompt",
      "dynamic_variable": "",
      "constant_value": ""
    },
    {
      "id": "script",
      "type": "string",
      "description": "Generate a script for the avatar to speak based on the conversation. Keep it concise and engaging.",
      "required": true,
      "value_type": "llm_prompt",
      "dynamic_variable": "",
      "constant_value": ""
    },
    {
      "id": "caption",
      "type": "boolean",
      "description": "Whether to add captions to the video",
      "required": false,
      "value_type": "constant",
      "constant_value": false,
      "dynamic_variable": ""
    },
    {
      "id": "dimension",
      "type": "string",
      "description": "Video dimensions as JSON object",
      "required": true,
      "value_type": "constant",
      "constant_value": "{\"width\": 1280, \"height\": 720}",
      "dynamic_variable": ""
    },
    {
      "id": "video_inputs",
      "type": "string",
      "description": "Hardcoded video input configuration",
      "required": true,
      "value_type": "constant",
      "constant_value": "[{\"character\": {\"type\": \"avatar\", \"avatar_id\": \"07013f5cfac045eeb95eb3cf9eb9c712\", \"scale\": 1, \"avatar_style\": \"normal\"}, \"voice\": {\"type\": \"text\", \"voice_id\": \"0214ac51f93e420f8711d568dcfbc50e\", \"input_text\": \"{{script}}\"}}]",
      "dynamic_variable": ""
    }
  ],
  "expects_response": false,
  "response_timeout_secs": 20,
  "dynamic_variables": {
    "dynamic_variable_placeholders": {}
  }
}
```

Save your Tool. Then go to Agent Settings & then "Custom tools" to add it to your specific agent.

---

### 2. Bolt.new Web Application Interface

The game-changing addition is a **public-facing web application** built with Bolt.new that makes the voice-to-video system accessible to everyone. Bolt.new is an AI-powered, browser-based platform that enables users to build, edit, and deploy full-stack web applications without local setup.

#### Key Features of the Bolt.new Interface

- **Prompt-Based Development**: Generate web applications through natural language descriptions
- **Real-Time Editing**: Modify and test code instantly within the browser
- **Integrated Deployment**: Deploy applications directly from the platform with services like Netlify
- **One-Click Publishing**: Make your app publicly accessible with a live URL

#### Sample Bolt.new Application Code

```jsx
// React component for the public interface
import React, { useState } from 'react';
import { ElevenLabsWidget } from '@elevenlabs/widget';

function VoiceToVideoApp() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoStatus, setVideoStatus] = useState('');

  const handleVoiceComplete = async (transcript) => {
    setVideoStatus('Processing your request...');
    
    // Trigger ElevenLabs agent with the transcript
    const response = await fetch('/api/create-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: transcript,
        hackathon_project: 'elevenlabs-heygen-integration'
      })
    });
    
    const result = await response.json();
    setVideoStatus(`Video created! ID: ${result.video_id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Voice to Video Generator
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Speak your idea and get a professional AI avatar video in minutes!
        </p>
        
        <ElevenLabsWidget
          agentId="your-agent-id"
          onComplete={handleVoiceComplete}
          className="w-full"
        />
        
        {videoStatus && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">{videoStatus}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Built for ElevenLabs Hackathon • Powered by Heygen
          </p>
        </div>
      </div>
    </div>
  );
}

export default VoiceToVideoApp;
```

---

### 3. Deployment and Public Access

#### Bolt.new Deployment Process

1. **Build in Browser**: Create the entire application within Bolt.new's browser-based environment
2. **One-Click Deploy**: Use Bolt.new's integrated Netlify deployment
3. **Live URL**: Receive a public URL instantly, making the app accessible to anyone
4. **Custom Domain**: Optionally configure a custom domain for professional branding

---

### 4. Custom API Integration

For the hackathon's backend processing, here's the streamlined API integration:

```js
// API endpoint for handling voice-to-video requests
app.post('/api/create-video', async (req, res) => {
  try {
    const { message, user_id } = req.body;
    
    // Process the voice input through ElevenLabs agent
    const agentResponse = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: process.env.AGENT_ID,
        message: message,
        hackathon_context: true
      })
    });
    
    // Extract generated title and script
    const { title, script } = await agentResponse.json();
    
    // Create Heygen video
    const heygenPayload = {
      caption: false,
      dimension: { width: 1280, height: 720 },
      title: title,
      video_inputs: [{
        character: {
          type: "avatar",
          avatar_id: process.env.HEYGEN_AVATAR_ID,
          scale: 1,
          avatar_style: "normal"
        },
        voice: {
          type: "text",
          voice_id: process.env.HEYGEN_VOICE_ID,
          input_text: script
        }
      }]
    };
    
    const heygenResponse = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-api-key': process.env.HEYGEN_API_KEY
      },
      body: JSON.stringify(heygenPayload)
    });
    
    const result = await heygenResponse.json();
    
    res.json({
      success: true,
      video_id: result.video_id,
      status: 'Video generation started',
      hackathon_project: 'ElevenLabs-Heygen-Bolt Integration',
      public_url: `https://your-app.netlify.app/video/${result.video_id}`
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Video generation failed', 
      details: error.message 
    });
  }
});
```

---

## Hackathon Project Advantages

### Innovation Factor

- **Triple Integration:** Seamlessly combines ElevenLabs, Heygen, and Bolt.new
- **Public Accessibility:** Makes advanced AI tools available to non-technical users
- **Voice-First Interface:** Eliminates traditional form-based content creation
- **Rapid Deployment:** Built and deployed within the 2-hour hackathon constraint

### Technical Excellence

- **Real-time Processing:** Voice input to video output in minutes
- **Cross-Platform Integration:** APIs working together seamlessly
- **Production-Ready:** Uses enterprise-grade services with proper error handling
- **Scalable Architecture:** Can handle multiple concurrent users

### Business Impact

- **Content Creation:** Democratizes professional video production
- **Accessibility:** Makes video creation available to users with disabilities
- **Marketing Automation:** Enables rapid content generation for businesses
- **Education:** Provides tools for creating instructional content

---

## Key Metrics for Judges

- **Speed:** Complete workflow in under 3 minutes
- **Accessibility:** Zero technical knowledge required
- **Quality:** Professional-grade output suitable for business use
- **Public Impact:** Anyone can use the system via the web interface

---

## Updated Hackathon FAQ

**Q: How does this project qualify for both main and partner prizes?**  
A: The project prominently features ElevenLabs' conversational AI (main prize) while creating a significant Bolt.new integration (partner track - $5,000 cash prize).

**Q: What makes the Bolt.new integration special?**  
A: Rather than just using Bolt.new as a development tool, the project creates a public-facing interface that makes the entire voice-to-video system accessible to non-technical users.

**Q: How did you build and deploy within the 2-hour constraint?**  
A: Bolt.new's AI-powered development and one-click deployment made it possible to create and publish a complete web application within the hackathon timeframe.

**Q: What's the public impact beyond the hackathon?**  
A: The web interface democratizes professional video creation, making it accessible to small businesses, educators, and content creators who lack technical skills or expensive software.

**Q: How can users access the application?**  
A: The Bolt.new deployment provides a live URL that anyone can visit to use the voice-to-video system without any setup or technical knowledge.

---

## Takeaways: A Complete Voice-to-Video Ecosystem

This hackathon project represents more than just a technical integration—it's a complete ecosystem that transforms how people create video content. By combining ElevenLabs' conversational AI, Heygen's video generation, and Bolt.new's public deployment capabilities, the project creates a bridge between advanced AI technology and everyday users.

The **2-hour hackathon constraint** actually enhanced the project's focus, forcing the creation of a streamlined, user-friendly system that anyone can use. The **public web interface** built with Bolt.new ensures that the innovation doesn't remain locked in a developer's environment but becomes accessible to the broader community.

For the **ElevenLabs Conversational Agent Hackathon**, this project exemplifies the platform's potential to democratize AI technology. It shows how conversational AI can serve as the interface for complex workflows, making powerful tools accessible through natural voice interaction.

The project's **dual qualification** for both the main ElevenLabs prize and the Bolt.new partner track ($5,000 cash prize) demonstrates the value of thoughtful integration over simple feature stacking. By creating a public-facing application that anyone can use, the project extends the impact of the hackathon beyond the development community to potential users worldwide.

Whether you're a content creator, educator, marketer, or simply someone with an idea to share, this voice-to-video system represents a glimpse into a future where creating professional content is as simple as speaking your thoughts—and thanks to the public web interface, that future is available to try right now.

---

### References

1. [ElevenLabs Online Conversational Agent Hackathon](https://elevenlabs.io/blog/online-conversational-agent-hackathon)
2. [Event page](https://lu.ma/emalmi7z)
3. [Siteefy: Bolt.new AI Tools](https://siteefy.com/ai-tools/bolt-new/)
4. [Refine.dev: Bolt.new AI](https://refine.dev/blog/bolt-new-ai/)
5. [YouTube Demo](https://www.youtube.com/watch?v=B5p3d0uu5q4)