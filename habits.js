
let habitsData = localStorage.getItem("ShabitsArray");
let habitsArray = [];
let relevanceArray = [];
if (habitsData != null) {
    habitsArray = JSON.parse(localStorage.getItem("ShabitsArray"));
    relevanceArray = JSON.parse(localStorage.getItem("SrelevanceArray"));
} 
function addHabit() {
    let habitName = document.getElementById("habitName").value;
    let selected = document.querySelector('input[name="habitRelevance"]:checked').value;
    habitsArray.push(habitName);
    relevanceArray.push(selected);
    localStorage.setItem("ShabitsArray", JSON.stringify(habitsArray));
    localStorage.setItem("SrelevanceArray", JSON.stringify(relevanceArray));
}
function deleteHabits() {
    habitsArray = [];
    relevanceArray = [];
    localStorage.removeItem("ShabitsArray");
    localStorage.removeItem("SrelevanceArray");
}

let habitNameElement = document.getElementById("habitName");
habitNameElement.addEventListener("input", () => {
    habitName = document.getElementById("habitName").value;
    stateAddHabit();
});
stateAddHabit()
function stateAddHabit() {
    const setAddHabit = document.getElementById("addHabit");
    if (habitName != "") {
        setAddHabit.disabled = false;
    } else {
        setAddHabit.disabled = true;
    }
}