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