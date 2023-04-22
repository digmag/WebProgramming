var n = document.getElementById("size").value;
var table = document.getElementById("table");
var start = null;
var end = null;
var impassables = new Set();

var clearMap = document.getElementById("clearMap");
clearMap.onclick =function() {
    n = document.getElementById("size").value;
    var newTable = document.createElement("table");

    var startPoint = 0;
    var endPoint = 0;
    var help_per = 0;

    for (var i = 0; i < n; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < n; j++) {
            var cell = document.createElement("td");
            cell.dataset.x = j;
            cell.dataset.y = i;
            cell.addEventListener("click", function() {
                if (start == null && !impassables.has(this)) {
                    start = this;
                    this.classList.add("classstart");
                    this.help_per = 1;
                } else if (end == null && start != null && !impassables.has(this)) {
                    end = this;
                    this.classList.add("classend");
                    this.help_per = 1;
                } else if (start != null && end != null && this != start && this != end) {
                    //если старт и энд хотя бы кто-то равен this то можно будет закрасить цветную ячейку в черный и она пропадет
                    if (!impassables.has(this)) {
                        impassables.add(this);
                        this.classList.add("classbl");
                        this.help_per = 1;
                    } else {
                        impassables.delete(this);
                        this.classList.remove("classbl");
                        this.help_per = 1;
                    }
                }
            });
            row.appendChild(cell);
        }
        newTable.appendChild(row);
    }

    table.parentNode.replaceChild(newTable, table);

    // Сбрасываем переменные и состояние
    table = newTable;
    start = null;
    end = null;
    impassables.clear();
}

var findPathButton = document.getElementById("findPathButton");
findPathButton.onclick = function() {
    // Удаляем старый путь

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var cell = table.rows[i].cells[j];
            cell.classList.remove("path");
        }
    }

    // Ищем путь 
    if (start == null || end == null) {
        alert("Укажите стартовую и конечную клетки!");
    } else {
        var openSet = new Set([start]);
        var cameFrom = new Map();
        var gScore = new Map([
            [start, 0]
        ]);
        var fScore = new Map([
            [start, rast(start, end)]
        ]);
        while (openSet.size > 0) {
            var current = getLowestFScore(openSet, fScore);
            if (current == end) {
                showPath(cameFrom, end);
                return;
            }
            openSet.delete(current);
            for (var neighbor of getNeighbors(current)) {
                var tentativeGScore = gScore.get(current);
                if (impassables.has(neighbor)) {
                    continue;
                } else if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore); //фактический путь
                    fScore.set(
                        neighbor,
                        tentativeGScore + rast(neighbor, end)
                    ); //прогнозируемый путь
                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                        if (neighbor != end){
                            neighbor.classList.add("par");
                        }
                    }
                }
            }
        }
        alert("Путь не найден!");
    }
}

function getLowestFScore(set, scores) {
    // Находим элемент из множества с наименьшим значением fScore
    var lowest = null;
    var lowestScore = Infinity;
    for (var elem of set) {
        if (scores.get(elem) < lowestScore) {
            lowest = elem;
            lowestScore = scores.get(elem);
        }
    }
    return lowest;
}

function getNeighbors(cell) {
    // Получаем соседние ячейки
    var neighbors = new Set();
    var x = cell.cellIndex;
    var y = cell.parentNode.rowIndex;
    if (x > 0) {
        neighbors.add(table.rows[y].cells[x - 1]);
        if(table.rows[y].cells[x - 1].help_per != 1){
            table.rows[y].cells[x - 1].classList.add("par");
        }
    }
    if (x < n - 1) {
        neighbors.add(table.rows[y].cells[x + 1]);
        if(table.rows[y].cells[x + 1].help_per != 1){
            table.rows[y].cells[x + 1].classList.add("par");
        }
    }
    if (y > 0) {
        neighbors.add(table.rows[y - 1].cells[x]);
        if(table.rows[y - 1].cells[x].help_per != 1){
            table.rows[y - 1].cells[x].classList.add("par");
        }
    }
    if (y < n - 1) {
        neighbors.add(table.rows[y + 1].cells[x]);
        if(table.rows[y + 1].cells[x].help_per != 1){
            table.rows[y + 1].cells[x].classList.add("par");
        }
    }

    return neighbors;
}

function rast(a, b) {
    // Вычисляем  расстояние между двумя клетками
    var x1 = a.cellIndex;
    var y1 = a.parentNode.rowIndex;
    var x2 = b.cellIndex;
    var y2 = b.parentNode.rowIndex;
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function showPath(cameFrom, current) {
    // Отображаем найденный путь
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        if (current != start) {
            current.classList.remove("par");
            current.classList.add("path");
        }
    }
}