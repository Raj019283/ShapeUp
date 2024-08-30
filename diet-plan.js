const apiKey = 'db7e2ce7e7cd4919a8c113a0033e6a7c';

document.getElementById('createDietButton').addEventListener('click', () => {
    const dietType = document.querySelector('input[name="diet"]:checked');
    if (!dietType) {
        alert('Please select a diet type!');
        return;
    }
    document.querySelector('.hide').style.display = "none";
    document.querySelector('.container').style.display = "none";
    document.getElementById('todoDiet').classList.remove('hide');
});

document.getElementById('createWorkoutButton').addEventListener('click', () => {
    document.querySelector('.hide').style.display = "none";
    document.querySelector('.container').style.display = "none";
    document.getElementById('todoWorkout').classList.remove('hide');
});

document.getElementById('addWorkoutButton').addEventListener('click', () => {
    const workoutInput = document.getElementById('workoutInput').value;
    if (workoutInput.trim()) {
        addToList('workoutList', workoutInput);
        document.getElementById('workoutInput').value = '';
    }
});

function addToList(listId, item) {
    const list = document.getElementById(listId);
    const listItem = document.createElement('li');
    listItem.textContent = item;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => listItem.remove());

    listItem.appendChild(removeButton);
    list.appendChild(listItem);
}

async function fetchFoodNutrition(foodName) {
    try {
        const response = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${foodName}&number=1&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.results.length > 0) {
            const foodId = data.results[0].id;

            const nutritionResponse = await fetch(`https://api.spoonacular.com/food/ingredients/${foodId}/information?amount=100&unit=gram&apiKey=${apiKey}`);
            const nutritionData = await nutritionResponse.json();

            const nutritionInfo = {
                name: nutritionData.name,
                protein: nutritionData.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0,
                carbs: nutritionData.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
                fat: nutritionData.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0
            };

            addFoodToList(nutritionInfo);
        } else {
            console.error('Food item not found.');
            alert('Food item not found. Please try a different name.');
        }
    } catch (error) {
        console.error('Error fetching food nutrition data:', error);
    }
}

function addFoodToList(food) {
    const list = document.getElementById('foodList');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>${food.name}</strong>: 
        Protein: ${food.protein}g, 
        Carbs: ${food.carbs}g, 
        Fat: ${food.fat}g
    `;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => listItem.remove());

    listItem.appendChild(removeButton);
    list.appendChild(listItem);
}

document.getElementById('addFoodButton').addEventListener('click', () => {
    const foodInput = document.getElementById('foodInput').value;
    if (foodInput.trim()) {
        fetchFoodNutrition(foodInput);
        document.getElementById('foodInput').value = ''; // Clear input field
    } else {
        alert('Please enter a food item name.');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const calories = localStorage.getItem("calories");
    if (calories) {
        document.getElementById("calories").textContent = calories;
    } else {
        document.getElementById("calories").textContent = '0';
    }
});


