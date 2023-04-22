let population = [];
var position =[];
var num_of_dots = 0;



function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
            return true;
        }
    }
    return false;
}

function mutations(child){
    let mutationRate = Math.floor(Math.random()*100);
    if (Math.random() < mutationRate){
        let ind1 = 1 + Math.random()*child.length;
        let ind2 = 1 + Math.random()*child.length;
        let tmp = child[ind1];
        child[ind1] = child[ind2];
        child[ind2] = tmp;
    }
}

function path(x1,x2,y1,y2){
    return Math.sqrt(
        Math.pow(x1-x2, 2) + Math.pow(y1-y2,2)
    );
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    
    return [0].concat(array);
}

function createPopulation(array, Num_of_population){
    population =[];
    for(let i =0; i<Num_of_population; i++){
        population[i]=shuffle(array.slice(1));
    }
    return population;
}


function pathLength(arrays, positions){
    let arraysPlus = [];
    for (let i = 0; i < arrays.length; i++){
        let length = 0;
        for(let j = 0; j < arrays[i].length - 1; j++){
             length += path(
                positions[arrays[i][j]][0], positions[arrays[i][j+1]][0],
                positions[arrays[i][j]][1], positions[arrays[i][j+1]][1]);
        }
        length += path(
                positions[arrays[i][0]][0], positions[arrays[i][arrays[i].length - 1]][0],
                positions[arrays[i][0]][1], positions[arrays[i][arrays[i].length - 1]][1]);
        arraysPlus.push([arrays[i], length]);
    }
    return arraysPlus;
}

function sort(arraysPlus){ //arraysPlus[[[особь], длина пути]]
    for (let i = 0; i<arraysPlus.length-2; i++){
        for(let j = i; j<arraysPlus.length-1; j++){
            if (arraysPlus[i][1] >= arraysPlus[j][1]){
                let tmp = arraysPlus[j];
                arraysPlus[j] = arraysPlus[i];
                arraysPlus[i] = tmp;
            }
        }
    }
    return arraysPlus;
}


function generateChild(arraysPlus){
    let c = arraysPlus.length;
    console.log(c)
    let dot_of_gap = Math.floor(arraysPlus[0][0].length/2);
    for (let i = 0; i < c; i++){
        let firstParentIndex = Math.floor(Math.random()*c);
        let secondParentIndex = Math.floor(Math.random()*c);
        while (firstParentIndex == secondParentIndex){
            firstParentIndex = Math.floor(Math.random()*c);
            secondParentIndex = Math.floor(Math.random()*c);
        }
        let child1 = [];
        let child2 =[];
        for(let j = 0; j < dot_of_gap; j++){
            child1.push(arraysPlus[firstParentIndex][0][j]);
            child2.push(arraysPlus[secondParentIndex][0][j]);
        }
        for(let j = dot_of_gap; j < arraysPlus[i][0].length; j++){
            if (contains(child1, arraysPlus[secondParentIndex][0][j])){
                continue;
            }
            else{
                child1.push(arraysPlus[secondParentIndex][0][j]);
            }
            if (contains(child2, arraysPlus[firstParentIndex][0][j])){
                continue;
            }
            else{
                child2.push(arraysPlus[firstParentIndex][0][j]);
            }
        }
        for(let j = 0; j<arraysPlus[i][0].length; j++){
            if (!contains(child1, arraysPlus[firstParentIndex][0][j])){
                child1.push(arraysPlus[firstParentIndex][0][j]);
            }
            if (!contains(child2, arraysPlus[secondParentIndex][0][j])){
                child2.push(arraysPlus[secondParentIndex][0][j]);
            }
        }
        mutations(child1);
        mutations(child2);
        arraysPlus.push(pathLength([child1], position));
        arraysPlus.push(pathLength([child2], position));
        sort(arraysPlus);
        arraysPlus = arraysPlus.slice(0, arraysPlus.length-1 -1);
    }
    return arraysPlus;
}

var canvas = document.getElementById("mycanv");
var ctx = canvas.getContext("2d");
var num_of_dot = [];
var count = 0;

function draw(x,y){
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2*Math.PI, false);
    ctx.fillStyle = "black"
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

function showPath(pos, path){
    for(let i=0; i< path.length-1; i++){
        ctx.moveTo(pos[path[i]][0], pos[path[i]][1]);
        ctx.lineTo(pos[path[i+1]][0], pos[path[i+1]][1]);
        ctx.stroke();
    }
    ctx.moveTo(pos[path[path.length-1]][0], pos[path[path.length-1]][1]);
    ctx.lineTo(pos[path[0]][0], pos[path[0]][1]);
    ctx.stroke();
}

canvas.addEventListener('mousedown', function (e){
    let x = e.pageX - e.target.offsetLeft,
    y = e.pageY - e.target.offsetTop;
    draw(x,y);
    position.push([x,y]);
    num_of_dot[count] = count;
    count++;
});

var clear = document.getElementById("clear");
clear.onclick = function(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    console.clear();
}

var colcul = document.getElementById("calculating");
colcul.onclick = function(){
    let arr =[];
    arr = createPopulation(num_of_dot, count);
    //console.log(arr);
    arr = pathLength(arr, position);
    //console.log(arr);
    newnewarr = sort(arr);
    //console.log(arr);
    arr = generateChild(arr);
    console.log(arr);
    showPath(position, arr[0][0]);
}
