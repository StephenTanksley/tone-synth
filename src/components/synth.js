import React from "react";
import * as Tone from "tone";

export const Synth = () => {
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

    // console.log(inputs);
    // console.log(outputs);
  };

  const onMIDIMessage = (message) => {
    data = message.data;
    // console.log("MIDI data", data);
  };

  // Otherwise, we run the onMIDIFailure callback to show that we don't have that access.
  const onMIDIFailure = () => {
    console.log("Could not access your MIDI devices.");
  };

  const synth = new Tone.Synth().toDestination();

  const playC = () => {
    synth.triggerAttackRelease("C4", "8n");
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
      <button name="play-tone" id="play-tone" onClick={playC}>
        Play C4
      </button>

      <button name="play-slide" id="play-slide" onClick={slider}>
        Play Slide
      </button>
    </div>
  );
};
