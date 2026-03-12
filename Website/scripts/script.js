const API_KEY = 'E88C73DEFRLL3EED'; // Paste your key here
const symbol = 'AAPL';
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

async function getStockData() {
    const response = await fetch(url);
    const data = await response.json();
    
    // Extracting the dates (labels) and closing prices (data)
    const timeSeries = data['Time Series (Daily)'];
    const labels = Object.keys(timeSeries).reverse().slice(-30); // Last 30 days
    const prices = labels.map(date => timeSeries[date]['4. close']);

    renderChart(labels, prices);
}

function renderChart(labels, prices) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Closing Price ($)',
                data: prices,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}

getStockData();
document.getElementById("refreshBtn").onclick = function() {
    location.reload();
};