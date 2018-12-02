import React, { useState, useEffect } from 'react'
import Notation from '../components/Notation'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

import SoundfontProvider from './SoundfontProvider';


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});


const notation = (currentKey) => (`
X:1
M:4/4
L:1/4
K:C
%%staves {Generated User}
V: Generated clef=treble name="Notes to play"
V: User      clef=treble name="Your notes"
[V: Generated]  E
[V: User]      [${currentKey}]
`);


export default function App() {
  const [currentKey, setCurrentKey] = useState('')

  useEffect(() => {
    // TODO: Ensure when a key is held down it doesn't start repeating itself.
    //       OR Stop the same not being added to the stave if it's already there.
    const handleKeyDown = e => {
      // Don't conflict with existing combinations like ctrl + t
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }
      setCurrentKey(currentKey => (currentKey + e.key.toUpperCase()))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handlekeyUp = e => {
      // This *should* also check for event.ctrlKey || event.metaKey || event.ShiftKey like onKeyDown does,
      // but at least on Mac Chrome, when mashing down many alphanumeric keystrokes at once,
      // ctrlKey is fired unexpectedly, which would cause onStopNote to NOT be fired, which causes problematic
      // lingering notes. Since it's fairly safe to call onStopNote even when not necessary,
      // the ctrl/meta/shift check is removed to fix that issue.
      setCurrentKey('')
    }
    window.addEventListener('keyup', handlekeyUp)
    return () => window.removeEventListener('keyup', handlekeyUp)
  }, [])

  const firstNote = MidiNumbers.fromNote('c3');
  const lastNote = MidiNumbers.fromNote('f5');

  const startNote = 12;
  const endNote = 12;

  return (
    <div>
      Play this note
      <Notation notation={notation(currentKey)} currentKey={currentKey}>
      </Notation>
      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote }) => (
          <Piano
            noteRange={noteRange}
            width={300}
            playNote={playNote}
            stopNote={stopNote}
            disabled={isLoading}
            keyboardShortcuts={keyboardShortcuts}
          />
        )}
      />
    </div>
  )
}
