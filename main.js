var model;
var hashedReverseDict;

var synth;

var currentProg = [];
var currentProgMembers = [];
var currentProgNames = [];
var seed = [];
var currentChordIndex = 0;
var playbackTimer;

var settings = {
  instrument: Tone.Synth,
  instrumentType: "sampler",
  octave: 4,
  chordsPerProg: 5,
  minimumChordalMembers: 3,
  noteDuration: 2,
  loopPlayback: true,
  onlyNamedChords: true
}

async function init() {
  try {
    model = await tf.loadLayersModel('http://134.209.209.28:80/model.json');
  } catch (err) {
    model = await tf.loadLayersModel('http://localhost:8081/model.json');
  }

  try {
    hashedReverseDict = JSON.parse(Get('http://134.209.209.28:80/hashedReverseDict.json'));
  } catch (err) {
    hashedReverseDict = JSON.parse(Get('http://localhost:8081/hashedReverseDict.json'));
  }

  seed = generateRandomProg(5, settings.minimumChordalMembers);
  addConfigEventListeners();
  changeInstrument(0);
  changeOctave(4);
  generateProg();
}

function addConfigEventListeners() {
  document.getElementById("chordsPerProg").addEventListener("input", function (a) {
    settings.chordsPerProg = this.value
  });

  document.getElementById("minimumChordalMembers").addEventListener("input", function (a) {
    settings.minimumChordalMembers = this.value
  });
  document.getElementById("noteDuration").addEventListener("input", function (a) {
    settings.noteDuration = this.value
  });
  document.getElementById("progInputBtn").addEventListener("click", function (a) {
    chords = this.value.split(" ");
    chords = document.getElementById("progInput").value.split(" ");
    currentProg = []
    chords.forEach(function (a) {
      currentProg.push(PyChordParser.parseChord(a).getNoteArray());
    });

    settings.chordsPerProg = currentProg.length
    stopPlayback();
    currentChordIndex = 0;
    determineChordalMembersAndNames();
    writeProgToHtml();
  });
  document.getElementById("progSaveBtn").addEventListener("click", function (a) {
    var inputForSaving = document.getElementById("progInput");
    inputForSaving.focus();
    inputForSaving.select();

    document.execCommand('copy');

    showSnackbar("Copied to Clipboard", 3)
  });
  // document.getElementById("keySelect").addEventListener("input", function(a){
  //   settings.key = this.value
  // });
  document.getElementById("loopPlayback").addEventListener("change", function (a) {
    settings.loopPlayback = document.getElementById("loopPlayback").checked;
  });
  document.getElementById("onlyNamedChords").addEventListener("change", function (a) {
    settings.onlyNamedChords = !(document.getElementById("onlyNamedChords").checked);
  });
  window.addEventListener("keypress", function(e){
    var keyCode = e.which;
    if (keyCode === 32) {
      if (playbackTimer) {
        console.log("stopping")
        stopPlayback()
      }
      else {
        console.log("playing")
        playProg(0);
      }
      e.preventDefault();
    }
  })
  window.addEventListener("keyup", function(e){
    var keyCode = e.which;
    if (keyCode === 32) {
      e.preventDefault();
    }
  })
}

