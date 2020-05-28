var dir_1 = [0,2,0,-2];
var dir_2 = [2,0,-2,0];

var dir_A = [1,0,-1,0];
var dir_B = [0,1,0,-1];
//var prime = 982451653;


// Used to generate maze
function gen_maze(node){
    // Set the current node to visited
    node.attrs.visited_A = true;
    // Get random starting point
    var start = Math.random() * 4;

    // Get current node's i,j position
    var cur_i = node.attrs.row;
    var cur_j = node.attrs.col;

    // Start at random index between [0,4)
    for (var j = start; j < start + 4; ++j) {
        var child_i = node.attrs.row + dir_1[Math.floor(j%4)];
        var child_j = node.attrs.col + dir_2[Math.floor(j%4)];
        var child = stage.find(`#${child_i}_${child_j}`)[0];
        // If child exists
        if(child && child.attrs.visited_A == false){
            connect(cur_i,cur_j,child_i,child_j);
            gen_maze(child);
        }
    }
}

// Used to solve maze
function dfs_solve(i, j, width, height){
    // If end is reached
    if(i == height - 2 && j == width - 2){
        mark_visited(i,j);
        return true;
    }
    // Get current i,j node from layer
    var node = stage.find(`#${i}_${j}`)[0];

    // If the i,j node exists and it is unvisited and it is not a wall
    if (node && !node.attrs.visited_B && !node.attrs.wall) {
        // Mark visited
        node.attrs.visited_B = true;
        mark_visited(i,j);
        // Search in all directions
        if(dfs_solve(i+1,j, width, height) == true){
            return true;
        }
        if(dfs_solve(i-1,j, width, height) == true){
            return true;
        }
        if(dfs_solve(i,j+1, width, height) == true){
            return true;
        }
        if(dfs_solve(i,j-1, width, height) == true){
            return true;
        }
        // Backtrack
        mark_unvisited(i,j);
        return false;
    }
    return false;
}


/*---------------Misc--------------*/

/*Not Working*/ 
function dfs_stack(node){
    var deque = new Deque();
    deque.addBack(node);
    while(!deque.isEmpty()){
        var cur = deque.peekBack();
        deque.removeBack();
        if(cur.attrs.visited_A){
            continue;
        }
        cur.attrs.visited_A = true;
        
        var start = Math.random() * prime;
        //var start = 0;
        for (var i = start; i < start + 4; ++i) {
            var child_i = cur.attrs.row + dir_1[Math.floor(i%4)];
            var child_j = cur.attrs.col + dir_2[Math.floor(i%4)];
            var child = stage.find(`#${child_i}_${child_j}`)[0];
            // If child exists
            if(child && child.attrs.visited_A == false){
                //child.attrs.visited_A = true;
                connect(cur.attrs.row,cur.attrs.col,child_i,child_j);
                deque.addBack(child);
                console.log(`#${child_i}_${child_j}`);
            }
        }
    }
}

/*Not Working*/ 
function bfs_solve(node, width, height){
    var deque = new Deque();
    var first = stage.find(`#1_1`)[0];
    deque.addFront(first);
    while(!deque.isEmpty()){
        cur = deque.peekFront();
        deque.removeFront();
        var cur_i = cur.attrs.row;
        var cur_j = cur.attrs.col;
        mark_visited(cur_i,cur_j);
        cur.attrs.visited_B = true;
        if(cur_i == height - 2 && cur_j == width - 2){
            return;
        }
        else{
            for (var i = 0; i < 4; ++i) {
                var child_i = cur_i + dir_A[i];
                var child_j = cur_j + dir_B[i];
                var child = stage.find(`#${child_i}_${child_j}`)[0];
                if(child && !child.attrs.visited_B && !child.attrs.wall){ 
                    deque.addBack(child);
                }
            }   
        }
    }
}