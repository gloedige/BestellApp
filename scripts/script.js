let dishId = "";
document.addEventListener('click', closeDialog);

function init(){
    if (localStorageIsCleared()){
        saveDishesInLocalStorage();
    }
    loadAllDishes();
    initInvoiceOfBasket();
    initFormField();
    initEventListener();
    initDialog();
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
  
function initInvoiceOfBasket(){
  document.getElementById("dishes_invoice").innerHTML = renderInvoiceOfBasket();
}

function initFormField(){
  document.getElementById('confirm_order').innerHTML = renderSubmitOrderButton();
  disableOrderButton();
}

function disableOrderButton(){
  if(checkIsBasketEmpty()){
    document.getElementById('order_button').disabled = true;
    document.getElementById('order_button').classList.remove('order_button_hover');
  };
}

function enableOrderButton(){
  document.getElementById('order_button').disabled = false;
  document.getElementById('order_button').classList.add('order_button_hover');
}

function highlightDish(dishId){
    document.getElementById(dishId).classList.toggle('light_orange_bg');
    
}

function addToBasket(dishId){
    resetOrderConfirmation();
    let singleDishObj = getDishObjectByDishName(dishId);
    if(!isDishExistentInBasket(singleDishObj.name)){      
      let dishToBasketRef = document.getElementById('dishes_in_basket'); 
      dishToBasketRef.innerHTML += renderSingleDishInBasket(singleDishObj);
      let dishToDialogRef = document.getElementById('dialog_dishes_in_basket'); 
      dishToDialogRef.innerHTML += renderSingleDishInBasket(singleDishObj);
    }
    else{
      updateQuantityInBasket(singleDishObj);
    }
    increaseQuantity(singleDishObj.name);
    updateSubtotalDisplay();
    updateTotalDisplay();
    enableOrderButton()
}

function deleteFromBasket(singleDishObjName){
  document.getElementById("basket:_"+singleDishObjName).remove();
  let dishId = singleDishObjName;
  let singleDishObj = getDishObjectByDishName(dishId);
  resetQuantityOfDishInLocalStorage(singleDishObj);
  updateSubtotalDisplay();
  updateTotalDisplay();
  disableOrderButton();
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
  updateSubtotalDisplay();
  updateTotalDisplay();
}

function reduceQuantity(singleDishName){
  let singleDishObj = getDishObjectByDishName(singleDishName)
  if(checkMiniumValueOfQuantity(singleDishObj)){
    singleDishObj.quantity = parseInt(singleDishObj.quantity) - 1;
    updateDisheInLocalStorage(singleDishObj);
    updateQuantityInBasket(singleDishObj);
    totalPriceOfSingleDish(singleDishObj);
    updateSubtotalDisplay();
    updateTotalDisplay();
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

function updateSubtotalDisplay(){
 let subtotalRef = document.getElementById('subtotal');
 let finalSum = calcTotalSum();
 subtotalRef.innerHTML = finalSum.toFixed(2) + "€";
}

function calcTotalSum(){
  let allDishesArr = allItemsOfLocalStorage();

  let total = allDishesArr.reduce((sum, dish) => {
    return sum + (parseFloat(dish.price) * parseFloat(dish.quantity));
  }, 0);

  return total;
}

function allItemsOfLocalStorage(){
  let allDishesArr = [];

  Object.keys(localStorage).forEach(function(key){
    allDishesArr.push(JSON.parse(localStorage.getItem(key)));
    });
  
  return allDishesArr
}

function updateTotalDisplay(){
  let totalRef = document.getElementById('total_costs');
  let subTotalSum = calcTotalSum();
  if(subTotalSum == 0){
    totalRef.innerHTML = "0.00€";
  }
  else{
    let finalSum = subTotalSum + deliveryCosts;
    totalRef.innerHTML = finalSum.toFixed(2) + "€";
  }
}

function confirmOrder(){
  let confirmMessage = document.getElementById('dishes_in_basket');
  confirmMessage.innerHTML = renderOrderConfirmation();
  initInvoiceOfBasket();
  resetQuantityInLocalStorage();
}

function resetOrderConfirmation(){
  let divToRemove = document.getElementById('confirmation_container'); 
  if(divToRemove != null){
    divToRemove.remove(); 
  }
}

function resetQuantityInLocalStorage(){
  Object.keys(localStorage).forEach(function(key){
    let singleDishObj = JSON.parse(localStorage.getItem(key));
    singleDishObj.quantity = 0;
    updateDisheInLocalStorage(singleDishObj);
    });
}

function checkIsBasketEmpty(){
  if(calcTotalSum()==0){
    return true
  }
  else{
    return false
  }
}

function initEventListener(){
  let form = document.querySelector('form');
  form.addEventListener('submit', function(event){
    event.preventDefault();
  });
}

function initDialog(){
  let dialogRef = document.getElementById('basket_dialog');
  dialogRef.innerHTML = renderDialog();
  dialogRef.close();
}

function openDialog(){
  let dialogRef = document.getElementById('basket_dialog');
  dialogRef.showModal();
   
  updateDialog();
}

function closeDialog(event){
    let dialogRef = document.getElementById('basket_dialog');
    if(event.target.contains(dialogRef) || event.target.id==""){
        dialogRef.close();
    }
    else{
        return;
    }
}

function updateDialog(){

}