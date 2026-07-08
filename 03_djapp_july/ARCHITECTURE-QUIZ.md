# 🔥 DeckFlow Web Architecture Quiz

A comprehensive set of questions to test deep understanding of the DeckFlow Web application's architecture, implementation decisions, and design tradeoffs.

---

## 🎯 Architecture & Design Questions

### 1. Transport Model Deep Dive
**Question:** Your deck transport uses `position = base + accum(increment, seekGen)`. Why did you choose an audio-rate accumulator instead of controlling position from JavaScript? What would break if you tried to update position via React state at 60fps?

**Find answer in:** [`deck.ts:6-14`](src/deck.ts:6-14)  
**Key concept:** Read the comment about "control-rate JS updates would zipper the audio"  
**Hint:** What happens when you change audio parameters at 60fps vs 48kHz sample rate?

---

### 2. Stereo Channel Strategy
**Question:** You store stereo tracks as two separate mono VFS entries (`A:L` and `A:R`) instead of one stereo buffer. This seems inefficient - why is this necessary given Elementary's `el.table` limitation? What would happen if you tried to use a single stereo VFS entry?

**Find answer in:** [`deck.ts:16-17`](src/deck.ts:16-17) and [`track.ts:8-10`](src/track.ts:8-10)  
**Key limitation:** What does `el.table` read from a buffer?  
**Hint:** Check the comment about "el.table reads channel 0 only"

---

### 3. Loop Implementation
**Question:** Your loop uses a floored modulo (`x - len·floor(x/len)`) instead of `el.mod`. Why? What's wrong with `fmod` for this use case, and what audio artifacts would you hear if you used it instead?

**Find answer in:** [`SPEC.md:112-115`](SPEC.md:112-115)  
**Key concept:** "because `el.mod` is `fmod` and keeps the dividend's sign"  
**Hint:** What's the difference between `fmod(-0.1, 1.0)` and floored modulo?

---

### 4. Equal-Power Crossfade
**Question:** You use `gainA = cos(t·π/2)` and `gainB = sin(t·π/2)`. Why equal-power instead of linear crossfading? What would the user perceive differently at the center position with a linear fade?

**Find answer in:** [`App.tsx:47-50`](src/App.tsx:47-50) and [`SPEC.md:149-150`](SPEC.md:149-150)  
**Key concept:** What's "constant perceived loudness" and why does cos²+sin²=1 matter?  
**Hint:** At center position, both decks should be at ~0.707 gain

---

### 5. High-Frequency State Isolation
**Question:** Position and meter level live in refs + useState, never in the reducer. Why is this critical? What would happen to performance if you put `position` in the reducer that triggers the graph rebuild?

**Find answer in:** [`useDeck.ts:3-6`](src/useDeck.ts:3-6) and [`SPEC.md:151-153`](SPEC.md:151-153)  
**Key concept:** What happens if 30 updates/sec trigger graph re-renders?  
**Hint:** "High-frequency state stays out of the reducer"

---

### 6. Waveform Rendering Strategy
**Question:** You render peaks once to an offscreen canvas then blit slices. The comment mentions this fixed a "jank→message-backlog→crash spiral." Explain this failure mode - what was the chain of events that led to a crash?

**Find answer in:** [`Waveform.tsx:3-7`](src/components/Waveform.tsx:3-7) and [`SPEC.md:154-158`](SPEC.md:154-158)  
**Key concept:** Redrawing thousands of segments at 20Hz + audio events = ?  
**Hint:** "Cached waveform bitmap" and "50 ms renderer event-poll interval"

---

### 7. Varispeed vs Time-Stretch
**Question:** You chose varispeed (tempo and pitch linked) over real time-stretching. What DSP algorithm would you need to implement for independent pitch/tempo, and why is it "the hardest DSP" to add?

**Find answer in:** [`SPEC.md:33`](SPEC.md:33), [`SPEC.md:82-83`](SPEC.md:82-83), and [`SPEC.md:177-179`](SPEC.md:177-179)  
**Key terms:** WSOLA, signalsmith-stretch, WASM worklet  
**Hint:** "Avoids a WASM time-stretch (WSOLA / signalsmith) rabbit hole"

---

### 8. BPM Detection Approach
**Question:** Your BPM pipeline uses "energy-flux onset → autocorrelation → octave-fold into 80-160 BPM." Why autocorrelation specifically? What musical assumption does this make, and when would it fail catastrophically?

