
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

    this.i = i;
    this.j = j;
    this.x = len;
    this.y = len;
    this.wall = [true,true,true,true]; 
    this.visited = false;


    this.checkNeighbour = function()
    {
        var neighbour = [];
        var top = grid[index(i-1, j)];
        var right = grid[index(i,j+1)];
        var buttom = grid[index(i+1, j)];
        var left = grid[(index(i, j-1))];


        if(top && !top.visted)
        {
            neighbour.push(top);
        }
        if(right && !right.visted)
        {
            neighbour.push(right);
        }
        if(buttom && !buttom.visted)
        {
            neighbour.push(buttom);
        }
        if(left && !left.visted)
        {
            neighbour.push(left);
        }
        console.log(neighbour);
        if(neighbour.length>0){
            var r = Math.floor(Math.random()*neighbour.length);
          console.log(r);
            return neighbour[r];
        }
        else {
            return undefined;
        }
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
}


//draw function
function draw()
{
    for(var i =0; i< grid.length; i++)
    {
        grid[i].show();
    }

    current.visited = true;
    current.show();

    for(var i =0;i<3;i++)
    {
        var next = current.checkNeighbour();
        if(next)
        {
            next.visited = true;
            current = next;
            //console.log(current);
            current.show();
    
        }
    }
    
}


board();
draw();

