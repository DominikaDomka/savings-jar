// Global variables
let totalSavings = 0;
let savingsGoal = 0;
let currentCurrency = 'USD';

const currencySymbols = {
    USD: '$', EUR: '€', JPY: '¥', GBP: '£', AUD: 'A$', CAD: 'C$', 
    CHF: 'Fr', CNY: '¥', SEK: 'kr', NZD: 'NZ$', MXN: '$', SGD: 'S$', 
    HKD: 'HK$', NOK: 'kr', KRW: '₩', TRY: '₺', INR: '₹', 
    BRL: 'R$', ZAR: 'R'
};

// Load saved data from localStorage
function loadSavedData() {
    const savedData = localStorage.getItem('savingsJarData');
    if (savedData) {
        const data = JSON.parse(savedData);
        totalSavings = data.totalSavings;
        savingsGoal = data.savingsGoal;
        currentCurrency = data.currentCurrency;
        document.getElementById('currency-select').value = currentCurrency;
        updateDisplay();
    }
}

// Save data to localStorage
function saveData() {
    const data = {
        totalSavings,
        savingsGoal,
        currentCurrency
    };
    localStorage.setItem('savingsJarData', JSON.stringify(data));
}

// Update the display with the current savings and goal
function updateDisplay() {
    const totalElement = document.getElementById('total-savings');
    const goalElement = document.getElementById('goal-display');
    const fillElement = document.getElementById('savings-fill');
    const symbol = currencySymbols[currentCurrency];
    
    if (['USD', 'CAD', 'AUD', 'HKD', 'SGD', 'NZD'].includes(currentCurrency)) {
        totalElement.textContent = `${symbol}${totalSavings.toFixed(2)}`;
        goalElement.textContent = `Goal: ${symbol}${savingsGoal.toFixed(2)}`;
    } else {
        totalElement.textContent = `${totalSavings.toFixed(2)} ${symbol}`;
        goalElement.textContent = `Goal: ${savingsGoal.toFixed(2)} ${symbol}`;
    }

    const fillHeight = savingsGoal > 0 ? Math.min((totalSavings / savingsGoal) * 100, 100) : 0;
    fillElement.style.height = `${fillHeight}%`;
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();

    document.getElementById('add-savings-btn').addEventListener('click', function() {
        const input = document.getElementById('savings-input');
        const amount = parseFloat(input.value);
        if (!isNaN(amount) && amount > 0) {
            totalSavings += amount;
            updateDisplay();
            saveData();
            input.value = '';
        } else {
            alert('Please enter a valid positive number.');
        }
    });

    document.getElementById('clear-savings-btn').addEventListener('click', function() {
        totalSavings = 0;
        updateDisplay();
        saveData();
    });

    document.getElementById('set-goal-btn').addEventListener('click', function() {
        const newGoal = prompt("Enter your savings goal:");
        const goalAmount = parseFloat(newGoal);
        if (!isNaN(goalAmount) && goalAmount > 0) {
            savingsGoal = goalAmount;
            updateDisplay();
            saveData();
        } else {
            alert('Please enter a valid positive number for your goal.');
        }
    });

    document.getElementById('currency-select').addEventListener('change', function() {
        currentCurrency = this.value;
        updateDisplay();
        saveData();
    });
});
