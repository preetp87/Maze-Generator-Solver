//gets canvas element from Html.
var canvas = document.querySelector('canvas');
//represents 50 pixels used for height and width for grid
const len = 50;


//Speed for the solving the maze. Used for the visuals
const speedtravase = 50;
//represents the nxn grid
const n = 20;

//speed used for showing the minimum spanning tree visuals
const speed = n*2;

//properties for canvas. Makes the width, height, intilizes variabes used to draw to canvas.
canvas.width = len*n;
canvas.height = len*n;
var content = canvas.getContext("2d");
content.strokeStyle = "black";
content.lineWidth =5;
content.rect(0,0,len*n,len*n);
content.stroke();

//count2 and count variables used visual representation for MST and DFS algorithum
var count2 = 0;
var count = 0;
var numOfVertex= 0;
var numofVertexSol = 0;
//LinearVertex represents the nxn Graph, an array of Vertex objects which has Edges and Walls properties
var linearVertex = [];
//solution represents the MST nxn graph, an array of vertex object which has Edges and wall properties
var solution = [];

//starting and ending Vertex for the maze.
var starting;
var ending;

//Stores the solution path with is used to draw on the maze.
var solutionPath=[];

//Since Grid is a linear array-list of objects, this is used for referencing the index key using y,x corrdinate for Each Vertex object.
//y represents the row and x represents the column
function index(y,x)
{
    if(x<0 || y<0|| x> n-1|| y> n-1)
    {
        return -1;
    }
    return x + y*n;
}

