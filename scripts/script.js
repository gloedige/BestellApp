let dishesInBasketArr = [];
let confirmationState = false;
document.addEventListener('click', closeDialog);

function handleBasketInteraction(event){
  let dishId = '';
  // hier ist die eigentliche Logik für increase, redúce und delete enthalten
  // Finde den relevanten Button
  let button = event.target.closest('button');
  if(!button){
    return;
  }
  // Finde den Container des Gerichts
  let dishContainer = button.closest('.single_dish');
  let singleDishInBasketContainer = button.closest('.single_dish_basket');
  // let orderButtonContainer = button.closest('.order_button');
  if (!dishContainer && !singleDishInBasketContainer){
    return;
  }
  // Hole ID des Gerichts aus dem Datenattribut
  if (dishContainer && singleDishInBasketContainer==null){
    dishId = dishContainer.dataset.dishId;
  }
  if (dishContainer==null && singleDishInBasketContainer){
    dishId = singleDishInBasketContainer.dataset.dishId;
  }

  // Implementierung der Logik basierend auf der Klasse des Buttons
  if (button.classList.contains('add_dish_button')){    
    addToBasket(dishId);
    enableOrderButton();
    increaseQuantity(dishId);
  }
  if (button.classList.contains('increase_quantity_button')){
    increaseQuantity(dishId);
  }
  if (button.classList.contains('reduce_quantity_button')){
    reduceQuantity(dishId);
  }
  if (button.classList.contains('delete_dish')){
    deleteFromBasket(dishId);
  }
  // if (button.classList.contains('order_button')){
  //   confirmOrder();
  // }

  renderBasketItems();
}

function handleFormSubmit(event){
  event.preventDefault();

  let submittedForm = event.target;
  
  if (!submittedForm){
    return;
  }
  if (submittedForm.classList.contains('formfield')){
    resetDishesInBasketArr();
    deleteBasketInLocalStorage();
    confirmOrder();
  }

  renderBasketItems();
}

function getBasketFromLocalStorage(){
  let storedDishes = localStorage.getItem('dishesInBasket');
  if (storedDishes){
    dishesInBasketArr = JSON.parse(storedDishes);
  }
}

function renderAllDishesToMenu(){
    let allDishesRef = document.getElementById('all_dishes');
    Object.keys(allDishes).forEach(function(key){
        let dishObj = allDishes[key];     
        allDishesRef.innerHTML += renderSingleDishSection(dishObj.name, dishObj); 
    });
}

function renderBasketItems(){
  let basketHtml = '';
  let invoiceHtml = '';

  if(dishesInBasketArr.length == 0 && confirmationState == false){
    basketHtml = `<p class="confirmation_message" id="basket_empty">Ihr Warenkorb ist leer.</p>`;
    document.getElementById('dishes_in_basket').classList.add("confirmation_message");
  }
  else if (dishesInBasketArr.length == 0 && confirmationState == true){
    basketHtml = renderOrderConfirmation();
  }
  else{
    basketHtml = dishesInBasketArr.map(dish => renderSingleDishInBasket(dish)).join('');
    document.getElementById('dishes_in_basket').classList.remove("confirmation_message");
  }

  let subtotal = calcTotalSum()[0];
  let total = calcTotalSum()[1];
  invoiceHtml = renderInvoiceOfBasket(subtotal, total);

  let mainBasketContainer = document.getElementById('dishes_in_basket');
  let mainBasketInvoiceContainer = document.getElementById('dishes_invoice');
  if (mainBasketContainer){
    mainBasketContainer.innerHTML = basketHtml;
  }
  if (mainBasketInvoiceContainer){
    mainBasketInvoiceContainer.innerHTML = invoiceHtml;
  }

  let dialogBasketContainer = document.getElementById('dialog_dishes_in_basket');
  let dialogBasketInvoiceContainer = document.getElementById('dialog_dishes_invoice');
  if (dialogBasketContainer){
    dialogBasketContainer.innerHTML = basketHtml;
  }
  if (dialogBasketInvoiceContainer){
    dialogBasketInvoiceContainer.innerHTML = invoiceHtml;
  }

}

function initFormField(){
  document.getElementById('confirm_order').innerHTML = renderSubmitOrderButton("main_basket_form");
  document.getElementById('dialog_confirm_order').innerHTML = renderSubmitOrderButton("dialog_basket_form");
  disableOrderButton();
}

function disableOrderButton(){
  if(checkIsBasketEmpty()){
    let buttonList = document.getElementsByClassName('order_button');
    for (let button of buttonList){
      button.disabled = true;
      button.classList.remove('order_button_hover');
    }
  }
}

function enableOrderButton(){
  if(!checkIsBasketEmpty()){
    let buttonList = document.getElementsByClassName('order_button');
    for (let button of buttonList){
      button.disabled = false;
      button.classList.add('order_button_hover');
    }
  }
}

function addToBasket(dishId){
    resetInfoOfBasketWhenEmpty();
    let singleDishObj = getDishObjectByDishName(dishId);
    if(!isDishExistentInBasket(dishId)){  
      dishesInBasketArr.push(singleDishObj);
    }
}