**Find answer in:** [`SPEC.md:162-166`](SPEC.md:162-166)  
**Key concept:** "peak lag = period"  
**Hint:** What musical structure does autocorrelation detect? What about non-periodic music?

---

### 9. Event Polling Rate
**Question:** You poll renderer events at 50ms intervals (20Hz). Why not faster for smoother playhead updates? What's the tradeoff you're managing here?

**Find answer in:** [`audio.ts:33-36`](src/audio.ts:33-36) and [`SPEC.md:154-158`](SPEC.md:154-158)  
**Key tradeoff:** Message rate vs main thread capacity  
**Hint:** "keeps the worklet→main message rate low enough that a busy main thread can't let the queue back up"

---

### 10. Seek Generation Counter
**Question:** `seekGen` is a monotonic counter that triggers transport resets when it changes by >0.5. Why use a counter instead of a boolean toggle? What edge case does this prevent?

**Find answer in:** [`deck.ts:11-13`](src/deck.ts:11-13)  
**Key concept:** "changes by > 0.5"  
**Hint:** What if you seek twice in rapid succession with a boolean?

---

## 🎯 Implementation Challenges

### 11. Race Condition
**Question:** The `loadGen` counter guards against stale BPM results. Walk me through the exact race condition this prevents. What would the user experience if you removed this guard?

**Find answer in:** [`SPEC.md:166-167`](SPEC.md:166-167)  
**Scenario:** Load track A → analysis starts → load track B → A's BPM arrives  
**Hint:** "Worker race-guard"

---

### 12. Graph Diffing
**Question:** You say "Elementary diffs against the previous graph, so unchanged nodes keep state." How does this work internally? What happens to a `el.lowpass` filter's internal state when you change an unrelated EQ value?

**Find answer in:** [`App.tsx:13-15`](src/App.tsx:13-15), [`deck.ts:21-22`](src/deck.ts:21-22), and [`deck.ts:123-124`](src/deck.ts:123-124)  
**Key mechanism:** Stable `key` props on const nodes  
**Hint:** "Const nodes carry stable keys so re-rendering only nudges their values"

---

### 13. AudioContext Resume
**Question:** Why must `initAudio()` be called from a user gesture? What happens if you try to create an AudioContext on page load? Is this a security feature or a performance optimization?

**Find answer in:** [`audio.ts:18-21`](src/audio.ts:18-21)  
**Browser policy:** Autoplay restrictions  
**Hint:** "Must be called from a user gesture (click/tap) — browsers refuse to start an AudioContext otherwise"

---

### 14. Normalized Position
**Question:** Everything uses normalized position (0..1) instead of frame counts. Why? What advantages does this give you, especially regarding sample rate conversions?

**Find answer in:** [`deck.ts:16-17`](src/deck.ts:16-17) and [`track.ts:65-66`](src/track.ts:65-66)  
**Key insight:** `el.table` maps [0,1] across the buffer  
**Hint:** "decodeAudioData resamples to rt.ctx.sampleRate"

---

### 15. Loop Exit Behavior
**Question:** When toggling loop off, the comment says "position will naturally continue from where it was" but you don't update `baseNorm`. How does the transport know where to continue from? Trace through the math.

**Find answer in:** [`deck.ts:136-154`](src/deck.ts:136-154) and [`useDeck.ts:77-82`](src/useDeck.ts:77-82)  
**Key insight:** Accumulator keeps integrating; position is already correct  
**Hint:** The accumulator state persists even when the loop wrapping is removed from the graph

---

## 🚀 Extension & Scaling Questions

### 16. Beat-Phase Sync
**Question:** The spec mentions SYNC matches tempo but not beat alignment. How would you implement beat-phase sync? What additional data would you need to track, and where would you inject the phase correction?

**Find answer in:** [`SPEC.md:87-88`](SPEC.md:87-88) and [`SPEC.md:175-177`](SPEC.md:175-177)  
**Hint:** BPM pipeline already computes "beat-phase from best-fitting pulse train"  
**Key question:** How do you nudge the playhead to align downbeats?

---

### 17. AIFF Support
**Question:** You mention AIFF works in Safari but fails in Chrome. If you had to implement a fallback decoder, what are the three hardest parts of parsing AIFF?

**Find answer in:** [`SPEC.md:172-175`](SPEC.md:172-175)  
**Key challenges:** 
1. FORM/COMM/SSND parsing
2. Big-endian PCM
3. 80-bit extended sample rate

