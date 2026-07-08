// DeckPanel — everything for one deck: load button, track name, waveform, the mixer
// strip (DeckControls), and transport. Driven by a UseDeck, so deck A and deck B are
// the same component with different state.

import { useRef, useState } from 'react';
import type { UseDeck } from '../useDeck';
import Waveform from './Waveform';

interface Props {
  deck: UseDeck;
  label: string;
  ensureAudio: () => Promise<void>; // boots the AudioContext on first user gesture
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function DeckPanel({ deck, label, ensureAudio }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      await ensureAudio();
      await deck.load(file);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const { track } = deck.state;

  return (
    <section className="deck">
      <header className="deck-head">
        <span className="deck-label">{label}</span>
        <button className="btn ghost" onClick={() => fileInputRef.current?.click()} disabled={loading}>
          {loading ? 'Loading…' : 'Load track'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.wav,.mp3,.flac,.aiff,.aif"
          onChange={onPickFile}
          hidden
        />
      </header>

      <div className="track-name">{track ? track.name : 'No track loaded'}</div>

      <div className="waveform-wrap">
        <Waveform
          peaks={track?.peaks ?? null}
          position={deck.position}
          onSeek={deck.seek}
          cuePoint={deck.state.cuePointNorm}
          loopIn={deck.state.loopInNorm}
          loopOut={deck.state.loopOutNorm}
          loopEnabled={deck.state.loopEnabled}
        />
      </div>

      <div className="transport">
        <button
          className={`btn ${deck.state.playing ? 'stop' : 'start'}`}
          onClick={deck.togglePlay}
          disabled={!track}
        >
          {deck.state.playing ? '◼ Pause' : '▶ Play'}
        </button>
        <span className="time">
          {track ? `${fmt(deck.position * track.duration)} / ${fmt(track.duration)}` : '0:00 / 0:00'}
        </span>
      </div>

      <div className="tempo-control">
        <label htmlFor={`${label}-tempo`}>
          Tempo: <strong>{deck.state.tempo.toFixed(2)}x</strong>
        </label>
        <input
          id={`${label}-tempo`}
          type="range"
          min="0.5"
          max="2.0"
          step="0.01"
          value={deck.state.tempo}
          onChange={(e) => deck.setTempo(parseFloat(e.target.value))}
          disabled={!track}
        />
      </div>

      <div className="cue-controls">
        <button
          className="btn"
          onClick={deck.setCue}
          disabled={!track}
          title="Set cue point at current position"
        >
          Set Cue
        </button>
        <button
          className={`btn ${deck.state.cuePointNorm !== null ? 'cue-set' : ''}`}
          onClick={deck.goToCue}
          disabled={!track || deck.state.cuePointNorm === null}
          title="Jump to cue point"
        >
          {deck.state.cuePointNorm !== null ? '⚠ Cue' : 'Cue'}
        </button>
        <button
          className="btn ghost"
          onClick={deck.clearCue}
          disabled={!track || deck.state.cuePointNorm === null}
          title="Clear cue point"
        >
          Clear Cue
        </button>
      </div>

      <div className="loop-controls">
        <button
          className="btn"
          onClick={deck.setLoopIn}
          disabled={!track}
          title="Set loop in point at current position"
        >
          Set In
        </button>
        <button
          className="btn"
          onClick={deck.setLoopOut}
          disabled={!track}
          title="Set loop out point at current position"
        >
          Set Out
        </button>
        <button
          className={`btn ${deck.state.loopEnabled ? 'loop-active' : ''}`}
          onClick={deck.toggleLoop}
          disabled={!track || deck.state.loopInNorm >= deck.state.loopOutNorm}
          title="Toggle loop on/off"
        >
          {deck.state.loopEnabled ? '🔁 Loop ON' : 'Loop'}
        </button>
        <button
          className="btn ghost"
          onClick={deck.clearLoop}
          disabled={!track}
          title="Clear loop points"
        >
          Clear Loop
        </button>
        {track && deck.state.loopInNorm < deck.state.loopOutNorm && (
          <span className="loop-range">
            Loop: {fmt(deck.state.loopInNorm * track.duration)} → {fmt(deck.state.loopOutNorm * track.duration)}
          </span>
        )}
      </div>

      {error && <p className="error">{error}</p>}
    </section>
  );
}
