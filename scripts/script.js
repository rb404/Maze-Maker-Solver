var stage;
var layer;
var tween;
var w;
var h;
var show_search = false;
var num_nodes = 0;
var num_visited = 0;
var bad_nodes = 0;
document.getElementById('solve').disabled = true;

// Load all 24 permuations of up, left, down, right from file
var json = null;
function loadJSON(callback) {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'moves.json', true);
  xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
      }
  };
  xobj.send(null);  
}

loadJSON(function(response) {
  json = JSON.parse(response);
});

function set_color(shape, color){
  if (tween) {
    tween.destroy();
  }
  //shape.attrs.fill = color;
  var tween = new Konva.Tween({
    node: shape,
    easing: Konva.Easings.ElasticEaseOut,
    fill: color,
  });
  setTimeout( () => {
    tween.play();
  }, 500);
}
function mark_visited(i,j){
  ++num_visited;
  var shape = stage.find(`#${i}_${j}`)[0];
  set_color(shape,'#66FF66');
}

function mark_unvisited(i,j){
  var shape = stage.find(`#${i}_${j}`)[0];
  ++bad_nodes;
  if(show_search){
    set_color(shape,'#E12C2C');
  }
  else{
    set_color(shape,'white');
  }
}

function connect(i1,j1,i2,j2){
  // Find the i,j index of the black wall between the two white nodes
  // and turn it into a non-wall
  ++num_nodes;
  var i;
  var j;
  if(i1 == i2){
      i = i1;
      j = (j1 + j2) / 2;
  }
  else{
      i = (i1 + i2) / 2;
      j = j1;
  }
  var shape = stage.find(`#${i}_${j}`)[0];
  shape.attrs.wall = false;
  set_color(shape,'white');
}

function make_checkerboard(w,h){
  num_visited = 0;
  num_nodes = 0;
  bad_nodes = 0;
  stage = new Konva.Stage({
    container: 'maze',
    width: 10 * w,
    height: 10 * h,
  });
  layer = new Konva.Layer();
  for(let i = 0; i < h; ++i){
      for(let j = 0; j < w; ++j){
          let color = 'black';
          let is_wall = true;
          if(i % 2 == 1 && j % 2 == 1){
              color = 'white';
              is_wall = false;
              ++num_nodes;
          }
          var rect = new Konva.Rect({
              x: 10 * j,
              y: 10 * i,
              width: 10,
              height: 10,
              strokeWidth: 1,
              fill: color,
              id: `${i}_${j}`,
              visited_A: false,
              visited_B: false,
              wall: is_wall,
              row: i,
              col: j,
            });
          layer.add(rect);
      }
  }
  // add the layer to the stage
  stage.add(layer);
  // Make start and end point green and red
  var start = stage.find(`#0_1`)[0];
  var end = stage.find(`#${h-1}_${w-2}`)[0];
  start.attrs.fill = '#66FF66';
  end.attrs.fill = '#66FF66';
}

/*
document.getElementById('reset').addEventListener('click', () => {
  stage.destroy();
  layer.destroy();
});
*/
document.getElementById('myForm').addEventListener('submit', (event) =>{
  // Prevent page refresh
  event.preventDefault();
  document.getElementById("correct").innerHTML = null;
  document.getElementById("incorrect").innerHTML = null;
  document.getElementById("tot-nodes").innerHTML = null;
  document.getElementById("efficiency").innerHTML = null;
  // Get width and height input
  w = 2 * $('#width').val() + 1;
  h = 2 * $('#height').val() + 1;
  console.log('Generating');

  // Make the checkerboard
  make_checkerboard(w,h);
  
  // Start at end and generate maze
  //var first = stage.find(`#1_1`)[0];
  var first = stage.find(`#${h-2}_${w-2}`)[0];
  gen_maze(first);
  document.getElementById('solve').disabled = false;
});

document.getElementById('solve').addEventListener('click', () => {
  // Dfs_solve returns whether maze is solvable or not
  document.getElementById('solve').disabled = true;
  console.log("SOLVING");
  show_search = document.getElementById('search-space').checked ? true : false;
  if(!dfs_solve(1,1,w,h)){
    console.log("Unsolvable");
  }
  let rate = (num_visited/num_nodes) * 100;
  document.getElementById("tot-nodes").innerHTML = "Total Nodes: " + num_nodes;
  document.getElementById("correct").innerHTML = "Correct Nodes: " + (num_visited - bad_nodes);
  document.getElementById("incorrect").innerHTML = "Inorrect Nodes: " + bad_nodes;
  document.getElementById("efficiency").innerHTML = "Total Maze Traversed: " + rate + '%';
},false);