---

### 18. Multi-Output Routing
**Question:** The browser gives you "one stereo bus." If you had access to a multi-channel audio interface, how would you route separate cue/headphone monitoring? What Web Audio API features would you use?

**Find answer in:** [`SPEC.md:38`](SPEC.md:38) and [`SPEC.md:76`](SPEC.md:76)  
**Web Audio API:** `AudioContext.destination` channels, routing graph  
**Hint:** "split monitoring needs multi-channel hardware"

---

### 19. Worklet Message Backpressure
**Question:** What happens if the main thread gets blocked and can't consume meter/snapshot events fast enough? Does the AudioWorklet queue grow unbounded, or is there backpressure?

**Find answer in:** [`audio.ts:33-36`](src/audio.ts:33-36) and [`Waveform.tsx:3-7`](src/components/Waveform.tsx:3-7)  
**Key insight:** Why 50ms interval was chosen  
**Hint:** "a busy main thread can't let the queue back up"

---

### 20. Memory Management
**Question:** When you load a new track, the old VFS entries (`A:L`, `A:R`) are replaced. Does Elementary automatically clean up the old buffers, or could you leak memory with repeated track loads?

**Find answer in:** [`track.ts:80-82`](src/track.ts:80-82)  
**Key question:** Does `updateVirtualFileSystem` replace or append?  
**Hint:** Look at how the VFS keys are structured with deck IDs

---

## 💡 Bonus Round: Show Me You Understand

### 21. The Key Insight
**Question:** The spec says the port was "unusually clean" because the mixer graph was already in portable JavaScript. Explain why this architectural decision in the desktop app made the browser port trivial. What would have been different if the EQ/filters were in C++?

**Find answer in:** [`SPEC.md:43-59`](SPEC.md:43-59) - "Why this port is tractable (the key insight)"  
**Architecture:** Renderer-agnostic `el.*` code  
**Key point:** "The entire mixer signal graph was already written in portable JavaScript"

---

### 22. Failure Mode: Numerical Precision
**Question:** If a user loads a 2-hour DJ mix and sets tempo to 2.0x, what happens to the `increment` value? Could this cause numerical precision issues in the accumulator over time?

**Find answer in:** [`deck.ts:130`](src/deck.ts:130)  
**Math challenge:** 
- 2 hours = 7,200 seconds
- At 48kHz = 345,600,000 samples
- At 2.0x tempo = 691,200,000 accumulations
- Float32 precision = ~7 significant digits

**Key question:** Does the accumulator drift? What's the actual precision loss?

---

## 📚 Study Guide

### Essential Files to Master
1. **[`deck.ts`](src/deck.ts)** - Core audio graph and transport model
2. **[`useDeck.ts`](src/useDeck.ts)** - State management and event handling
3. **[`audio.ts`](src/audio.ts)** - Web Audio + Elementary initialization
4. **[`track.ts`](src/track.ts)** - File loading and VFS management
5. **[`App.tsx`](src/App.tsx)** - Graph composition and crossfading
6. **[`Waveform.tsx`](src/components/Waveform.tsx)** - Performance-critical rendering
7. **[`SPEC.md`](SPEC.md)** - Complete architectural documentation

### Key Concepts to Understand
- **Audio-rate vs control-rate** signal processing
- **Elementary's graph diffing** and node keying
- **VFS (Virtual File System)** in Elementary
- **Equal-power crossfading** mathematics
- **Accumulator-based transport** model
- **Event polling** and backpressure management
- **Canvas rendering optimization** techniques
- **React state management** for high-frequency updates

### Advanced Topics
- **DSP algorithms:** WSOLA, time-stretching, autocorrelation
- **Web Audio API:** AudioContext, AudioWorklet, WASM
- **Browser constraints:** Autoplay policies, single output bus
- **Performance optimization:** Offscreen canvas, event throttling
- **Race conditions:** Async loading, worker communication

---

## 🎓 How to Use This Quiz

1. **Self-Study:** Try answering each question before looking at the hints
2. **Code Review:** Use the file references to verify your understanding
3. **Deep Dive:** Follow the hint chains to understand the full context
4. **Discussion:** Use these questions to explain the architecture to others
5. **Interview Prep:** These cover real architectural decisions and tradeoffs

**Remember:** The goal isn't just to know *what* the code does, but *why* it's designed this way and what would break if you changed it.