function changeInstrument(num) {
  if (playbackTimer !== undefined) {
    stopPlayback();
  }

  var samples = [
    "cello",
    "guitar-acoustic",
    "organ",
    "harp",
    "guitar-electric",
    "xylophone",
    "bassoon",
    "flute",
    "harmonium",
    "contrabass",
    "clarinet",
    "piano",
    "saxophone",
    "trombone",
    "trumpet",
    "tuba",
    "violin",
    "french-horn",
    "bass-electric"
  ];

  var synths = [
    Tone.Synth,
    Tone.AMSynth,
    Tone.DuoSynth,
    Tone.FMSynth,
    Tone.MonoSynth,
  ];


  var instruments = samples.concat(synths);

  var buttons = document.getElementsByClassName('instrument-button');
  var newButton = buttons[num].children[0];
  var oldButton = buttons[instruments.indexOf(settings.instrument)].children[0];
  oldButton.classList.remove("instrument-button-active")
  oldButton.classList.add("instrument-button-inactive")
  newButton.classList.remove("instrument-button-inactive")
  newButton.classList.add("instrument-button-active")

  settings.instrument = instruments[num];
  if (num < 19) {
    settings.instrumentType = "sampler";
  } else {
    settings.instrumentType = "monophonic";
  }

  if (settings.instrumentType === "monophonic") {
    synth = new Tone.PolySynth(7, settings.instrument).toMaster();
    console.log("Monophonic synth made")
    console.log(settings.instrument);
  } else if (settings.instrumentType === "sampler") {
    synth = SampleLibrary.load({
      instruments: settings.instrument,
      baseUrl: "/tonejs-instruments/samples/"
    });
    console.log("Polyphonic synth made")
    console.log(settings.instrument);
  } else if (settings.instrumentType === "polyphonic") {
    synth = new settings.instrument().toMaster();
    console.log("Sampler synth made")
    console.log(settings.instrument);
  } else {
    console.log("ERROR: can't recognize instrument type")
  }


  // show keyboard on load //
  Tone.Buffer.on('load', function () {
    console.log("loading samples done")
    synth.toMaster();
  });

  // show error message on loading error
  Tone.Buffer.on('error', function () {
    console.log("I'm sorry, there has been an error loading the samples. This page works best on on the most up-to-date version of Chrome.");
  })

}

function changeOctave(octave) {
  var buttons = document.getElementsByClassName('octave-button');
  var newButton = buttons[octave - 1].children[0];
  var oldButton = buttons[settings.octave - 1].children[0];
  oldButton.classList.remove("octave-button-active")
  oldButton.classList.add("octave-button-inactive")
  newButton.classList.remove("octave-button-inactive")
  newButton.classList.add("octave-button-active")

  settings.octave = octave;
}

function generateProg() {
  stopPlayback();

  newProg = [];

  while (newProg.length < settings.chordsPerProg) {
    seed = generateRandomProg(5, settings.minimumChordalMembers);
    data = seed.concat(newProg).slice(-5);
    var prediction = model.predict(tf.tensor([data]));
    shapeModelOutput(prediction).forEach(function (a) {
      newProg.push(a);
    });
  }
  if (newProg.length !== settings.chordsPerProg) {
    newProg = newProg.slice(0, settings.chordsPerProg);
  }
  currentProg = newProg;
  determineChordalMembersAndNames();
  if (currentProgNames.includes("<unk>") && settings.onlyNamedChords) {
    generateProg();
    return;
  }
  currentChordIndex = 0;

  writeProgToHtml();

  document.getElementById("progInput").value = currentProg.map(a =>
    hashedReverseDict[getPseudoHash(a)]
  ).join(" ")
}

function shapeModelOutput(raw) {
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
  for (let i = 0; i < 5; i += 1) {
    binary[i] = [];
  }

  //convert to binary
  for (let i = 0; i < 5; i += 1) {
    for (var thresh = .5; thresh > 0; thresh -= .1) {
      for (var j = 0; j < 12; j += 1) {
        binary[i][j] = probArry[i][j] > thresh ? 1 : 0;
      }
      // Count number of '1's in array. If greater than min,
      // then stop increasing threshold and continue.
      if (binary[i].reduce((a, b) => a + b) >= settings.minimumChordalMembers) {
        break;
      }
    }
  }

  return binary;
}

