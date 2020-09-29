import React, { useState } from "react";
import * as Tone from "tone";

export const Synth = () => {
  const [note, setNote] = useState();
  let midi, data;

  let AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = new AudioContext();

  console.log(audioCtx);

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
  };

  const onMIDIMessage = (message) => {
    data = message.data;
    // console.log("MIDI data", data);

    if (data[0] === 144) {
      setNote(data[1]);
      console.log("Current note: ", note);
    }
  };

  // Otherwise, we run the onMIDIFailure callback to show that we don't have that access.
  const onMIDIFailure = () => {
    console.log("Could not access your MIDI devices.");
  };

  const synth = new Tone.Synth().toDestination();

  const playC = () => {
    synth.triggerAttackRelease("C4", "8n");
  };

  // const playNote = (midi) => {

  // }

  const playE = () => {
    synth.triggerAttackRelease("E4", "8n");
  };

  const playA = () => {
    synth.triggerAttackRelease("A0", "4n");
  };

  const slider = () => {
    const slideSynth = new Tone.Oscillator().toDestination();
    slideSynth.frequency.value = "C4";
    slideSynth.frequency.rampTo("C2", 2);
    slideSynth.start().stop("+3");
  };

  MIDIinit();

  return (
    <div>
      <button name="play-C4" id="play-C4" onClick={playC}>
        Play C4
      </button>
      <button name="play-E4" id="play-E4" onClick={playE}>
        Play E4
      </button>
      <button name="play-A0" id="play-A0" onClick={playA}>
        Play A0
      </button>

      <button name="play-slide" id="play-slide" onClick={slider}>
        Play Slide
      </button>
    </div>
  );
};
