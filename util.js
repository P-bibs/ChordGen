function Get(yourUrl){
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",yourUrl,false);
  Httpreq.send(null);
  return Httpreq.responseText;          
}

function mask (data, mask) {
  return data.filter(
    (item, i) => mask[i]
  );
}

function getPseudoHash(arry){
  hash = ""
  for (var i = 0; i < 12; i+=3) {
    seg = arry.slice(i, i+3).reduce(function(a,b){
      return a.toString() + b.toString();
    })
    hash += String.fromCharCode(97 + parseInt( seg, 2 ));
  }
  return hash
}

function temp() {
  getPseudoHash([1,0,0,0,0,1,0,0,0,0,1,1])
}

function reshape(arr, x, y) {
  var out = []
  for (var i=0; i<x; i+=1) {
    out[i] = arr.slice(y*i, y*(i+1))
  }
  return out
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

function generateRandomProg(length, minChordalMembers) {
  prog = []

  for (var i = 0; i<length; i+=1){
    rand = Math.random();
    if (rand <= .5) count = minChordalMembers;
    else if (rand >= .75) count = minChordalMembers + 1;
    else count = minChordalMembers + 1;

    arr = [...Array(12).keys()];
    arr = arr.map((item, i) => 
      i<count ? 1 : 0
    );
    arr = shuffle(arr);

    prog.push(arr);
  }

  return prog

}

function showSnackbar(msg, duration) {
  // Get the snackbar DIV
  var node = document.getElementById("snackbar");

  node.innerHTML = msg;
  node.classList.add("show")

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){
    node.classList.remove("show");
  }, duration * 1000);
}