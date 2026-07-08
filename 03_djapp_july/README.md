# 🎧 DeckFlow Web - DJ Mixer Application

A browser-based two-deck DJ mixer built with React, TypeScript, and Elementary Audio. This project demonstrates professional audio graph architecture, real-time DSP, and modern web audio techniques.

## 🎯 Project Overview

DeckFlow Web is a teaching-focused implementation of a dual-deck DJ mixer that runs entirely in the browser. It showcases:

- **Dual-deck audio playback** with independent transport controls
- **Real-time audio processing** using Elementary Audio's declarative DSP
- **Professional mixer features**: 3-band EQ, DJ filter, crossfader, volume control
- **Visual feedback**: Waveform display with playhead tracking and zoom
- **DJ workflow features**: Varispeed tempo control, manual loops, cue points
- **Performance optimization**: Cached canvas rendering, audio-rate transport

## ✨ Features Implemented

### Phase 3: Two-Deck Mixer (Completed)
- ✅ Dual independent decks with play/pause/seek
- ✅ Per-deck signal chain: 3-band EQ + DJ LPF/HPF filter + volume + level meter
- ✅ Equal-power crossfader for smooth transitions
- ✅ Master volume control
- ✅ Canvas waveform visualization with zoom
- ✅ Click-to-seek functionality

### Phase 4: DJ Features (Completed)
- ✅ **Varispeed tempo control** (0.5x - 2.0x range)
- ✅ **Manual loop functionality** with seamless wraparound
- ✅ **In-mix cue points** for instant position recall
- ✅ **Visual markers** on waveform (cue point, loop in/out)

## 🏗️ Architecture Highlights

### Audio Graph Design
- **Accumulator-based transport**: Audio-rate position tracking prevents zipper noise
- **Stereo handling**: Dual mono VFS entries for Elementary's `el.table` limitation
- **Loop implementation**: Floored modulo wrapping for seamless loop playback
- **Equal-power crossfade**: Constant perceived loudness using cos/sin curves

### Performance Optimizations
- **Cached waveform rendering**: Offscreen canvas bitmap prevents redraw overhead
- **High-frequency state isolation**: Position/meter updates in refs, not reducer
- **Event polling**: 50ms interval prevents message queue backpressure
- **Graph diffing**: Elementary's stable keys minimize unnecessary rebuilds

### Key Technical Decisions
- **Varispeed only**: Tempo and pitch linked (no time-stretching) for simplicity
- **Browser-native decode**: `AudioContext.decodeAudioData()` for WAV/MP3/FLAC
- **Single stereo output**: No split cue/headphone monitoring
- **In-memory session**: No persistence layer

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation & Running
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open the provided URL and click **"Load track"** to begin (audio requires user gesture).

### Supported Audio Formats
- WAV (uncompressed PCM)
- MP3
- FLAC
- AIFF (Safari only)

## 📁 Project Structure

```
src/
├── audio.ts              # AudioContext + WebRenderer initialization
├── track.ts              # File decode → VFS + peaks generation
├── deck.ts               # DeckState + buildDeckSignal (transport, EQ, loop)
├── useDeck.ts            # Per-deck hook: reducer, transport, events
├── App.tsx               # Two-deck composition + crossfader + master
└── components/
    ├── Waveform.tsx      # Cached canvas: peaks + markers + playhead
    ├── DeckPanel.tsx     # Deck UI: load, waveform, transport, cue/loop
    ├── DeckControls.tsx  # Mixer strip: EQ + filter + tempo + volume
    ├── Knob.tsx          # Rotary control component
    ├── Fader.tsx         # Linear slider component
    └── Mixer.tsx         # Crossfader + master volume
```

## 🎓 Learning Resources

This project includes comprehensive documentation:

- **[`SPEC.md`](SPEC.md)** - Complete architectural specification and design rationale
- **[`implementation-plan.md`](implementation-plan.md)** - Phase 4 implementation guide
- **[`ARCHITECTURE-QUIZ.md`](ARCHITECTURE-QUIZ.md)** - 22 deep-dive questions testing understanding
- **[`conversation-log.json`](conversation-log.json)** - Development session transcript

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript (strict mode)
- **Build**: Vite
- **Audio**: Elementary Audio (`@elemaudio/core` + `@elemaudio/web-renderer`)
- **Canvas**: Native HTML5 Canvas API
- **State**: React hooks + useReducer pattern

## 🎯 Design Philosophy

This project prioritizes **clarity and teachability** over production fidelity:

- **Readable end-to-end**: Clone, install, understand in an afternoon
- **No black boxes**: All DSP logic visible in Elementary nodes
- **Incremental complexity**: Each phase builds on the previous
- **Real-world patterns**: Professional audio architecture scaled down

## 🔧 Known Limitations

- **Varispeed only**: No independent tempo/pitch control (would require WASM time-stretch)
- **No beat-phase sync**: SYNC matches tempo only, not beat alignment
- **Single output**: No split cue/headphone monitoring
- **No persistence**: Session data lost on reload
- **Manual BPM**: No automatic beat detection (planned for Phase 5)

## 🚀 Future Enhancements (Phase 5+)

- BPM detection in Web Worker
- Beat-grid overlay on waveform
- Tempo-match SYNC button
- Tap-tempo functionality
- Session library with drag-to-deck
- Beat-quantized loop points

## 👥 Development Team

Built as part of the IBM July Challenge hands-on lab series, demonstrating:
- Modern web audio architecture
- React state management patterns
- Performance optimization techniques
- Professional DSP implementation

## 📄 License

This project is part of the IBM SkillsBuild AI Builders Challenge educational materials.

## 🙏 Acknowledgments

- **Elementary Audio** for the declarative DSP framework
- **IBM SkillsBuild** for the challenge structure
- Original **DeckFlow** desktop app architecture (Electron + C++ + Elementary)

---

**Ready to mix?** Load two tracks, adjust the EQ, set some loops, and blend them with the crossfader. This is a fully functional DJ mixer running entirely in your browser! 🎵
