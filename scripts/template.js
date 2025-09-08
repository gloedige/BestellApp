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
                <button class="button_basket remove_button">
                    <img src="./assets/icons/remove_60dp_FF8000.png" alt="remove dish" class="remove_icon">
                    <img src="./assets/icons/remove_circle_60dp_FF8000.png" alt="remove dish" class="remove_circle_icon d_none">
                </button>
                <p id="quantity_of_single_dish:_${singleDishObj.name}" class="quantity_of_single_dish">${singleDishObj.quantity}</p>
                <button class="button_basket add_button">
                    <img src="./assets/icons/add_60dp_FF8000.png" alt="add dish" class="add_icon">
                    <img src="./assets/icons/add_circle_60dp_FF8000.png" alt="add dish" class="add_circle_icon d_none">
                </button>
                <p id="total_price_of_single_dish" class="total_price_of_single_dish">${singleDishObj.price.toFixed(2)}</p>
                <button class="button_basket" onclick="deleteDishFromBasket(${singleDishObj.name})">
                    <img src="./assets/icons/delete_60dp_FF8000.png" alt="delete single dish">
                </button>
              </div>
          </div>
         `

}