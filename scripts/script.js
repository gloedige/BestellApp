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
        dishId = key;
        let singleDishObj = JSON.parse(localStorage.getItem(key));        
        allDishesRef.innerHTML += renderSingleDishSection(dishId, singleDishObj); 
    });
}

function highlightDish(dishId){
    document.getElementById(dishId).classList.toggle('light_orange_bg');
    
}

function addToBasket(dishId){
    let singleDishObj = JSON.parse(localStorage.getItem(dishId));
    setNewQuantity(singleDishObj);
    if(!isDishExistentInBasket(singleDishObj.name)){      
      let dishToBasketRef = document.getElementById('dishes_in_basket'); 
      dishToBasketRef.innerHTML += renderSingleDishInBasket(singleDishObj);
    }
    else{
      udpateQuantity(singleDishObj);
    }
}

function toggleQuantityButtonImg(dishId){
    document.getElementById(dishId).classList.toggle("d_none");
}

function setNewQuantity(singleDishObj){
  singleDishObj.quantity = ++singleDishObj.quantity;
  localStorage.setItem(singleDishObj.name, JSON.stringify(singleDishObj));
}

function isDishExistentInBasket(singleDishName){
  let idInBasketRef = document.getElementById("basket:_"+singleDishName);
  
  if(idInBasketRef){
    return true
  }
  else{
    return false
  }
}

function udpateQuantity(singleDishObj){
  let singleDishQuantityRef = document.getElementById("quantity_of_single_dish:_"+singleDishObj.name);
  // hier gehts weiter!!!
}

document.getElementById('dishes_in_basket').addEventListener("mouseover", function(event){
  let button = event.target.closest('.button_basket');

});