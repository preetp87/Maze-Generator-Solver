
//fulls the canvas element from index.html
var canvas = document.querySelector('canvas');

//initilizes the canvas
const len= 50;
const units = 20;
canvas.width = len*units;
canvas.height = len*units;
var content = canvas.getContext("2d");
content.fillStyle = "gray";
content.fillRect(0,0,len*units,len*units);
var grid = [];



var Visits = [];

var current;


//sets the board
function board()
{
    for (var i =0; i< units; i++)
    {
        for(var j =0; j< units;j++)
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
    if(i<0 || j<0|| i> units-1|| j> units-1)
    {
        return -1;
    }
    return j + i*units;

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


    this.highlight = function()
    {
        content.fillStyle = "#1F618D";
        content.fillRect(j*len, i*len, len, len);
    }


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

            content.fillStyle = "#F8C471 ";
            content.fillRect(j*len, i*len, len, len);



        }

        //draw line colour with black stroke
        content.strokeStyle = "black";
        if(this.wall[0])
        {
         //top
        content.beginPath();
        content.moveTo(this.j*len, this.i*len);
        content.lineTo(this.j*len+len, this.i*len);
        content.stroke();
        }

        if(this.wall[1])
        {
        //right
        content.beginPath();
        content.moveTo(this.j*len+ len, this.i*len);
        content.lineTo(this.j*len+len, this.i*len+len);
        content.stroke();
        }

        if(this.wall[2])
        {
        //bottom
        content.beginPath();
        content.moveTo(this.j*len, this.i*len+len);
        content.lineTo(this.j*len +len, this.i*len+len);
        content.stroke();
        }

        if(this.wall[3])
        {
        //left
        content.beginPath();
        content.moveTo(this.j*len, this.i*len);
        content.lineTo(this.j*len, this.i*len+len);
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
    current.highlight();
    console.log(current);


    // runs the function at 100 miliseconds intervals
    setInterval(function()
    {
        content.clearRect(0, 0, canvas.width, canvas.height);
        content.fillStyle = "gray";
        content.fillRect(0,0,len*units,len*units);
        for(var i =0; i< grid.length; i++)
        {
            grid[i].show();
        }

        //sets the value of next to current neighbour
        //if it exsists, it will set it as current, mark visited
        // and repeat.
        var next = current.checkNeighbour();
        if(next)
        {
            Visits.push(current);
            removewalls(current,next);
            current = next;
            next.visited = true;
            console.log(current);
            current.show();
            current.highlight();
        }
        else if(Visits.length>0)
        {
            current = Visits.pop();
            current.highlight();
        }
    },10);



}


function removewalls(a,b)
{

    var x = a.j - b.j;
   // console.log(x);
    var y = a.i - b.i;
    //console.log(y);
    //left case
    if(x===1)
    {
        a.wall[3] = false;
        b.wall[1] = false;
    }
    //right case
    if(x===-1)
    {
        a.wall[1] = false;
        b.wall[3] = false;
    }
    //bottom case
    if(y === 1)
    {
        a.wall[0] = false;
        b.wall[2] = false;
    }
    //top case
    if(y===-1)
    {
        a.wall[2] = false;
        b.wall[0] = false;
    }

}


//calls the function board and draw.
board();

draw();
