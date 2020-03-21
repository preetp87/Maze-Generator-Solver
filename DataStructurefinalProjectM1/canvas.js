
//fulls the canvas element from index.html
var canvas = document.querySelector('canvas');

//initilizes the canvas
const len= 50

canvas.width = len*10;
canvas.height = len*10;
var content = canvas.getContext("2d");
content.fillStyle = "gray";
content.fillRect(0,0,len*10,len*10);
var grid = [];

var current;


//sets the board
function board()
{
    for (var i =0; i< 10; i++)
    {
        for(var j =0; j< 10;j++)
        {
            var unit = new cell(i,j);
            grid.push(unit);
        }
    }
    current = grid[0];
}


//used to get the referance value of a cell grid 
function index(i,j)
{
    if(i<0 || j<0|| i> 9|| j> 9)
    {
        return -1;
    }
    return j + i*10;

}


//cell object for each unit.
function cell(i,j)
{
    //cell attributes
    this.i = i;
    this.j = j;
    this.x = len;
    this.y = len;
    this.wall = [true,true,true,true]; 
    this.visited = false;

    //checking current cell neighbours
    this.checkNeighbour = function()
    {
        // neighbour attributes
        var neighbour = [];
        // relative reference to current cell
        var top = grid[index(i-1, j)];
        var right = grid[index(i,j+1)];
        var buttom = grid[index(i+1, j)];
        var left = grid[(index(i, j-1))];

        //if value of neighbour exsits and it has not been visided push into array
        if(top && !top.visited)
        {
            neighbour.push(top);
        }
        if(right && !right.visited)
        {
            neighbour.push(right);
        }
        if(buttom && !buttom.visited)
        {
            neighbour.push(buttom);
        }
        if(left && !left.visited)
        {
            neighbour.push(left);
        }

        //when all neighbours have been pushed into stack, randomly pick one and return that neighbour
        if(neighbour.length>0){
            var r = Math.floor(Math.random()*neighbour.length);
          
            return neighbour[r];
        }
        
        else {
            return undefined;
        }
    }

    //show methoad to draw the lines
    this.show = function()
    {
        //if the cell has been visited, change the color
        if(this.visited)
        {
            
            content.fillStyle = "blue";
            content.fillRect(j*len+2, i*len+2, len-4, len-4);
            
            
            
        }

        //draw line colour with black stroke
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
}


//draw function
function draw()
{
    //draw each grid
    for(var i =0; i< grid.length; i++)
    {
        grid[i].show();
    }

    //initilizes the first cell "current" visited
    current.visited = true;
    current.show();
    console.log(current);

    // runs the function at 100 miliseconds intervals
    setInterval(function(){

        //sets the value of next to current neighbour
        //if it exsists, it will set it as current, mark visited
        // and repeat.
        var next = current.checkNeighbour();
        if(next)
        {
            removewalls(current,next);
            current = next;
            next.visited = true;
            console.log(current);
            current.show();
    
        }
    },1000);

    
    
}


function removewalls(a,b)
{
    
    var x = a.j - b.j;
    var y = a.i - b.i;
    //left case
    if(x===1)
    {
        a.wall[3] = false;
        b.wall[1] = false;
    }
    //right case
    else if(x===-1)
    {
        a.wall[1] =false;
        b.wall[3] = false;
    }
    //bottom case
    if(y === 1)
    {
        a.wall[2]== false;
        b.wall[0] == false;
    }
    //top case
    else (y===-1)
    {
        a.wall[0] =false;
        b.wall[2] = false;
    }

}


//calls the function board and draw.
board();
draw();
