const API_KEY = 'E88C73DEFRLL3EED'; 
let myChartInstance = null; // Variable to store the chart so we can clear it

// search func
async function searchStock() {
    const query = document.getElementById('user-input').value;
    if (!query) return;

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.bestMatches);
}

// 2. displahy searh results
function displayResults(matches) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; 

    matches.forEach(match => {
        const symbol = match['1. symbol'];
        const name = match['2. name'];
        
        const li = document.createElement('li');
        li.textContent = `${symbol} - ${name}`;
        li.className = "search-item"; // Add a class for CSS styling
        
        li.onclick = () => {
            updateChart(symbol); 
            resultsList.innerHTML = ''; // Clear list after selection
        };
        resultsList.appendChild(li);
    });
}

// 3. chart function
async function updateChart(ticker) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const timeSeries = data['Time Series (Daily)'];
    const labels = Object.keys(timeSeries).reverse().slice(-30);
    const prices = labels.map(date => timeSeries[date]['4. close']);

    renderChart(labels, prices, ticker);
}

function renderChart(labels, prices, ticker) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // murder the old chart if it exists
    if (myChartInstance) {
        myChartInstance.destroy();
    }

    myChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Closing Price ($)`,
                data: prices,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}

// Event Listeners
document.getElementById("search-btn").onclick = searchStock;

// Load Apple by default on page load
updateChart('AAPL');
