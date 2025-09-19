function renderSingleDishSection(dishId, singleDishObj){ // dishId is name of dish
  return `
          <div class="single_dish" id="${dishId}" data-dish-id="${dishId}">
            <div class="dish_attributes">
                <h4>${dishId}</h4>
                <p>${singleDishObj.description}</p>
                <p class="dish_price">${(singleDishObj.price).toFixed(2)}€</p>
            </div>
            <button class="add_dish_button">
                <img src="./assets/icons/add_60dp_FF8000.png" alt="add dish button">
            </button>
          </div>
         `
}

function renderSingleDishInBasket(singleDishObj){
  return `
          <div class="single_dish_basket" data-dish-id="${singleDishObj.name}">
            <p class="dishname_basket">${singleDishObj.name}</p>
            <div class="container_price_and_quantity">
                <button class="button_basket reduce_quantity_button">
                    <img src="./assets/icons/remove_60dp_FF8000.png" alt="remove dish" class="remove_icon">
                    <img src="./assets/icons/circle_40dp_FF8000.svg" alt="highlighted_button" class="circle_icon d_none">
                </button>
                <p id="quantity_of_single_dish:_${singleDishObj.name}" class="quantity_of_single_dish">${singleDishObj.quantity}</p>
                <button class="button_basket increase_quantity_button">
                    <img src="./assets/icons/add_60dp_FF8000.png" alt="add dish" class="add_icon">
                    <img src="./assets/icons/circle_40dp_FF8000.svg" alt="highlighted_button" class="circle_icon d_none">
                </button>
                <p id="total_price_of_single_dish:_${singleDishObj.name}" class="total_price_of_single_dish">${(singleDishObj.quantity * singleDishObj.price).toFixed(2)}€</p>
                <button class="button_basket delete_dish_button">
                    <img src="./assets/icons/delete_60dp_FF8000.png" alt="delete single dish" class="garbage_icon">
                    <img src="./assets/icons/circle_40dp_FF8000.svg" alt="highlighted_button" class="circle_icon d_none">
                </button>
              </div>
          </div>
         `
}

function renderInvoiceOfBasket(subtotal, total){
  return `
          <div class="subtotal_basket">
            <p>Zwischensumme</p>
            <p id="subtotal">${subtotal.toFixed(2)}€</p>
          </div>
          <div class="subtotal_basket">
              <p>Lieferkosten</p>
              <p id="delivery_costs">5.00€</p>
          </div>
          <div class="total_basket subtotal_basket">
              <p>Gesamt</p>
              <p id="total_costs">${total.toFixed(2)}€</p>
          </div>
         `
}

function renderSubmitOrderButton(id){
  return `
          <form class="formfield" id="${id}">
            <button class="order_button order_button_hover" type="submit" id="order_button">Bestellen</button>
          </form>
         `
}
         
function renderEmptyBasketInfo(){
  return `
          <p class="confirmation_message" id="basket_empty">Ihr Warenkorb ist leer.</p>
         `
}

function renderOrderConfirmation(){
  return `
          <div class="confirmation_container" id="confirmation_container">
            <p class="confirmation_message">Vielen Dank für Ihre Bestellung!</p>
          </div>
         `
}

function renderDialog(){
  return `
          <div class="container_dialog">
            <h3 class="basket_headline">Warenkorb</h3>
            <div class="dividing_line"></div>
            <div class="dishes_in_basket" id="dialog_dishes_in_basket"></div>
            <div class="dividing_line"></div>
            <div class="dishes_invoice" id="dialog_dishes_invoice"></div>
            <div class="confirm_order" id="dialog_confirm_order"></div>
          </div>
         `
}