// Function that is used to generate random position for the Starting and Ending Vertex.
// Function refrences the edge vertex of the grid and randomly selects a postion and returns the Vertex.
// This function scales with the nxn grid.
function pickrandom(){
    //chose horizontal or vertical
    var axis = Math.floor(Math.random()*10);
    //random horizontal postion
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
    //random vertical postion.
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

//Vertex object.
//It is created using X and Y cordinate system for relative refrencing.
function vertex(y, x)
{ 
    //defines the attributes of a vertex object.
    //has a value, x, y, visited, and stores edges.  
    this.value;
    this.y = y;
    this.x = x;
    this.visited = false;
    this.edgeConnection = [];

    //highlights the solution path, when DFS Finds the ending vertex.
    this.highlighted = function()
    {
        //if the vertex has been visted, then it a dark blue color
        if(this.visited)
        {
            content.fillStyle = "#EC7063";
            content.fillRect(this.x*len, this.y*len, len, len);
        }
    }

    //Colors the Starting Vertex light blue color, to indicate the starting node Where MST occurs From.
    this.startindex = function()
    {
        content.fillStyle ="#AED6F1";
        content.fillRect(this.x*len, this.y*len, len, len);
    }

    //Colors the Ending Vertex red to show Where the Ending Node occurs. Exiting point of the maze
    this.endingindex = function()
    {
        content.fillStyle ="#2874A6";
        content.fillRect(this.x*len, this.y*len, len, len);
    }

    //when backtracking occurs during DFS, it colors a pink to show the backtracking process
    this.backtracking = function()
    {
        content.fillStyle ="#F1948A ";
        content.fillRect(this.x*len, this.y*len, len, len);
    }
    
    //Colors the path used by DFS algorithum, it colors the path Red
    this.path = function()
    {
        if(this.visited)
        {
            content.fillStyle = "#1F618D";
            content.fillRect(this.x*len, this.y*len, len, len);   
        }
    }

    //Used to show the walls relative to the edges.
    //Draws a perpendicular wall among any edges shared between 2 vertex.
    this.show = function()
    {

        //runs for the number of edges each vertex has.
        for(var i = 0; i< this.edgeConnection.length; i++)
        {
            //top Wall using the edges which holds this vertex and its neighbouring vertex
            if((this.edgeConnection[i].vertex1 === index(this.y,this.x) && this.edgeConnection[i].vertex2 === index(this.y-1,this.x)))
            {
                content.beginPath();
                content.moveTo(this.x*len, this.y*len);
                content.lineTo(this.x*len+len, this.y*len);
                content.stroke();
            }

            //right Wall using the edges which holds this vertex and its neighbouring vertex
            if((this.edgeConnection[i].vertex1 === index(this.y,this.x) && this.edgeConnection[i].vertex2 === index(this.y,this.x+1)))
            {
                content.beginPath();
                content.moveTo(this.x*len+len, this.y*len);
                content.lineTo(this.x*len+len, this.y*len+len);
                content.stroke();
            }

            // down Wall using the edges which holds this vertex and its neighbouring vertex
            if((this.edgeConnection[i].vertex1 === index(this.y,this.x) && this.edgeConnection[i].vertex2 === index(this.y+1,this.x)))
            {
                content.beginPath();
                content.moveTo(this.x*len, this.y*len+len);
                content.lineTo(this.x*len+len, this.y*len+len);
                content.stroke();
            }

            //left Wall using the edges which holds this vertex and its neighbouring vertex
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

//Edge object that takes 2 vertex objects
//Edge has Vertex1, Vertex 2
//Edge also has a weight. 
function edge(vertex1, vertex2, weight)
{
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.weight = weight;

}

//board function to create the vertex and edges and a maze. 
function board()
{
    // function that creats maze grid using a double for loop
    // for each itteration for the for loop, it creates a new Vertex with y and x
    // it pushes that vertex into LinearVertex arraylist and sets the value to the Index from 0.. nXn
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

    //horizontal edge connection between 2 vertex, 
    //itterates from top row to bottom row and adds a horizontal edge between 2 vertex in each column 
    for(var y=0; y<n; y++)
    {
        for(var x = 0; x< n-1; x++)
        {
            //random variable r picks value from 0-10 and assigns it as the weight.
            //2 edges are created using Vertex1 to vertex2 and Vertex2 to Vertex1 with the same weight "r"
            //then it pushes the two edges with the corresponding weight into Edges array in the corresponding Grid "linearVertex"
            var r = Math.floor(Math.random()*10);
            var edge1 = new edge(linearVertex[index(y,x)].value, linearVertex[index(y,x+1)].value, r);
            var edge2 = new edge(linearVertex[index(y,x+1)].value, linearVertex[index(y,x)].value, r);
            linearVertex[index(y,x)].edgeConnection.push(edge1);
            linearVertex[index(y,x+1)].edgeConnection.push(edge2);  
        }

    }

    //Vertical edge connection between 2 vertex, 
    //itterates from top row to bottom row and adds a vertical edge between 2 vertex in each column 
    for(var y =0; y< n-1; y++)
    {
        for(var x = 0; x< n; x++)
        {
            //random variable r picks value from 0-10 and assigns it as the weight.
            //2 edges are created using Vertex1 to vertex2 and Vertex2 to Vertex1 with the same weight "r"
            //then it pushes the two edges with the corresponding weight into Edges array in the corresponding Grid "linearVertex"
            var r2 = Math.floor(Math.random()*10);
            var edgev1 = new edge(linearVertex[index(y,x)].value,linearVertex[(index(y+1,x))].value,r2);
            var edgev2 = new edge(linearVertex[index(y+1,x)].value,linearVertex[(index(y,x))].value,r2);
            linearVertex[index(y,x)].edgeConnection.push(edgev1);
            linearVertex[index(y+1,x)].edgeConnection.push(edgev2);

        }
    }


}

//Minium Spanning Tree function.
//Input used the Graph called linearVertex which stores the vertex value and edge objects
//Uses the pickrandom function defined at the top for a starting point to traverse the graph
//returns MST array
function mst()
{
    //v represents the total number of vertex.
    //Solution gets stored in MST as an array [starting Vertex, ending Vertex, Weight]
    //edges is used to find the minimum value among other edges.
    //visited is used so that the traversal only occurs in non visited vertex
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


//dfs algorithum, it takes the array of minimum spanning tree as a parameter.
function dfs(mstDFS)
{

    //Used to make a seperate graph called solution using all the vertex.
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

    //uses the MST array to create two edges between 2 vertex.
    //the MST array covers all the vertex, so every vertex will have an edge which will represent the graph for MST.
    for(var i =0; i<mstDFS.length; i++)
    {
        var edgeS1 = new edge(mstDFS[i][0],mstDFS[i][1],mstDFS[i][2]);
        var edgeS2 = new edge(mstDFS[i][1],mstDFS[i][0],mstDFS[i][2]);
        solution[mstDFS[i][0]].edgeConnection.push(edgeS1);
        solution[mstDFS[i][1]].edgeConnection.push(edgeS2)
    }
    //console.log(solution);

    //DFS algorithum starts here. 
    //starting at fist vertex from the MST array and a randomly chosen vertex as the ending using the pickrandom function defines the path for dfs alorithum
    //goes deep into the a path using, marking vertex visited and storing it into a stack
    //When no other unvisited path is left for the vertex, the stack pops until it finds a path then continues.
    //this occurs until the ending vertex is found to which the it ends this function.
    var stacks = [];
    starting = solution[mstDFS[0][0]];
    ending = solution[pickrandom().value];
    var path = [];
    stacks.push(starting);
    console.log(peek(stacks));

    //runs after MST has carved out the maze and then starts traversing the Maze
    setTimeout(function(){

        var stop =setInterval(function() 
        {
            //DFS algorithum which i described above
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
                    //this is when backtracking occurs and colors the backtracking pink
                    peek(stacks).backtracking();
                    stacks.pop();
                    
                }
                for(var i = 0; i< stacks.length;i++)
                {
                    //colors the current path red
                    stacks[i].highlighted();
                    //Always colors the starting vertex blue 
                    starting.startindex();
                }
            }
            //Else function runs when DFS finds the Ending vertex and then it draws the solution path
            else
            {
                // sets the ending to visited
                ending.visited = true;
                //changes the color for ending value since end has been found
                ending.highlighted();

                // until count is covers all the elements in the stack which holds the solution path
                //if any vertex is visted, it travels the path and colors the path dark blue.
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
                    //once the path has been drawn, it stops the timer
                    ending.path();
                    ending.endingindex();                   
                    clearInterval(stop);
                }


            }
            //Redraws the entire grid every iteration to show changes
            //Refreshes the screen
            for(var i=0; i< linearVertex.length; i++)
            {
                linearVertex[i].show();
            }
            content.rect(0,0,len*n,len*n);
            content.stroke();
            starting.startindex();
            ending.endingindex();

            //speedtravases and speed are defined at the top
        },speedtravase);

    },mstDFS.length*(speed));

    
    console.log(stacks);

}


//peek function to see the peek element of the stack.
function peek(Stack)
{
    return Stack[Stack.length-1]
}


//draw function used to draw and cave out the maze
//takes input parameter of MST array
function draw(mst)
{

    //This function runs until the entire maze has been carved by MST array
    var carve = setInterval(function() {
        
        //refreshes the viewing canvas so that changes can been seen
        content.clearRect(0,0,canvas.width,canvas.height)
        content.strokeStyle = "black";
        content.lineWidth =3;
        content.rect(0,0,len*n,len*n);
        content.stroke();

        //This is where the maze is carved using MST.
        //starting value is extracted out of the first index of the MST array and set to the corresponding starting vertex
        starting = linearVertex[mst[0][0]];

        //used to show the walls between all the vertexs in the maze and draws the starting vertex with a light blue color.
        //Displays the maze
        for(var i=0; i< linearVertex.length; i++)
        {
            linearVertex[i].show();
            starting.startindex();
        }

        //starts from the starting vertex and then removes all the edge connection using the MST array.
        //Eliminating all the edges which correspond to the MST array would display a maze as a byproduct
        if(count<mst.length)
        {
            //removes edges using MST from Vertex 1 to Vertex2 for the entire grid
            for(var j = 0; j< linearVertex[mst[count][0]].edgeConnection.length; j++)
            {
                if(linearVertex[mst[count][0]].edgeConnection[j].vertex2 === mst[count][1])
                {
                    linearVertex[mst[count][0]].edgeConnection.splice(j,1);
    
                }
            }

            //removes edges using MST from Vertex2 to Vertex1 for the entire grid
            for(var k= 0; k< linearVertex[mst[count][1]].edgeConnection.length; k++)
            {
                if( linearVertex[mst[count][1]].edgeConnection[k].vertex2 === mst[count][0])
                {
                    linearVertex[mst[count][1]].edgeConnection.splice(k,1);
    
                }
            }
        }
        //count is used as a way of stoping the timer
        count++;
        //when count has reached the length of MST then it has covered all the vertex and it can stop the timer
        if(count>mst.length)
        {
            clearInterval(carve);
        }
        
    },speed);
   
    //DFS function is called and passes the MST used by the draw function to show the dfs algorithum
    dfs(mst);

}

//runs the board function 
board();
console.log(linearVertex);


//variables used to see the mst and Graph in the console
var mstGraph = mst();
console.log(mstGraph);
console.log(linearVertex);

console.log(mstGraph[0][1]);
//Calls the draw function using the MST array.
draw(mstGraph);

