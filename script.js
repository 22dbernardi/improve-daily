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

let myChart;
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
    if (myChart) {
        myChart.destroy();
    } else {
        const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
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
console.log(indexedDates);
    let orderedDates = indexedDates.map(
        ({date}) => date.toLocaleDateString("en-US")
    );
    let datesOGOrderIndex = indexedDates.map(
        ({index}) => index
    );
    let orderedWeights = datesOGOrderIndex.map(
        index => weightArray[index]
    );
console.log(orderedWeights); 
    localStorage.setItem("SorderedDates", JSON.stringify(orderedDates));
    localStorage.setItem("SorderedWeights", JSON.stringify(orderedWeights));
    myChart.data.labels = orderedDates;
    myChart.data.datasets[0].data = orderedWeights;
    myChart.update();
}

function resetChart() {
    localStorage.removeItem("SorderedDates");
    localStorage.removeItem("SorderedWeights");
}

function updateValues() {
    tempD = ["2/23/2025","2/24/2025","2/25/2025","2/26/2025","2/27/2025","2/28/2025","3/1/2025","3/2/2025","3/3/2025","3/4/2025","3/5/2025","3/6/2025","3/7/2025","3/8/2025","3/9/2025","3/10/2025","3/11/2025","3/12/2025","3/13/2025","3/14/2025","3/15/2025","3/16/2025","3/17/2025","3/18/2025","3/19/2025","3/20/2025","3/21/2025","3/22/2025","3/23/2025","3/24/2025","3/25/2025","3/26/2025","3/27/2025","3/28/2025","3/29/2025","3/30/2025","3/31/2025","4/1/2025","4/2/2025","4/3/2025","4/4/2025","4/5/2025","4/6/2025","4/7/2025","4/8/2025","4/9/2025","4/10/2025","4/11/2025","4/12/2025","4/13/2025","4/14/2025","4/15/2025","4/16/2025"] 
    tempW = ["77.4","76.5","77.4","76.1","76.6","76.1","77.8","74.9","74.7","74.5","75.2","74.4","75.4","76.1","75.0","74.4","74.2","75.6","75.0","73.6","73.7","75.3","75.5","74.9","75.3","74.5","75.8","75.8","74.7","77.4","74.7","74.8","74.6","74.4","74.2","75.9","75.2","75.0","73.9","75.1","73.6","77.2","74.3","74.4","73.7","73.4","72.6","75.8","74.3","73.3","73.6"]
    localStorage.setItem("SorderedDates", JSON.stringify(tempD));
    localStorage.setItem("SorderedWeights", JSON.stringify(tempW));
}