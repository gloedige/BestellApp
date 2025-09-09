let dishId = "";
let invoiceArr =  [
                  {"subtotal": 0},
                  {"delivery_costs": 5},
                  {"total_costs": 0}
                  ];  

function init(){
    if (localStorageIsCleared()){
        saveDishesInLocalStorage();
    }
    loadAllDishes();
    initInvoiceOfBasket();
  }
  
function initInvoiceOfBasket(){}
  let subtotalRef = invoiceArr[0].subtotal;
  let deliveryCostsRef = invoiceArr[1].delivery_costs;
  let totalCostsRef = invoiceArr[2].total_costs;
  document.getElementById("dishes_invoice").innerHTML = renderInvoiceOfBasket(subtotalRef, deliveryCostsRef, totalCostsRef);

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
    let singleDishObj = getDishObjectByDishName(dishId);
    if(!isDishExistentInBasket(singleDishObj.name)){      
      let dishToBasketRef = document.getElementById('dishes_in_basket'); 
      dishToBasketRef.innerHTML += renderSingleDishInBasket(singleDishObj);
    }
    else{
      updateQuantityInBasket(singleDishObj);
    }
    increaseQuantity(singleDishObj.name);
}

function deleteFromBasket(singleDishObjName){
  document.getElementById("basket:_"+singleDishObjName).remove();
  let dishId = singleDishObjName;
  let singleDishObj = getDishObjectByDishName(dishId);
  resetQuantityOfDishInLocalStorage(singleDishObj);
}

function resetQuantityOfDishInLocalStorage(singleDishObj){
  singleDishObj.quantity = 0;
  updateDisheInLocalStorage(singleDishObj);
}

function toggleQuantityButtonImg(dishId){
    document.getElementById(dishId).classList.toggle("d_none");
}

function updateDisheInLocalStorage(singleDishObj){
  localStorage.setItem(singleDishObj.name, JSON.stringify(singleDishObj));
}

function increaseQuantity(singleDishName){
  let singleDishObj = getDishObjectByDishName(singleDishName);
  singleDishObj.quantity = parseInt(singleDishObj.quantity) + 1;
  updateDisheInLocalStorage(singleDishObj);
  updateQuantityInBasket(singleDishObj);
  totalPriceOfSingleDish(singleDishObj);
}

function reduceQuantity(singleDishName){
  let singleDishObj = getDishObjectByDishName(singleDishName)
  if(checkMiniumValueOfQuantity(singleDishObj)){
    singleDishObj.quantity = parseInt(singleDishObj.quantity) - 1;
    updateDisheInLocalStorage(singleDishObj);
    updateQuantityInBasket(singleDishObj);
    totalPriceOfSingleDish(singleDishObj);
  }
  else{
    deleteFromBasket(singleDishObj.name);
  }
}

function checkMiniumValueOfQuantity(singleDishObj){
  if(singleDishObj.quantity>1){
    return true
  }
  else{
    return false
  }
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

function updateQuantityInBasket(singleDishObj){
  let singleDishQuantityRef = document.getElementById("quantity_of_single_dish:_"+singleDishObj.name);
  singleDishQuantityRef.innerHTML = singleDishObj.quantity;
}

function getDishObjectByDishName(singleDishName){
  let dishId = singleDishName;
  let singleDishObj = JSON.parse(localStorage.getItem(dishId));
  return singleDishObj
}

function totalPriceOfSingleDish(singleDishObj){
  let singlePriceRef = document.getElementById("total_price_of_single_dish:_"+singleDishObj.name);
  singlePriceRef.innerHTML = (singleDishObj.quantity * singleDishObj.price).toFixed(2)+"€";
}

document.getElementById('dishes_in_basket').addEventListener("mouseover", function(event){
  let button = event.target.closest('.button_basket');

});