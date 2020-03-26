
const n = 3;
var numOfVertex= 0;
var linearVertex = [];


function index(y,x)
{
    if(x<0 || y<0|| x> n-1|| y> n-1)
    {
        return -1;
    }
    return x + y*n;

}

function pickrandom(){
    //chose horizontal or vertical
    var axis = Math.floor(Math.random()*10);
    //horizontal
    if (axis <=4){
        //chose 0 or 9
        var row = Math.floor(Math.random()*10);
        //0
        if (row <=4){
            row = 0;
            var col = Math.floor(Math.random()*(n-1));
            var ind = index(col,row);
            return linearVertex[ind];
        }
        //9
        else {
            row = n-1;
            var col = Math.floor(Math.random()*(n-1));
            var ind = index(col,row);
            return linearVertex[ind];
        }
    }
    //vertical
    else {
        //chose 0 or 9
        var col = Math.floor(Math.random()*10);
        //0
        if (col <=4){
            col = 0;
            var row = Math.floor(Math.random()*(n-1));
            var ind = index(col,row);
            return linearVertex[ind];
        }
        //9
        else {
            col = n-1;
            var row = Math.floor(Math.random()*(n-1));
            var ind = index(col,row);
            return linearVertex[ind];
        }
    }
}


function vertex(y, x)
{   
    this.value;
    //this.size = 50;
    this.y = y;
    this.x = x;
    this.edgeConnection = [];
    this.checkNeighbour = function()
    {
        var neighbour = [];

        var top = linearVertex[index(y-1,x)];
        var right = linearVertex[index(y,x+1)];
        var bottom = linearVertex[index(y+1,x)];
        var left = linearVertex[(index(y,x-1))];

        if(top)
        {
            neighbour.push(top);
        }
        if(right)
        {
            neighbour.push(right);
        }
        if(bottom)
        {
            neighbour.push(bottom);
        }
        if(left)
        {
            neighbour.push(left);
        }
        return neighbour;

    }


}

function edge(vertex1, vertex2, weight)
{
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.weight = weight;

}

function board()
{
    for (var y = 0; y< n; y++)
    {
        for(var x = 0; x<n; x++)
        {
            var unit = new vertex(y,x);
            unit.value = numOfVertex;
            linearVertex.push(unit);
            numOfVertex++;
            
        }
    }
    //horizontal lines 
    for(var y=0; y<n; y++)
    {
        for(var x = 0; x< n-1; x++)
        {
            var r = Math.floor(Math.random()*10);
            var edge1 = new edge(linearVertex[index(y,x)].value, linearVertex[index(y,x+1)].value, r);
            var edge2 = new edge(linearVertex[index(y,x+1)].value, linearVertex[index(y,x)].value, r);
            linearVertex[index(y,x)].edgeConnection.push(edge1);
            linearVertex[index(y,x+1)].edgeConnection.push(edge2);  
        }

    }

    //vertical lines
    for(var y =0; y< n-1; y++)
    {
        for(var x = 0; x< n; x++)
        {
            var r2 = Math.floor(Math.random()*10);
            var edgev1 = new edge(linearVertex[index(y,x)].value,linearVertex[(index(y+1,x))].value,r2);
            var edgev2 = new edge(linearVertex[index(y+1,x)].value,linearVertex[(index(y,x))].value,r2);
            linearVertex[index(y,x)].edgeConnection.push(edgev1);
            linearVertex[index(y+1,x)].edgeConnection.push(edgev2);

        }
    }

}


board();
console.log(pickrandom());
