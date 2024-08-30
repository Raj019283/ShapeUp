
document.getElementById("bmiForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const age = parseFloat(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;

    let result = calculateBMIAndCalories(weight, height, age, gender);

    document.getElementById("bmiFormContainer").style.display = "none";
    document.getElementById("resultPage").style.display = "block";

    const resultDiv = document.getElementById("bmiResult");
    resultDiv.innerHTML = `Your BMI is ${result.bmi} and you are classified as: ${result.category}`;

    localStorage.setItem("calories", result.calories);

    createBMIGraph(result.bmi);
});


function calculateBMIAndCalories(weight, height, age, gender) {
    let heightInMeters = height / 100;
    let bmi = weight / (heightInMeters * heightInMeters);
    bmi = bmi.toFixed(2);

    let bmr;
    if (gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    const activityMultiplier = 1.55;
    const calories = (bmr * activityMultiplier).toFixed(2);
    
    let category;
    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
    } else {
        category = "Obesity";
    }

    return {bmi, category, calories};
}

function createBMIGraph(bmi) {
    const ctx = document.getElementById('bmiChart').getContext('2d');

    let color;
    if (bmi < 18.5) {
        color = 'rgba(255, 0, 0, 0.6)';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        color = 'rgba(0, 128, 0, 0.6)';
    } else if (bmi >= 25 && bmi < 29.9) {
        color = 'rgba(255, 165, 0, 0.6)';
    } else if (bmi >= 30) {
        color = 'rgba(255, 0, 0, 0.6)';
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['BMI'],
            datasets: [{
                label: 'Your BMI',
                data: [bmi],
                backgroundColor: [color],
                borderColor: [color.replace('0.6', '1')],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMin: 10,
                    suggestedMax: 40,
                    title: {
                        display: true,
                        text: 'BMI Value',
                        color : '#ffffff'
                    },
                    ticks: {
                        color : '#ffffff'
                    },
                },
                x:{
                    ticks: {
                        color : '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toFixed(2);
                            return label;
                        }
                    }
                }
            }
        }
    });
}

document.getElementById("createDietButton").addEventListener("click", function() {
    window.location.href = "diet-plan.html";
});
