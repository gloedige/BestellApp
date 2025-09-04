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