var width = window.innerWidth;
var height = window.innerHeight;
var stage;
var layer;
var tween;
var w;
var h;

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

function make_maze(w,h){
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
  var start = stage.find(`#0_1`)[0];
  var end = stage.find(`#${h-1}_${w-2}`)[0];
  start.attrs.fill = 'green';
  end.attrs.fill = 'red';
}

async function generate_helper(w,h){
  make_maze(w,h);
  var first = stage.find(`#1_1`)[0];
  //dfs_stack(first);
  dfs(first);
}

async function solver_helper(i,j,w,h){
  if(!dfs_solve(1,1,w,h)){
    console.log("Unsolvable");
  }
}


document.getElementById('reset').addEventListener('click', () => {
  stage.destroy();
  layer.destroy();
});

document.getElementById('myForm').addEventListener('submit', (event) =>{
  /*
  var generate = document.getElementById("generate");
  var icon = document.createElement('i');
  icon.classList.add("fa", "fa-spinner", "fa-spin");
  console.log(generate);
  generate.appendChild(icon);
  */
  event.preventDefault();
  w = $('#width').val();
  h = $('#height').val();
  console.log('Generating');
  generate_helper(w,h).then( () => {
    console.log('Completed');
    //<i id="loading" class="fa fa-spinner fa-spin"></i>

    //element.style.visibility = "hidden";
  });
});

document.getElementById('solve').addEventListener('click', () => {
  
  solver_helper(1,1,w,h).then( () => {
    console.log('Completed');
  });
},false);