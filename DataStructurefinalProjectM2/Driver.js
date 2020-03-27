var canvas = document.querySelector('canvas');
const len = 50;



const speedtravase = 10;

const n = 30;

const speed = n*2;
canvas.width = len*n;
canvas.height = len*n;
var content = canvas.getContext("2d");
content.strokeStyle = "black";
content.lineWidth =5;
content.rect(0,0,len*n,len*n);
content.stroke();

var count2 = 0;
var count = 0;
var numOfVertex= 0;
var numofVertexSol = 0;
var linearVertex = [];
var solution = [];

var starting;
var ending;

var solutionPath=[];

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
    this.highlighted = function()
    {
        if(this.visited)
        {
            content.fillStyle = "#EC7063";
            content.fillRect(this.x*len, this.y*len, len, len);
        }
    }
    this.startindex = function()
    {
        content.fillStyle ="#AED6F1";
        content.fillRect(this.x*len, this.y*len, len, len);
    }
    this.endingindex = function()
    {
        content.fillStyle ="#2874A6";
        content.fillRect(this.x*len, this.y*len, len, len);
    }
    this.backtracking = function()
    {
        content.fillStyle ="#F1948A ";
        content.fillRect(this.x*len, this.y*len, len, len);
    }
    
    this.path = function()
    {
        if(this.visited)
        {
            content.fillStyle = "#1F618D";
            content.fillRect(this.x*len, this.y*len, len, len);   
        }
    }
    this.show = function()
    {

        for(var i = 0; i< this.edgeConnection.length; i++)
        {
            //top
            if((this.edgeConnection[i].vertex1 === index(this.y,this.x) && this.edgeConnection[i].vertex2 === index(this.y-1,this.x)))
            {
                content.beginPath();
                content.moveTo(this.x*len, this.y*len);
                content.lineTo(this.x*len+len, this.y*len);
                content.stroke();
            }

            //right
            if((this.edgeConnection[i].vertex1 === index(this.y,this.x) && this.edgeConnection[i].vertex2 === index(this.y,this.x+1)))
            {
                content.beginPath();
                content.moveTo(this.x*len+len, this.y*len);
                content.lineTo(this.x*len+len, this.y*len+len);
                content.stroke();
            }
            // down
            if((this.edgeConnection[i].vertex1 === index(this.y,this.x) && this.edgeConnection[i].vertex2 === index(this.y+1,this.x)))
            {
                content.beginPath();
                content.moveTo(this.x*len, this.y*len+len);
                content.lineTo(this.x*len+len, this.y*len+len);
                content.stroke();
            }
            //left
            if((this.edgeConnection[i].vertex1 === index(this.y,this.x) && this.edgeConnection[i].vertex2=== index(this.y,this.x-1)))
            {
                content.beginPath();
                content.moveTo(this.x*len, this.y*len);
                content.lineTo(this.x*len, this.y*len+len);
                content.stroke();
            }
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


}


function mst()
{
    var v = n*n;
    var tmp = pickrandom();
    var MST = [];
    var edges = [];
    var visited = [];
    var minEdge = [null, null, Infinity];
    tmp.startindex();
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


function dfs(mstDFS)
{

    for (var y = 0; y< n; y++)
    {
        for(var x = 0; x<n; x++)
        {
            var units = new vertex(y,x);
            units.value = numofVertexSol;
            solution.push(units);
            numofVertexSol++;
            
        }
    }
    for(var i =0; i<mstDFS.length; i++)
    {
        var edgeS1 = new edge(mstDFS[i][0],mstDFS[i][1],mstDFS[i][2]);
        var edgeS2 = new edge(mstDFS[i][1],mstDFS[i][0],mstDFS[i][2]);
        solution[mstDFS[i][0]].edgeConnection.push(edgeS1);
        solution[mstDFS[i][1]].edgeConnection.push(edgeS2)
    }
    //console.log(solution);

    var stacks = [];
    starting = solution[mstDFS[0][0]];
    ending = solution[pickrandom().value];
    var path = [];
    stacks.push(starting);
    console.log(peek(stacks));

    setTimeout(function(){
        var stop =setInterval(function() 
        {
            starting.startindex();
            ending.endingindex();
            if(peek(stacks).value != ending.value)
            {
                var curNode = peek(stacks);
                path.push(curNode.value);
                curNode.visited = true;
                var unvisited = 0;
                curNode.edgeConnection.forEach(function(id){
                    var node = solution[id.vertex2];
                    if(!node.visited)
                    {
                        stacks.push(node);
                        unvisited +=1;
                    }
                })
                if(unvisited ===0)
                {
                    peek(stacks).backtracking();
                    stacks.pop();
                    
                }
                for(var i = 0; i< stacks.length;i++)
                {
                    stacks[i].highlighted();
                    starting.startindex();
                }
            }
            else
            {

                ending.visited = true;
                ending.highlighted();

                if(count2<stacks.length)
                {
                    if(stacks[count2].visited == true)
                    {
                        stacks[count2].path();
                    }
                    count2++;
                }
                else
                {  
                    ending.path();
                    ending.endingindex();                   
                    clearInterval(stop);
                }


            }
            for(var i=0; i< linearVertex.length; i++)
            {
                linearVertex[i].show();
            }
            content.rect(0,0,len*n,len*n);
            content.stroke();
            starting.startindex();
            ending.endingindex();


        },speedtravase);

    },mstDFS.length*(speed));



    
    console.log(stacks);

}



function peek(Stack)
{
    return Stack[Stack.length-1]
}



function draw(mst)
{

    var carve = setInterval(function() {
        content.clearRect(0,0,canvas.width,canvas.height)
        content.strokeStyle = "black";
        content.lineWidth =3;
        content.rect(0,0,len*n,len*n);
        content.stroke();

        starting = linearVertex[mst[0][0]];

        for(var i=0; i< linearVertex.length; i++)
        {
            linearVertex[i].show();
            starting.startindex();
        }

        if(count<mst.length)
        {
            for(var j = 0; j< linearVertex[mst[count][0]].edgeConnection.length; j++)
            {
                if(linearVertex[mst[count][0]].edgeConnection[j].vertex2 === mst[count][1])
                {
                    //del.splice(j,1);
                    linearVertex[mst[count][0]].edgeConnection.splice(j,1);
    
                }
            }
            for(var k= 0; k< linearVertex[mst[count][1]].edgeConnection.length; k++)
            {
                if( linearVertex[mst[count][1]].edgeConnection[k].vertex2 === mst[count][0])
                {
                    linearVertex[mst[count][1]].edgeConnection.splice(k,1);
    
                }
            }
        }
        count++;

        if(count>mst.length)
        {
            clearInterval(carve);
        }
        
    },speed);
   
    dfs(mst);

}


board();
console.log(linearVertex);



var mstGraph = mst();
console.log(mstGraph);
console.log(linearVertex);
//creategraph(mstGraph);
console.log(mstGraph[0][1]);
// dfs(mstGraph);
draw(mstGraph);