function playProg(startIndex = 0) {
  stopPlayback();

  currentChordIndex = startIndex

  playCurrentChord();

  playbackTimer = setInterval(function () {
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

  console.log("attack triggered: " + currentProgMembers[currentChordIndex] + " " + currentChordIndex);
  synth.triggerAttack(currentProgMembers[currentChordIndex].map(a => a + settings.octave.toString()));

  var currentTile = document.getElementsByClassName("chord-tile")[currentChordIndex]
  currentTile.classList.add("chord-tile-active")
  currentTile.classList.remove("chord-tile-inactive")

  var bar = document.getElementsByClassName("tile-progress-inner")[currentChordIndex];
  bar.classList.add("tile-progress-anim");
  bar.style.animationDuration = settings.noteDuration + "s";
}

function stopPlayback() {
  if (synth) {
    clearInterval(playbackTimer);
    playbackTimer = false;

    currentChordIndex = 0;

    synth.releaseAll();
  }

  writeProgToHtml();
}

function determineChordalMembersAndNames() {
  currentProgNames = [];
  for (let i = 0; i < currentProg.length; i++) {
    var name = hashedReverseDict[getPseudoHash(currentProg[i])] || "<unk>";
    currentProgNames.push(name);
  }

  currentProgMembers = []
  for (let i = 0; i < currentProgNames.length; i++) {
    if (currentProgNames[i] === "<unk>") {
      var notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
      var chord = mask(notes, currentProg[i]);
      currentProgMembers.push(chord)
    } else {
      var chord = PyChordParser.parseChord(currentProgNames[i][0])
      var notes = chord.getSpelling();
      notes = notes.map(function (a) {
        if (a.includes("##")) {
          return a.replace(/##/g, "x")
        } else {
          return a
        }
      });

      currentProgMembers.push(notes);
    }
  }
}

function writeProgToHtml() {
  var tiles = [];
  for (let i = 0; i < currentProg.length; i++) {
    var chordTile = makeChordTile(currentProgMembers[i], currentProgNames[i]);

    tiles.push(chordTile);

  }

  var rows = []
  for (let i = 0; i < tiles.length; i += 2) {
    currentLine = tiles.slice(i, i + 2);

    var row = document.createElement("div")
    row.setAttribute("class", "row")
    row.appendChild(currentLine[0])
    if (currentLine[1]) {
      currentLine[1].classList.add("col-md-offset-2")
      row.appendChild(currentLine[1])
    }
    rows.push(row)
    rows.push(document.createElement("br"))
  }

  node = document.getElementById("progContainer");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  rows.forEach(
    a => node.appendChild(a)
  )
}

function makeChordTile(members, name) {
  var topNode = document.createElement("div")
  topNode.setAttribute("class", "col-md-5 chord-tile chord-tile-inactive")

  var row1 = document.createElement("div")
  row1.setAttribute("class", "row")
  var membersDiv = document.createElement("div")
  membersDiv.setAttribute("class", "column chord-members")
  membersDiv.appendChild(document.createTextNode(members.map(a => a + "").toString().replace(/,/g, "\n")))
  row1.appendChild(membersDiv);

  var row2 = document.createElement("div")
  row2.setAttribute("class", "row")
  var nameDiv = document.createElement("div");
  nameDiv.setAttribute("class", "column chord-name")
  nameDiv.appendChild(document.createTextNode(name))
  row2.appendChild(nameDiv);

  var row3 = document.createElement("div")
  row3.classList.add("row")
  var outer = document.createElement("div")
  outer.classList.add("column")
  outer.classList.add("progress")

  var inner = document.createElement("div")
  inner.setAttribute("class", "progress-bar tile-progress-inner")
  inner.setAttribute("role", "progressbar")
  inner.setAttribute("aria-valuenow", "0")
  inner.setAttribute("aria-valuemin", "0")
  inner.setAttribute("aria-valuemax", "100")

  outer.appendChild(inner);
  row3.appendChild(outer)

  topNode.appendChild(row1);
  topNode.appendChild(row2);
  topNode.appendChild(row3);

  topNode.addEventListener("click", function (e) {
    var tiles = Array.from(document.getElementsByClassName("chord-tile"));
    playProg(tiles.indexOf(this));
  });

  return topNode;
}