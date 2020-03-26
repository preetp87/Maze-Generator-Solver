
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
    this.visited = false;
    this.edgeConnection = [];

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

function mst()
{
    var adjlist = linearVertex;
    var v = n*n;
    var tmp = pickrandom();
    var MST = [];
    var edges = [];
    var visited = [];
    var minEdge = [null, null, Infinity];

    while(MST.length!== v-1)
    {
        //current vertex
        var vertex = tmp;
        //current vertex pushed into visited array
        visited.push(vertex.value);
        //checks the connecting edges of vertex and pushs (start, end, and weight) into edges array
        for(var i =0; i< vertex.edgeConnection.length; i++)
        {
            edges.push([vertex.value,vertex.edgeConnection[i].vertex2, vertex.edgeConnection[i].weight])
        }

        //finds the minimum edge from the edges array while making sure that minimum edge is not in the visited array
        //then stores it into minEdge array (start, end, and weight)
        for(var j= 0; j<edges.length; j++)
        {
            if(edges[j][2] < minEdge[2] && visited.indexOf(edges[j][1]) ===-1)
            {
                minEdge = edges[j];
            }
        }
        //removes the minEdge from edges Array
        edges.splice(edges.indexOf(minEdge),1);
        //pushes the value into MST array
        MST.push(minEdge);
        // sets the temp(vertex) to the minEdge(vertex)
        tmp = linearVertex[minEdge[1]];
        //resets minEdge to infinity so that it can be used to find the minimum value again
        minEdge = [null,null,Infinity];
    }

        return MST;
}

board();
console.log(linearVertex);
console.log(mst());