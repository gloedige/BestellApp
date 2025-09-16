// let dishId = "";
let dishesInBasketArr = [];
document.addEventListener('click', closeDialog);

function init(){
    // getBasketFromLocalStorage();
    renderAllDishesToMenu();
    // initInvoiceOfBasket();
    initFormField();
    // initDOMContentEventListener();
    initDialog();
}

function handleBasketInteraction(event){
  // hier ist die eigentliche Logik für increase, redúce und delete enthalten
  // Finde den relevanten Button
  let button = event.target.closest('button');
  if(!button){
    return;
  }
  // Finde den Container des Gerichts
  let dishContainer = button.closest('.single_dish');
  if(!dishContainer){
    return;
  }
  // Hole ID des Gerichts aus dem Datenattribut
  let dishId = dishContainer.dataset.dishId;

  // Implementierung der Logik basierend auf der Klasse des Buttons
  if(button.classList.contains('add_dish_button')){    
    addToBasket(dishId);
    enableOrderButton()
  }
  increaseQuantity(dishId);
  

  renderBasketItems();
}

function setBasketToLocalStorage(){
  localStorage.setItem('dishesInBasket', JSON.stringify(dishesInBasketArr));
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
  if(dishesInBasketArr.length == 0){
    basketHtml = `<p class="confirmation_message" id="basket_empty">Ihr Warenkorb ist leer.</p>`;
    document.getElementById('dishes_in_basket').classList.add("confirmation_message");
  }
  else{
    basketHtml = dishesInBasketArr.map(dish => renderSingleDishInBasket(dish).join(''));
    document.getElementById('dishes_in_basket').classList.remove("confirmation_message");
  }

  let subtotal = calcTotalSum()[0];
  let total = calcTotalSum()[1];

  invoiceHtml = renderInvoiceOfBasket(subtotal, total);


  //render Rechnungsübersicht
  // let singlePriceRef = document.getElementById("total_price_of_single_dish:_"+singleDishObj.name);
  // singlePriceRef.innerHTML = (singleDishObj.quantity * singleDishObj.price).toFixed(2)+"€";

  let mainBasketContainer = document.getElementById('dishes_in_basket');
  let mainBasketInvoiceContainer = document.getElementById('dishes_invoice');
  if (mainBasketContainer){
    mainBasketContainer.innerHTML = basketHtml;
  }
  if (mainBasketInvoiceContainer){
    mainBasketInvoiceContainer.innerHTML = invoiceHtml;
  }

  let dialogBasketContainer = document.getElementById('basket_dialog');
  if (dialogBasketContainer){
    dialogBasketContainer.innerHTML = basketHtml;
  }

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
  if(checkIsBasketEmpty){
    document.getElementById('order_button').disabled = false;
    document.getElementById('order_button').classList.add('order_button_hover');
  }
}

function addToBasket(dishId){
    resetInfoOfBasketWhenEmpty();
    let singleDishObj = getDishObjectByDishName(dishId);
    if(!isDishExistentInBasket(dishId)){  
      dishesInBasketArr.push(singleDishObj);
      
      // let dishToBasketRef = document.getElementById('dishes_in_basket'); 
      // dishToBasketRef.innerHTML += renderSingleDishInBasket(singleDishObj);
      // let dishToDialogRef = document.getElementById('dialog_dishes_in_basket'); 
      // dishToDialogRef.innerHTML += renderSingleDishInBasket(singleDishObj);
    }
}

function deleteFromBasket(singleDishObjName){
  document.getElementById("basket:_"+singleDishObjName).remove();
  let dishId = singleDishObjName;
  let singleDishObj = getDishObjectByDishName(dishId);
  resetQuantityOfDishInLocalStorage(singleDishObj);
  updateSubtotalDisplay();
  disableOrderButton();
}

function resetQuantityOfDishInLocalStorage(singleDishObj){
  singleDishObj.quantity = 0;
  saveBasketInLocalStorage();
}

function toggleQuantityButtonImg(dishId){
    document.getElementById(dishId).classList.toggle("d_none");
}

function saveBasketInLocalStorage(){
  localStorage.setItem("dishesInBasketArr", JSON.stringify(dishesInBasketArr));
}

function increaseQuantity(singleDishName){
  // let singleDishObj = getDishObjectByDishName(singleDishName);
  let singleDisheIndex = getIndexOfDishesInBasketArr(singleDishName);
  dishesInBasketArr[singleDisheIndex].quantity = parseFloat(dishesInBasketArr[singleDisheIndex].quantity) + 1;


  
  saveBasketInLocalStorage();
  // updateQuantityInBasket(singleDishObj);
  totalPriceOfSingleDish(singleDishObj);
  updateSubtotalDisplay();
}

function reduceQuantity(singleDishName){
  let singleDishObj = getDishObjectByDishName(singleDishName)
  if(checkMiniumValueOfQuantity(singleDishObj)){
    singleDishObj.quantity = parseInt(singleDishObj.quantity) - 1;
    saveBasketInLocalStorage();
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
  let singleDishesInBasketArr = dishesInBasketArr.find(dish => dish.name === singleDishName);
  // let idInBasketRef = document.getElementById("basket:_"+singleDishName);
  
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

// function updateQuantityInBasket(singleDishObj){
//   // let singleDishQuantityRef = document.getElementById("quantity_of_single_dish:_"+singleDishObj.name);

//   singleDishQuantityRef.innerHTML = singleDishObj.quantity;
// }

function getDishObjectByDishName(singleDishName){
  let singleDishObj = allDishes.find(dish => dish.name === singleDishName);
  return singleDishObj
}

function totalPriceOfSingleDish(singleDishObj){
  //hier soll nur der Gesamtpreis pro Gericht errechnet und zurückgegeben werden
  
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
  subtotal = subtotalSum.toFixed(2) 
  let finalSum = subtotal + deliveryCosts;
  total = finalSum.toFixed(2);

  return [subtotal, total];
  }
}

function allItemsOfLocalStorage(){
  let allDishesArr = [];

  Object.keys(localStorage).forEach(function(key){
    allDishesArr.push(JSON.parse(localStorage.getItem(key)));
    });
  
  return allDishesArr
}

// function updateTotalDisplay(){
//   let totalRef = document.getElementById('total_costs');
//   let subTotalSum = calcTotalSum();
//   if(subTotalSum == 0){
//     totalRef.innerHTML = "0.00€";
//   }
//   else{
//     let finalSum = subTotalSum + deliveryCosts;
//     totalRef.innerHTML = finalSum.toFixed(2) + "€";
//   }
// }

function confirmOrder(){
  let confirmMessage = document.getElementById('dishes_in_basket');
  confirmMessage.innerHTML = renderOrderConfirmation();
  // initInvoiceOfBasket();
  resetQuantityInLocalStorage();
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

function resetQuantityInLocalStorage(){
  Object.keys(localStorage).forEach(function(key){
    let singleDishObj = JSON.parse(localStorage.getItem(key));
    singleDishObj.quantity = 0;
    saveBasketInLocalStorage();
    });
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
  renderBasketItems();
  
  document.getElementById('all_dishes').addEventListener('click', function(event){
    handleBasketInteraction(event);
  })

  document.getElementById('dishes_in_basket').addEventListener('click', function(event){
    handleBasketInteraction(event);
  });

  let dialogBasketContainer = document.getElementById('basket_dialog');
  if(dialogBasketContainer){
    dialogBasketContainer.addEventListener('click', function(event){
      handleBasketInteraction(event);
    });
  };

  let form = document.querySelector('form');
  if (form){
    form.addEventListener('submit', function(event){
    event.preventDefault();
    });
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