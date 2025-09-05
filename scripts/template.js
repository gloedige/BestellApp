function renderSingleDishSection(dishId, singleDishObj){
  return `
          <div class="single_dish" onmouseover="highlightDish('${dishId}')" onmouseout="highlightDish('${dishId}')" id="${dishId}">
            <div class="dish_attributes">
                <h4>${dishId}</h4>
                <p>${singleDishObj.description}</p>
                <p class="dish_price">${(singleDishObj.price).toFixed(2)}€</p>
            </div>
            <button class="dish_button" onclick="addToBasket(${dishId})">
                <img src="./assets/icons/add_60dp_FF8000.png" alt="add dish button">
            </button>
          </div>
         `

}