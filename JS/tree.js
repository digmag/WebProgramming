var treeMap = new Map();
var button = document.getElementById("button");
var textField = document.getElementById("input");
var parentTag = document.getElementById("parent");

function StringToArray(string){
    let wordArr = string.split(",");
    return wordArr;
}

function appendBranch(map,array){
    if(array.length){
        let tmp = array.shift();
        if (map.has(tmp)){
            appendBranch(map.get(tmp),array);
        }
        else{
            map.set(tmp, new Map());
            appendBranch(map.get(tmp),array);
        }
    }
}

function createNestedListFromMap(map, parentElement) {
    const listElement = document.createElement("ul");
  
    map.forEach((value, key) => {
      const itemElement = document.createElement("li");
      itemElement.textContent = key;
  
      if (value instanceof Map) {
        createNestedListFromMap(value, itemElement);
      }
  
      listElement.appendChild(itemElement);
    });
  
    parentElement.appendChild(listElement);
  }

button.onclick = function(){
    parentTag.innerHTML = "";
    let arr = StringToArray(textField.value);
    appendBranch(treeMap, arr);
    createNestedListFromMap(treeMap, parentTag);
}
