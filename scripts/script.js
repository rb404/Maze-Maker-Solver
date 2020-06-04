var width = window.innerWidth;
var height = window.innerHeight;
var stage;
var layer;
var tween;
var w;
var h;

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
  var shape = stage.find(`#${i}_${j}`)[0];
  set_color(shape,'red');
}

function mark_unvisited(i,j){
  var shape = stage.find(`#${i}_${j}`)[0];
  set_color(shape,'white');
}

function connect(i1,j1,i2,j2){

  // Find the i,j index of the black wall between the two white nodes
  // and turn it into a non-wall
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
  stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
  });
  layer = new Konva.Layer();
  for(let i = 0; i < h; ++i){
      for(let j = 0; j < w; ++j){
          let color = 'black';
          let is_wall = true;
          if(i % 2 == 1 && j % 2 == 1){
              color = 'white';
              is_wall = false;
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
  start.attrs.fill = 'green';
  end.attrs.fill = 'red';
}

document.getElementById('reset').addEventListener('click', () => {
  stage.destroy();
  layer.destroy();
});

document.getElementById('myForm').addEventListener('submit', (event) =>{
  // Prevent page refresh
  event.preventDefault();

  // Get width and height input
  w = $('#width').val();
  h = $('#height').val();
  console.log('Generating');

  // Make the checkerboard
  make_checkerboard(w,h);
  
  // Start at 1,1 and generate maze
  var first = stage.find(`#1_1`)[0];
  gen_maze(first);
});

document.getElementById('solve').addEventListener('click', () => {
  // Dfs_solve returns whether maze is solvable or not
  if(!dfs_solve(1,1,w,h)){
    console.log("Unsolvable");
  }
},false);