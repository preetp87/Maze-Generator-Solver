const n = 10;
var canvas = document.querySelector('canvas');
const len = 50;
canvas.width = len*n;
canvas.height = len*n;
var content = canvas.getContext("2d");
content.fillStyle = "gray";
content.fillRect(0,0,len*n,len*n);

var numOfVertex= 0;
var linearVertex = [];
var current;
var startnode;



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
    //vertical
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
    //horizontal
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
    this.wall=[true,true,true,true];
    this.solnvisited = false;

    this.show = function()
    {
        //if the cell has been visited, change the color
        if(this.visited)
        {

            content.fillStyle = "#F8C471 ";
            content.fillRect(y*len, x*len, len, len);



        }

        if(this.solnvisited)
        {
            content.fillStyle = "red";
            content.fillRect(y*len, x*len, len, len);
        }

        //draw line colour with black stroke
        content.strokeStyle = "black";
        if(this.wall[0])
        {
         //top
        content.beginPath();
        content.moveTo(this.y*len, this.x*len);
        content.lineTo(this.y*len+len, this.x*len);
        content.stroke();
        }

        if(this.wall[1])
        {
        //right
        content.beginPath();
        content.moveTo(this.y*len+len, this.x*len);
        content.lineTo(this.y*len+len, this.x*len+len);
        content.stroke();
        }

        if(this.wall[2])
        {
        //bottom
        content.beginPath();
        content.moveTo(this.y*len, this.x*len+len);
        content.lineTo(this.y*len+len, this.x*len+len);
        content.stroke();
        }

        if(this.wall[3])
        {
        //left
        content.beginPath();
        content.moveTo(this.y*len, this.x*len);
        content.lineTo(this.y*len, this.x*len+len);
        content.stroke();
        }

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
    console.log(linearVertex);
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
        //top
        var one = linearVertex[minEdge[0]];
        var two = linearVertex[minEdge[1]];
        one.visited = true;
        two.visited = true;
        if (one.x == (two.x+1)){
            one.wall[0] = false;
            two.wall[2] = false;
        }
        else if (one.y == (two.y-1)){
            one.wall[1] = false;
            two.wall[3] = false;
        }
        else if (one.x == (two.x-1)){
            one.wall[2] = false;
            two.wall[0] = false;
        }
        else if (one.y == (two.y+1)){
            one.wall[3] = false;
            two.wall[1] = false;
        }
        MST.push(minEdge);
        // sets the temp(vertex) to the minEdge(vertex)
        tmp = linearVertex[minEdge[1]];
        //resets minEdge to infinity so that it can be used to find the minimum value again
        minEdge = [null,null,Infinity];
    }

        return MST;
}


function creategraph(MST){
    for (var i = 0; i < linearVertex.length;i++){
        var length = linearVertex[i].edgeConnection.length;
        linearVertex[i].edgeConnection.splice(0,length);

    }
    
    for (var i = 0; i < MST.length;i++){
        var edgev1 = new edge( MST[i][0],MST[i][1],MST[i][2]);
        
        linearVertex[MST[i][0]].edgeConnection.push(edgev1);
    }
    
}

function peek(array){
    return array[array.length -1];
}
function dfs(mstDFS)
{
    var stacks = [];
    
    var starting = linearVertex[mstDFS[0][0]];
    console.log(starting);
    console.log(endnode);

    var ending = endnode;
    
    var path = [];
    stacks.push(starting);
    console.log(peek(stacks));
    
    while(true) 
    {
        var curNode = peek(stacks);
        path.push(curNode.value);
        curNode.solnvisited = true;
        
        if(curNode.value === ending.value)
        {
            break;
        }
        var unvisited = 0;
        curNode.edgeConnection.forEach(function(id){
            
            var node = linearVertex[id.vertex2];
            if(!node.solnvisited)
            {
                stacks.push(node);
                unvisited +=1;
            }
        })
        if(unvisited ===0)
        {
            stacks.pop();
        }
    }
    console.log(stacks);
}



function draw()
{
    setInterval(function(){
    //draw each cell
    for(var i =0; i< linearVertex.length; i++)
    {
        linearVertex[i].show();
    }
    
    }, 3000);

}

board();
draw();
var endnode = pickrandom();

var mstGraph = mst();
console.log(mstGraph);
creategraph(mstGraph);
console.log(linearVertex);
draw();
dfs(mstGraph);
draw();