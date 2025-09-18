let dishesInBasketArr = [];
let confirmationState = false;


function handleBasketInteraction(event){
  let button = getButtonFromEvent(event);
  if(!button){return;}
  let containerArr = getContainerFromEventBubbling(button);
  if (containerArr.length == 0){return;}

  let dishId = getIdFromDataset(dishContainer=containerArr[0], singleDishInBasketContainer=containerArr[1]);
  // Implementierung der Logik basierend auf der Klasse des Buttons
  if (button.classList.contains('add_dish_button')){addToBasket(dishId);
                                                    enableOrderButton();
                                                    increaseQuantity(dishId);}
  if (button.classList.contains('increase_quantity_button')){increaseQuantity(dishId);}
  if (button.classList.contains('reduce_quantity_button')){reduceQuantity(dishId);}
  if (button.classList.contains('delete_dish_button')){deleteFromBasket(dishId);}
  renderBasketItems();
}

function getButtonFromEvent(event){
  let button = event.target.closest('button');
  return button;
}

function getContainerFromEventBubbling(button){
  let dishContainer = button.closest('.single_dish');
  let singleDishInBasketContainer = button.closest('.single_dish_basket');
  return [dishContainer, singleDishInBasketContainer];
}

function getIdFromDataset(dishContainer, singleDishInBasketContainer){
  let dishId = '';
  if (dishContainer && singleDishInBasketContainer==null){
    dishId = dishContainer.dataset.dishId;
  }
  if (dishContainer==null && singleDishInBasketContainer){
    dishId = singleDishInBasketContainer.dataset.dishId;
  }
  return dishId;
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
    disableOrderButton();
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
  let basketHtml = renderContainerDishesInBasket();
  let invoiceHtml = renderInvoiceOfBasket(subtotal=calcTotalSum()[0], total=calcTotalSum()[1]);

  let mainBasketContainer = document.getElementById('dishes_in_basket');
  let mainBasketInvoiceContainer = document.getElementById('dishes_invoice');
  if (mainBasketContainer){mainBasketContainer.innerHTML = basketHtml;}
  if (mainBasketInvoiceContainer){mainBasketInvoiceContainer.innerHTML = invoiceHtml;}

  let dialogBasketContainer = document.getElementById('dialog_dishes_in_basket');
  let dialogBasketInvoiceContainer = document.getElementById('dialog_dishes_invoice');
  if (dialogBasketContainer){dialogBasketContainer.innerHTML = basketHtml;}
  if (dialogBasketInvoiceContainer){dialogBasketInvoiceContainer.innerHTML = invoiceHtml;}
}

function renderContainerDishesInBasket(){
  let basketHtml = '';
  if(dishesInBasketArr.length == 0 && confirmationState == false){
    basketHtml = renderEmptyBasketInfo();
    document.getElementById('dishes_in_basket').classList.add("confirmation_message");
  }
  else if (dishesInBasketArr.length == 0 && confirmationState == true){
    basketHtml = renderOrderConfirmation();
    document.getElementById('dishes_in_basket').classList.add("confirmation_message");
  }
  else{
    basketHtml = dishesInBasketArr.map(dish => renderSingleDishInBasket(dish)).join('');
    document.getElementById('dishes_in_basket').classList.remove("confirmation_message");
  }
  return basketHtml;
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
  if (checkIsBasketEmpty()){
    confirmationState = false;
  }
  resetInfoOfBasketWhenEmpty();
  let singleDishObj = getDishObjectByDishName(dishId);
  if(!isDishExistentInBasket(dishId)){  
    dishesInBasketArr.push(singleDishObj);
  }
}

function deleteFromBasket(singleDishName){
  let singleDisheIndex = getIndexOfDishesInBasketArr(singleDishName);
  dishesInBasketArr.splice(singleDisheIndex,1);

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
  confirmationState = false;
  getBasketFromLocalStorage();
  renderAllDishesToMenu();
  renderBasketItems();
  initDialog();
  initFormField();

  initDishMenuEventListener();
  initBasketMainEventListener();
  initBasketDialogEventListener();

  initFormFieldMainEventListener();
  initFormFieldDialogEventListener();

  closeDialog();
}
  
  
function initDishMenuEventListener(){
  document.getElementById('all_dishes').addEventListener('click', function(event){
  handleBasketInteraction(event);})
}
    
function initBasketMainEventListener(){
  document.getElementById('dishes_in_basket').addEventListener('click', function(event){
    handleBasketInteraction(event);});
}

function initBasketDialogEventListener(){
  let dialogBasketContainer = document.getElementById('basket_dialog');
  if (dialogBasketContainer){
    dialogBasketContainer.addEventListener('click', function(event){
    handleBasketInteraction(event);});
  };
}

function initFormFieldMainEventListener(){
  let mainBasketForm = document.getElementById('main_basket_form');
  if (mainBasketForm){
    mainBasketForm.addEventListener('submit', function(event){handleFormSubmit(event);});
  }
}

function initFormFieldDialogEventListener(){
  let dialogBasketForm = document.getElementById('dialog_basket_form');
  if (dialogBasketForm){
    dialogBasketForm.addEventListener('submit', function(event){handleFormSubmit(event);})
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

function closeDialog(){
    let dialogRef = document.getElementById('basket_dialog');
    dialogRef.addEventListener('click', ((event) => {
      let rect = event.target.getBoundingClientRect();if (rect.left > event.clientX ||
          rect.right < event.clientX ||
          rect.top > event.clientY ||
          rect.bottom < event.clientY
      ) {
          dialogRef.close();
      }
    })
  );
    // if(event.target.contains(dialogRef) || event.target.id==""){
    // if(event.target.id==""){
    //     dialogRef.close();
    // }
    // else{
    //     return;
    // }
}

document.addEventListener('DOMContentLoaded', initDOMContentEventListener);