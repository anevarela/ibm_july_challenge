# 🚀 IBM July Challenge - Hands-On Labs

This repository contains hands-on lab projects completed as part of the IBM SkillsBuild AI Builders Challenge (July 2026).

## 📚 Projects

### 03_djapp_july - DeckFlow Web DJ Mixer

A professional browser-based two-deck DJ mixer application demonstrating advanced web audio architecture and real-time DSP.

**[View Project →](03_djapp_july/)**

#### Key Features
- 🎵 Dual-deck audio playback with independent controls
- 🎛️ Professional mixer: 3-band EQ, DJ filter, crossfader, volume control
- 📊 Real-time waveform visualization with zoom
- 🔄 Varispeed tempo control (0.5x - 2.0x)
- 🔁 Manual loop functionality with visual markers
- 📍 In-mix cue points for instant position recall

#### Tech Stack
- React 18 + TypeScript
- Elementary Audio (declarative DSP)
- Vite build system
- HTML5 Canvas API

#### Architecture Highlights
- Audio-rate accumulator transport for glitch-free playback
- Equal-power crossfading for constant perceived loudness
- Cached canvas rendering for optimal performance
- High-frequency state isolation pattern

#### Learning Resources
- **[SPEC.md](03_djapp_july/SPEC.md)** - Complete architectural specification
- **[implementation-plan.md](03_djapp_july/implementation-plan.md)** - Phase 4 implementation guide
- **[ARCHITECTURE-QUIZ.md](03_djapp_july/ARCHITECTURE-QUIZ.md)** - 22 deep-dive architecture questions
- **[conversation-log.json](03_djapp_july/conversation-log.json)** - Development session transcript

## 🎯 Challenge Goals

This hands-on lab series demonstrates:
- Modern web application architecture
- Real-time audio processing in the browser
- Performance optimization techniques
- Professional state management patterns
- Comprehensive technical documentation

## 🛠️ Getting Started

Each project includes its own README with specific setup instructions. Generally:

```bash
cd 03_djapp_july
npm install
npm run dev
```

## 👥 Team

Built by the IBM July Challenge team, showcasing:
- Advanced React patterns
- Web Audio API expertise
- DSP implementation
- Performance optimization
- Technical documentation

## 📄 Documentation Philosophy

Each project includes:
- **Specification documents** explaining architectural decisions
- **Implementation plans** with step-by-step guides
- **Architecture quizzes** testing deep understanding
- **Conversation logs** showing the development process

## 🙏 Acknowledgments

- **IBM SkillsBuild** for the challenge framework
- **Elementary Audio** for the declarative DSP library
- **Open source community** for the tools and libraries

---

**Explore the projects** to see professional web development patterns in action! 🎵
