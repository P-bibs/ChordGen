var model;
var hashedReverseDict;
var synth;
var lastPrediction;
var doStopPlayback;
var MINIMUM_CHORDAL_MEMBERS = 4;

async function initModel(){
  model = await tf.loadLayersModel('http://localhost:8081/model.json');
  hashedReverseDict = JSON.parse(Get('http://localhost:8081/hashedReverseDict.json'));
}

function generateProg(){
  //TODO: load model and data
  var data = lastPrediction || myProg;

  var prediction = model.predict(tf.tensor([data]));
  prog = shapeModelOutput(prediction);
  lastPrediction = prog
  playProg(prog);
}

function shapeModelOutput(raw){
  //turn tensor into array (blocking)
  // TODO: make async
  var arr = raw.as2D(5,12).dataSync();

  //reshape array
  var out = []
  for (i=0; i<5; i+=1) {
    out[i] = arr.slice(12*i, 12*(i+1))
  }

  out = probabilityToBinary(out);

  return out;
}

function probabilityToBinary(probArry) {
  var binary = [[], [], [], [], []];
  //convert to binary

  for (var i = 0; i<5; i+=1) {
    for (var thresh = .5; thresh > 0; thresh -= .1) {
      for (var j = 0; j<12; j+=1) {
        binary[i][j] = probArry[i][j] > thresh ? 1 : 0;
      }
      // Count number of '1's in array. If greater than min,
      // then stop increasing threshold and continue.
      if (binary[i].reduce( (a,b) => a+b ) >= MINIMUM_CHORDAL_MEMBERS){
        break;
      }
    }
  }

  return binary;
}

function playProg(prog){
  if (prog.length === 0) {
    document.getElementById("chordNotesDisplay").innerHTML = "Chord notes will be displayed here";
    document.getElementById("chordNameDisplay").innerHTML = "Chord name will be displayed here";
    return;
  }
  if (doStopPlayback){
    doStopPlayback = false;
    return;
  }

  synth = new Tone.PolySynth(5, Tone.synth).toMaster();

  var notes = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"]
  var chord = mask(notes, prog[0]);
  
  synth.triggerAttack(chord);
  document.getElementById("chordNotesDisplay").innerHTML = prog[0];
  document.getElementById("chordNameDisplay").innerHTML = hashedReverseDict[getPseudoHash(prog[0])] || "<unk>";

  setTimeout(function(){
    synth.triggerRelease(chord);
    playProg(prog.slice(1, prog.length));
  }, 1000);
}

function stopPlayback() {
  doStopPlayback = true;
  document.getElementById("chordNotesDisplay").innerHTML = "Chord notes will be displayed here";
    document.getElementById("chordNameDisplay").innerHTML = "Chord name will be displayed here";
  synth.releaseAll();
}

var myProg = [
  [1,0,0,0,0,0,0,1,0,0,0,0],
  [1,0,0,0,1,0,0,1,0,1,0,0],
  [1,0,0,0,0,0,0,1,0,1,0,0],
  [1,0,1,0,0,1,0,1,0,1,0,0],
  [0,0,1,0,0,1,0,1,0,0,0,1]
]