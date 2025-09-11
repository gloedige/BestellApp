function renderSingleDishSection(dishId, singleDishObj){
  return `
          <div class="single_dish" onmouseover="highlightDish('${dishId}')" onmouseout="highlightDish('${dishId}')" id="${dishId}">
            <div class="dish_attributes">
                <h4>${dishId}</h4>
                <p>${singleDishObj.description}</p>
                <p class="dish_price">${(singleDishObj.price).toFixed(2)}€</p>
            </div>
            <button class="dish_button" onclick="addToBasket('${dishId}')">
                <img src="./assets/icons/add_60dp_FF8000.png" alt="add dish button">
            </button>
          </div>
         `

}

function renderSingleDishInBasket(singleDishObj){
  return `
          <div id='basket:_${singleDishObj.name}'>
            <p class="dishname_basket">${singleDishObj.name}</p>
            <div class="container_price_and_quantity">
                <button class="button_basket remove_button" onclick="reduceQuantity('${singleDishObj.name}')">
                    <img src="./assets/icons/remove_60dp_FF8000.png" alt="remove dish" class="remove_icon">
                    <img src="./assets/icons/remove_circle_60dp_FF8000.png" alt="remove dish" class="remove_circle_icon d_none">
                </button>
                <p id="quantity_of_single_dish:_${singleDishObj.name}" class="quantity_of_single_dish">${singleDishObj.quantity}</p>
                <button class="button_basket add_button" onclick="increaseQuantity('${singleDishObj.name}')">
                    <img src="./assets/icons/add_60dp_FF8000.png" alt="add dish" class="add_icon">
                    <img src="./assets/icons/add_circle_60dp_FF8000.png" alt="add dish" class="add_circle_icon d_none">
                </button>
                <p id="total_price_of_single_dish:_${singleDishObj.name}" class="total_price_of_single_dish">${singleDishObj.price.toFixed(2)}</p>
                <button class="button_basket" onclick="deleteFromBasket('${singleDishObj.name}')">
                    <img src="./assets/icons/delete_60dp_FF8000.png" alt="delete single dish">
                </button>
              </div>
          </div>
         `
}

function renderInvoiceOfBasket(){
  return `
          <div class="subtotal_basket">
            <p>Zwischensumme</p>
            <p id="subtotal">0.00€</p>
          </div>
          <div class="subtotal_basket">
              <p>Lieferkosten</p>
              <p id="delivery_costs">5.00€</p>
          </div>
          <div class="total_basket subtotal_basket">
              <p>Gesamt</p>
              <p id="total_costs">0.00€</p>
          </div>
         `
}

function renderSubmitOrderButton(){
  return `
          <form class="formfield" onsubmit="confirmOrder()">
            <button class="order_button order_button_hover" type="submit" id="order_button">Bestellen</button>
          </form>
         `
}

function renderOrderConfirmation(){
  return `
          <div class="confirmation_container" id="confirmation_container">
            <p class="confirmation_message">Vielen Dank für ihre Bestellung!</p>
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