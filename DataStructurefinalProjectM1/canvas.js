//fulls the canvas element from index.html
var canvas = document.querySelector('canvas');


const len= 50

canvas.width = len*10;
canvas.height = len*10;
var content = canvas.getContext("2d");
content.fillStyle = "gray";
content.fillRect(0,0,len*10,len*10);
var grid = [];

var current;


function index(i, j){
 if (i<0 || j<0 || i> 9 || j > 9){
  return -1;
 }
 return i + j* 10;
}




//sets the board
function board()
{
    for (var i =0; i< len; i++)
    {
        for(var j =0; j< len;j++)
        {
            var unit = new cell(i,j);
            grid.push(unit);
        }
    }
    current = grid[0];
}


//cell object for each unit.
function cell(i,j)
{
    this.x = len;
    this.y = len;
    this.wall = [true,true,true,true]; 
    this.visited = false;


    this.checkNeighbour = function()
    {
        
    }

    //show methoad to draw the lines
    this.show = function()
    {
        if(this.visited)
        {
            
            content.beginPath();
            content.rect(i*len, j*len, len, len);
            content.fillStyle = "red";
            content.fill();
            
        }


        content.strokeStyle = "black";
        if(this.wall[0])
        {
         //top
        content.beginPath();
        content.moveTo(i*len, j*len);
        content.lineTo(i*len+len, j*len);
        content.stroke();
        }
        if(this.wall[1])
        {
        //right
        content.beginPath();
        content.moveTo(i*len+len, j*len);
        content.lineTo(i*len+len, j*len+len);
        content.stroke();
        }
        if(this.wall[2])
        {
        //bottom
        content.beginPath();
        content.moveTo(i*len+len, j*len+len);
        content.lineTo(i*len, j*len+len);
        content.stroke();
        }
 
        if(this.wall[3])
        {
        //left
        content.beginPath();
        content.moveTo(i*len, j*len+len);
        content.lineTo(i*len, j*len);
        content.stroke();
        }


   
    }
    
    this.checkNeighbours = function(){
        var neighbours = [];

        var top = grid[index(i,j-1)];
        var right = grid[index(i+1,j)];
        var bottom = grid[index(i,j+1)];
        var left = grid[index(i-1,j)];
        
        if (top && !top.visited){
            neighbours.push(top);
        }
        
        if (right && !right.visited){
            neighbours.push(right);
        }
        
        if (bottom && !bottom.visited){
            neighbours.push(bottom);
        }
        
        if (left && !left.visited){
            neighbours.push(left);
        }
    }
}

//draw function
function draw()
{
    for(var i =0; i< grid.length; i++)
    {
        grid[i].show();
    }

    current.visited = true;
    current.checkNeighbour();
    current.show();
}
//hello this is the change i made

board();
draw();
console.log(current);
