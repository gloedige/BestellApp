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
          <div>
            <p class="dishname_basket"></p>
            <div class="container_price_and_quantity">
                <button class="buton_basket">
                    <img src="./assets/icons/remove_60dp_FF8000.png" alt="remove dish">
                    <img src="./assets/icons/remove_circle_60dp_FF8000.png" alt="remove dish">
                </button>
                <p id="quantity_of_single_dish"></p>
                <button class="buton_basket">
                    <img src="./assets/icons/add_60dp_FF8000.png" alt="add dish">
                    <img src="./assets/icons/add_circle_60dp_FF8000.png" alt="add dish">
                </button>
                <p id="total_price_of_single_dish"></p>
                <button class="buton_basket">
                    <img src="./assets/icons/delete_60dp_FF8000.png" alt="delete single dish">
                </button>
              </div>
          </div>
         `

}