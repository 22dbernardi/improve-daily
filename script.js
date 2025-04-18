function addNew() {
    const foodName = document.getElementById("foodName").value;
    const amount = document.getElementById("amount").value;
    const calories = document.getElementById("calories").value;
    const protein = document.getElementById("protein").value;
    const Fat = document.getElementById("fat").value;
    const satFat = document.getElementById("satFat").value;
    const carbs = document.getElementById("carbs").value;
    const sugarCarbs = document.getElementById("sugarCarbs").value;
    if (foodName && amount && calories) {
        const newFood = `${foodName} ${amount} ${calories}`;
        localStorage.setItem("newFood", newFood);
        console.log(newFood);
        const foodCalories = amount*(calories/100);
        document.getElementById("printNF").innerText = `Food added with ${foodCalories}`;
    } else {
        alert("Error");
    }
}

let weightChart;
let dateArray;
let orderedDates = JSON.parse(localStorage.getItem("SorderedDates"));
let orderedWeights = JSON.parse(localStorage.getItem("SorderedWeights"));
createChart();

if (orderedDates && orderedWeights) {
    dateArray = orderedDates;
    weightArray = orderedWeights;
} else {
    dateArray = [];
    weightArray = [];
}

function createChart() {
    if (weightChart) {
        weightChart.destroy();
    } else {
        const ctx = document.getElementById('weightChart').getContext('2d');
        weightChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: orderedDates,
                datasets: [{
                    label: 'Votes',
                    data: orderedWeights,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        })
    }
}

function logWeight() {
    weight = document.getElementById("weight").value
    date = document.getElementById("date").value
    weightArray.push(weight);
    dateArray.push(date);
    let indexedDates = dateArray.map(
        (dateStr, index) => ({date: new Date(dateStr), index})
    );
    indexedDates.sort((a, b) => a.date - b.date);
    let orderedDates = indexedDates.map(
        ({date}) => date.toLocaleDateString("en-US")
    );
    let datesOGOrderIndex = indexedDates.map(
        ({index}) => index
    );
    let orderedWeights = datesOGOrderIndex.map(
        index => weightArray[index]
    );
    localStorage.setItem("SorderedDates", JSON.stringify(orderedDates));
    localStorage.setItem("SorderedWeights", JSON.stringify(orderedWeights));
    weightChart.update();
}

function resetChart() {
    localStorage.removeItem("SorderedDates");
    localStorage.removeItem("SorderedWeights");
}

function defView() {
    weightChart.data.labels = orderedDates;
    weightChart.data.datasets[0].data = orderedWeights;
    weightChart.update();
}
function monthView() {
    if (orderedWeights.length > 30) {
        let monthDates = [];
        let monthWeights = [];
        for (let i = 0; i < orderedWeights.length-30; i++) {
            monthDates.push(orderedDates[i+30]);
            monthWeights.push(orderedWeights[i+30]);
            weightChart.data.labels = monthDates;
            weightChart.data.datasets[0].data = monthWeights;
        }
    } else {
        defView();
    }
    weightChart.update();
}