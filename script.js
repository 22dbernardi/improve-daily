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
    weight = document.getElementById("weight").value
    date = document.getElementById("date").value
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




function add223to420() {
    localStorage.setItem("SorderedDates", JSON.stringify(["2/23/2025","2/24/2025","2/25/2025","2/26/2025","2/27/2025","2/28/2025","3/1/2025","3/2/2025","3/3/2025","3/4/2025","3/5/2025","3/6/2025","3/7/2025","3/8/2025","3/9/2025","3/10/2025","3/11/2025","3/12/2025","3/13/2025","3/14/2025","3/15/2025","3/16/2025","3/17/2025","3/18/2025","3/19/2025","3/20/2025","3/21/2025","3/22/2025","3/23/2025","3/24/2025","3/25/2025","3/26/2025","3/27/2025","3/28/2025","3/29/2025","3/30/2025","3/31/2025","4/1/2025","4/2/2025","4/3/2025","4/4/2025","4/5/2025","4/6/2025","4/7/2025","4/8/2025","4/9/2025","4/10/2025","4/11/2025","4/12/2025","4/13/2025","4/14/2025","4/15/2025","4/16/2025","4/17/2025","4/18/2025","4/19/2025","4/20/2025"]));
    localStorage.setItem("SorderedWeights", JSON.stringify(["77.4","76.5","77.4","76.1","76.6","76.3","76.1","77.8","74.9","74.7","74.5","75.2","74.4","75.4","76.1","75.0","74.4","74.2","75.6","75.3","75.0","73.6","73.7","75.3","75.5","74.9","75.3","74.5","75.8","75.8","74.7","77.4","74.7","74.8","74.6","74.4","74.2","75.9","75.2","75.0","73.9","75.1","73.6","77.2","74.3","74.4","73.7","73.4","72.6","75.8","74.3","73.3","73.6","72.6","72.4","72.3","72.3"]));
}