function deleteFromBasket(singleDishName){
  let singleDisheIndex = getIndexOfDishesInBasketArr(singleDishName);
  dishesInBasketArr.splice(singleDisheIndex,1);
  console.log(dishesInBasketArr);

  disableOrderButton();
  saveBasketInLocalStorage();
}

function toggleQuantityButtonImg(dishId){
    document.getElementById(dishId).classList.toggle("d_none");
}

function saveBasketInLocalStorage(){
  localStorage.setItem("dishesInBasketArr", JSON.stringify(dishesInBasketArr));
}

function increaseQuantity(singleDishName){
  let singleDisheIndex = getIndexOfDishesInBasketArr(singleDishName);
  dishesInBasketArr[singleDisheIndex].quantity = parseFloat(dishesInBasketArr[singleDisheIndex].quantity) + 1;
  
  saveBasketInLocalStorage();
}

function reduceQuantity(singleDishName){
  let singleDisheIndex = getIndexOfDishesInBasketArr(singleDishName);
  
  if(checkMiniumValueOfQuantity(singleDisheIndex)){
    dishesInBasketArr[singleDisheIndex].quantity = parseFloat(dishesInBasketArr[singleDisheIndex].quantity) - 1;
    saveBasketInLocalStorage();
  }
  else{
    deleteFromBasket(singleDishName);
  }
}

function checkMiniumValueOfQuantity(singleDisheIndex){
  if(dishesInBasketArr[singleDisheIndex].quantity>1){
    return true
  }
  else{
    return false
  }
}

function isDishExistentInBasket(singleDishName){
  let singleDishesInBasketArr = dishesInBasketArr.find(dish => dish.name === singleDishName);
  
  if(singleDishesInBasketArr){
    return true
  }
  else{
    return false
  }
}

function getIndexOfDishesInBasketArr(singleDishName){
  let singleDisheIndex = dishesInBasketArr.findIndex(dish => dish.name === singleDishName);
  return singleDisheIndex
}

function getDishObjectByDishName(singleDishName){
  let singleDishObj = allDishes.find(dish => dish.name === singleDishName);
  // make a deep copy of singleDishObj to keep object allDishes untouched
  let singleDishObjDeepCopy = JSON.parse(JSON.stringify(singleDishObj));
  return singleDishObjDeepCopy
}

function calcTotalSum(){
  let subtotal = 0;
  let total = 0;
  if(checkIsBasketEmpty()){
    return[0,0];
  }
  else{  
  let subtotalSum = dishesInBasketArr.reduce((sum, dish) => {
    return sum + (parseFloat(dish.price) * parseFloat(dish.quantity));
  }, 0);
  subtotal = subtotalSum;
  total = subtotal + deliveryCosts;

  return [subtotal, total];
  }
}

function confirmOrder(){
  confirmationState = true;
}

function resetInfoOfBasketWhenEmpty(){
  let confirmationRef = document.getElementById('confirmation_container'); 
  let basketEmptyRef = document.getElementById('basket_empty');
  if(confirmationRef != null){
    confirmationRef.remove(); 
  }
  if(basketEmptyRef != null){
    basketEmptyRef.remove();
  }
}

function deleteBasketInLocalStorage(){
  localStorage.removeItem("dishesInBasketArr");
}

function resetDishesInBasketArr(){
  dishesInBasketArr = [];
}

function checkIsBasketEmpty(){
  if(dishesInBasketArr.length==0){
    return true
  }
  else{
    return false
  }
}

function initDOMContentEventListener(){
  
  getBasketFromLocalStorage();
  renderAllDishesToMenu();
  renderBasketItems();
  initDialog();
  initFormField();
  confirmationState = false;
  
  document.getElementById('all_dishes').addEventListener('click', function(event){
    handleBasketInteraction(event);
  })

  document.getElementById('dishes_in_basket').addEventListener('click', function(event){
    handleBasketInteraction(event);
  });

  let dialogBasketContainer = document.getElementById('basket_dialog');
  if (dialogBasketContainer){
    dialogBasketContainer.addEventListener('click', function(event){
      handleBasketInteraction(event);
    });
  };

  let mainBasketForm = document.getElementById('main_basket_form');
  let dialogBasketForm = document.getElementById('dialog_basket_form');

  if (mainBasketForm){
    mainBasketForm.addEventListener('submit', function(event){
      console.log('EventListener Form wurde gestartet!');
      handleFormSubmit(event);
    });
  }
  if (dialogBasketForm){
    dialogBasketForm.addEventListener('submit', function(event){
      handleFormSubmit(event);
    })
  }
}

function initDialog(){
  let dialogRef = document.getElementById('basket_dialog');
  dialogRef.innerHTML = renderDialog();
  dialogRef.close();
}

function openDialog(){
  let dialogRef = document.getElementById('basket_dialog');
  dialogRef.showModal();
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

document.addEventListener('DOMContentLoaded', initDOMContentEventListener);