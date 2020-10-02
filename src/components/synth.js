import React, { useState, useEffect } from "react";
import * as Tone from "tone";

export const Synth = () => {
  const [note, setNote] = useState();
  let midi, data;

  // When you start up the page, you'll boot up the audio context.
  useEffect(() => {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = new AudioContext();
    console.log(audioCtx);
    MIDIinit();
  }, []);

  // We initialize MIDI support to determine if the user's browser can support MIDI.
  const MIDIinit = async () => {
    try {
      const midiAccess = await navigator.requestMIDIAccess();
      onMIDISuccess(midiAccess);
    } catch (err) {
      onMIDIFailure(err);
    }
  };

  // If successful, we run the onMIDISuccess callback.
  const onMIDISuccess = (midiAccess) => {
    midi = midiAccess;
    let inputs = midi.inputs.values();

    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      input.value.onmidimessage = onMIDIMessage;
    }

    let outputs = midi.outputs;
    console.log(outputs);
  };

  // Otherwise, we run the onMIDIFailure callback to show that we don't have that access.
  const onMIDIFailure = () => {
    console.log("Could not access your MIDI devices.");
  };

  // This function will sort out the MIDI data into useful parts.
  const onMIDIMessage = (message) => {
    data = message.data;
    let note = data[1];
    let velocity = data[2];
    console.log("MIDI data", data);

    playNote(note, velocity);
  };

  const synth = new Tone.Synth().toDestination();

  const playNote = (note, velocity) => {
    const requestedNote = Tone.Frequency(note, "midi").toNote();
    synth.triggerAttack(requestedNote, "+0.5", velocity);
    synth.triggerRelease("0.2");
  };

  return <div>"I'm building a synthesizer!"</div>;
};
