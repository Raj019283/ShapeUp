const apiKey = 'db7e2ce7e7cd4919a8c113a0033e6a7c';

document.getElementById('createDietButton').addEventListener('click', () => {
    const dietType = document.querySelector('input[name="diet"]:checked');
    if (!dietType) {
        alert('Please select a diet type!');
        return;
    }
    const mealsPerDay = parseInt(prompt('How many meals per day? Choose 3, 4, or 5:', '3'));
    if ([3, 4, 5].includes(mealsPerDay)) {
        fetchPredefinedDietPlan(dietType, mealsPerDay);
    } else {
        alert('Please enter a valid number of meals (3, 4, or 5).');
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

async function fetchPredefinedDietPlan(dietType, mealsPerDay) {
    const calorieIntake = parseInt(localStorage.getItem('calories')) || 2000;
    const mealCalories = Math.floor(calorieIntake / mealsPerDay);
    const dietQuery = dietType === 'veg' ? 'vegetarian' : 'non-vegetarian';
    
    try {
        const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=${calorieIntake}&diet=${dietQuery}&apiKey=${apiKey}`);
        const data = await response.json();
        displayPredefinedPlan(data.meals, mealCalories, mealsPerDay);
    } catch (error) {
        console.error('Error fetching the predefined diet plan:', error);
    }
}

function displayPredefinedPlan(meals, mealCalories, mealsPerDay) {
    const dishesContainer = document.getElementById('dishesContainer');
    dishesContainer.innerHTML = '';

    meals.forEach((meal, index) => {
        if (index < mealsPerDay) {
            const mealElement = document.createElement('div');
            mealElement.className = 'dish';
            mealElement.innerHTML = `
                <h3>${meal.title}</h3>
                <img src="https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg" alt="${meal.title}" />
                <p>Calories: ${mealCalories} kcal</p>
                <button class="removeFood">Remove</button>
            `;
            dishesContainer.appendChild(mealElement);
        }
    });

    enableCustomizations();
}

function enableCustomizations() {
    document.querySelectorAll('.removeFood').forEach(button => {
        button.addEventListener('click', (event) => {
            event.target.parentElement.remove();
        });
    });
}

async function fetchFoodNutrition(foodName) {
    try {
        const response = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${foodName}&number=1&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.results.length > 0) {
            const foodItem = data.results[0];
            const foodId = foodItem.id;
            const foodImage = foodItem.image;

            const nutritionResponse = await fetch(`https://api.spoonacular.com/food/ingredients/${foodId}/information?amount=100&unit=gram&apiKey=${apiKey}`);
            const nutritionData = await nutritionResponse.json();

            const nutritionInfo = {
                name: nutritionData.name,
                image: `https://spoonacular.com/cdn/ingredients_100x100/${foodImage}`, 
                calories: nutritionData.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0,
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
    const listItem = document.createElement('div');
    listItem.className = 'dish';

    listItem.innerHTML = `
        <strong>${food.name}</strong>: 
        <img src="${food.image}" alt="${food.name}" class="food-image" />
        <p>Calories: ${food.calories} kcal</p>
        <p>Protein: ${food.protein}g</p>
        <p>Carbs: ${food.carbs}g</p>
        <p>Fat: ${food.fat}g</p>
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


