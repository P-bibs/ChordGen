var model;
var hashedReverseDict;

var synth;

var currentProg = [];
var seed = []
var currentChordIndex;
var playbackTimer;

var settings = {
  chordsPerProg: 5,
  minimumChordalMembers: 3,
  noteDuration: 2,
  loopPlayback: false
}

async function init(){
  model = await tf.loadLayersModel('http://localhost:8081/model.json');
  hashedReverseDict = JSON.parse(Get('http://localhost:8081/hashedReverseDict.json'));
  seed = generateRandomProg(5, settings.minimumChordalMembers);
  generateProg();
}

function generateProg(){
  stopPlayback();

  newProg = [];

  while (newProg.length < settings.chordsPerProg) {
    seed = generateRandomProg(5, settings.minimumChordalMembers);
    data = seed.concat(newProg).slice(-5);      
    var prediction = model.predict(tf.tensor([data]));    
    shapeModelOutput(prediction).forEach(function(a){
      newProg.push(a);
    });
  }
  if (newProg.length !== settings.chordsPerProg) {
    newProg = newProg.slice(0, settings.chordsPerProg);
  }
  currentProg = newProg;
  currentChordIndex = 0;
}

function shapeModelOutput(raw){
  // turn tensor into array (blocking)
  // TODO: make async
  var arr = raw.as1D().dataSync();

  //reshape array
  out = reshape(arr, 5, 12);

  out = probabilityToBinary(out);

  return out;
}

function probabilityToBinary(probArry) {
  var binary = [];
  for (var i = 0; i < 5; i+=1) {
    binary[i] = [];
  }

  //convert to binary
  for (var i = 0; i<5; i+=1) {
    for (var thresh = .5; thresh > 0; thresh -= .1) {
      for (var j = 0; j<12; j+=1) {
        binary[i][j] = probArry[i][j] > thresh ? 1 : 0;
      }
      // Count number of '1's in array. If greater than min,
      // then stop increasing threshold and continue.
      if (binary[i].reduce( (a,b) => a+b ) >= settings.minimumChordalMembers){
        break;
      }
    }
  }

  return binary;
}

function playProg(){
  stopPlayback();

  voiceCount = 0;
  for (var i = 0; i < currentProg.length; i+=1) {
    if (currentProg[i].reduce((a,b) => a+b) > voiceCount) {
      voiceCount = currentProg[i].reduce((a,b) => a+b);
    }
  }
  synth = new Tone.PolySynth(voiceCount, Tone.synth).toMaster();

  playCurrentChord();

  playbackTimer = setInterval(function(){
    currentChordIndex += 1;
    synth.releaseAll();
    playCurrentChord();
    
  }, settings.noteDuration * 1000)
}

function playCurrentChord() {
  if (currentChordIndex + 1 > settings.chordsPerProg) {
    stopPlayback();
    if (settings.loopPlayback) {
      playProg();
    }
    return;
  }

  var notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
  var chord = mask(notes, currentProg[currentChordIndex]);

  console.log("attack triggered: " + chord + " " + currentChordIndex);
  synth.triggerAttack(chord.map(a => a + "4"));

  document.getElementById("chordMembers0").innerHTML = chord.map(a => a+"<br>").toString().replace(/,/g, "");
  document.getElementById("chordName0").innerHTML = hashedReverseDict[getPseudoHash(currentProg[currentChordIndex])] || "<unk>";
  
  if (currentChordIndex + 1 !== settings.chordsPerProg) {
    var nextChord = mask(notes, currentProg[currentChordIndex + 1]) || "<end>";
    document.getElementById("chordMembers1").innerHTML = nextChord.map(a => a+"<br>").toString().replace(/,/g, "");
    document.getElementById("chordName1").innerHTML = hashedReverseDict[getPseudoHash(currentProg[currentChordIndex+1])] || "<unk>";
  }
  else {
    document.getElementById("chordMembers1").innerHTML = ""
    document.getElementById("chordName1").innerHTML = ""
  }
}

function stopPlayback() {
  if (synth){
    clearInterval(playbackTimer);

    currentChordIndex = 0;

    document.getElementById("chordMembers0").innerHTML = "Chord members 1 here";
    document.getElementById("chordMembers1").innerHTML = "Chord members 2 here";
    document.getElementById("chordName0").innerHTML = "Chord name 1 will be displayed here";
    document.getElementById("chordName1").innerHTML = "Chord name 2 will be displayed here";
    synth.releaseAll();
    //synth.dispose();
  }
}

function saveConfig() {
  settings.chordsPerProg = document.getElementById("chordsPerProg").value;
  settings.minimumChordalMembers= document.getElementById("minimumChordalMembers").value;
  settings.noteDuration = document.getElementById("noteDuration").value;
  settings.key = document.getElementById("keySelect").value;
  settings.loopPlayback = document.getElementById("noteDuration").value === "on" ? true : false;
}