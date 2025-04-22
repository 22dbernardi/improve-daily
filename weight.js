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
    orderedDates = [];
    orderedWeights = [];
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
                    label: 'weight',
                    data: orderedWeights,
                    spanGaps: true,
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
    weight = document.getElementById("weight").value;
    date = document.getElementById("date").value;
    weightArray.push(weight);
    let pushableDate = new Date(date).toLocaleDateString("en-US");
    dateArray.push(pushableDate);
    let indexedDates = dateArray.map(
        (dateStr, index) => ({date: new Date(dateStr), index})
    );
    indexedDates.sort((a, b) => a.date - b.date);
    let orderedDatesNN = indexedDates.map(
        ({date}) => date.toLocaleDateString("en-US")
    );
    let datesOGOrderIndex = indexedDates.map(
        ({index}) => index
    );
    let orderedWeightsNN = datesOGOrderIndex.map(
        index => weightArray[index]
    );
    highestDate = new Date(orderedDatesNN[orderedDatesNN.length-1])
    lowestDate = new Date(orderedDatesNN[0])
    let dateDiff = ((highestDate - lowestDate)/86400000+1);
    orderedDates = [];
    for (let i = 0; i < dateDiff; i++) {
        tempDate = new Date(orderedDatesNN[0]);
        tempDate.setDate(tempDate.getDate()+i)
        if (!orderedDates.includes(tempDate)) {
            orderedDates.push(tempDate);
        } 
    };
    orderedDates = orderedDates.map(
        (dateStr) => ({date: new Date(dateStr)}),
    );
    orderedDates = orderedDates.map(
        ({date}) => date.toLocaleDateString("en-US"),
    )
    orderedWeights = [];
    for (let i = 0, u = 0; i < orderedDates.length; i++) {
        if (orderedDatesNN.includes(orderedDates[i])) {
            orderedWeights.push(orderedWeightsNN[u]);
            u++;
        } else {
            orderedWeights.push(null);
        }
    }  
    localStorage.setItem("SorderedDates", JSON.stringify(orderedDates));
    localStorage.setItem("SorderedWeights", JSON.stringify(orderedWeights));
    weightChart.data.labels = orderedDates;
    weightChart.data.datasets[0].data = orderedWeights;
    weightChart.update();
    weightTable();
    stateResetChart();
    stateLogWeight()
}
function resetChart() {
    localStorage.removeItem("SorderedDates");
    localStorage.removeItem("SorderedWeights");
    weightArray = [];
    dateArray = [];
    orderedDates = [];
    orderedWeights = [];
    weightChart.data.labels = [];
    weightChart.data.datasets[0].data = [];
    weightChart.update();
    weightTable();  
    stateResetChart();
}
stateResetChart()
function stateResetChart() {
    const resetChartButton = document.getElementById("resetChart");
    if (orderedDates.length == 0) {
        resetChartButton.disabled = true;
    } else {
        resetChartButton.disabled = false;
    }
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
weightTable();
function weightTable() {
    let weightData
    if (orderedDates.length != 0) {
        weightData = 1;
    } else {
        weightData = 0;
    }
    const parent = document.querySelector("#tableCard");
    if (weightData == 1) {
        for (let i = 0; i < orderedDates.length; i++) {
            while (parent.childElementCount > orderedDates.length-1) {
                parent.removeChild(parent.firstElementChild);
            }
            const newDiv = document.createElement("div");
            const newI = document.createElement("i");
            const newP = document.createElement("p");
            const newB = document.createElement("button");
            newP.textContent = `${orderedWeights[i]} on day ${orderedDates[i]}`;
            newI.textContent = "delete";
            newI.className = "material-icons";
            newI.style = "color: rgba(160, 160, 160, 0.395);";
            newB.style = "justify-self: end; background: none; border: none; cursor: pointer;";
            newB.onclick = function () {
                if (orderedWeights.length == 1) {
                    resetChart();
                } else {
                    if (i == 0) {
                        const delW = orderedWeights.shift();
                        const delD = orderedDates.shift();
                        while (orderedWeights[0] == null) {
                            const delW = orderedWeights.shift();
                            const delD = orderedDates.shift();
                        }
                    } else if (i == orderedWeights.length-1) {
                        const delW = orderedWeights.pop();
                        const delD = orderedDates.pop();
                        while (orderedWeights[orderedWeights.length-1] == null) {
                            const delW = orderedWeights.shift();
                            const delD = orderedDates.shift();
                        }
                    } else {
                        orderedWeights[i] = null;
                    }
                }
                weightArray = orderedWeights;
                dateArray = orderedDates;
                localStorage.setItem("SorderedWeights", JSON.stringify(orderedWeights));
                localStorage.setItem("SorderedDates", JSON.stringify(orderedDates));
                weightTable();
                weightChart.update();
            };
            newDiv.id = "tableRow";
            parent.appendChild(newDiv);
            newDiv.appendChild(newP);
            newDiv.appendChild(newB);
            newB.appendChild(newI);
        }
    } else {
        const newDiv = document.createElement("div");
        const newP = document.createElement("p");
        newDiv.id = "tableRow";
        newP.textContent = "No data";
        newDiv.appendChild(newP);
        parent.appendChild(newDiv);
        while (parent.childElementCount > 1) {
            parent.removeChild(parent.firstElementChild);
        }
    }
}
let weightString = document.getElementById("weight");
let dateString = document.getElementById("date");
weightString.addEventListener("input", () => {
    weightString = document.getElementById("weight");
    stateLogWeight();
});
dateString.addEventListener("input", () => {
    dateString = document.getElementById("date");
    stateLogWeight();
});
stateLogWeight()
function stateLogWeight() {
    const setLogWeight = document.getElementById("logWeight");
    if (weightString.value && dateString.value) {
        setLogWeight.disabled = false;
    } else {
        setLogWeight.disabled = true;
    }
}