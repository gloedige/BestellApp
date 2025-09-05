let dishId = "";

function init(){
    if (localStorageIsCleared()){
        saveDishesInLocalStorage();
    }
    loadAllDishes();
}


function localStorageIsCleared() {
  if (localStorage.length!=0){
    return false; 
  }
  else{
    return true;
  }
}

function saveDishesInLocalStorage(){
  for (let index = 0; index < allDishes.length; index++) {
    let dishJSON = JSON.stringify(allDishes[index])
    localStorage.setItem(allDishes[index].name, dishJSON);
  }
}

function loadAllDishes(){
    let allDishesRef = document.getElementById('all_dishes');
    Object.keys(localStorage).forEach(function(key){
        console.log(key);
        dishId = key;
        let singleDishObj = JSON.parse(localStorage.getItem(key));        
        allDishesRef.innerHTML += renderSingleDishSection(dishId, singleDishObj); 
    });
}

function highlightDish(dishId){
    document.getElementById(dishId).classList.toggle('light_orange_bg');
    
}