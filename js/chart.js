let format = [
  {period: '3h', format: 'h:mm a'},
  {period: '24h', format: 'h:mm a'},
  {period: '7d', format: 'dddd h:mm a'},
  {period: '30d', format: 'MMM D, h:mm a'},
  {period: '3m', format: 'MMM D, h:mm a'},
  {period: '1y', format: 'MMM D, h a'},
  {period: '5y', format: 'MMM D, YYYY'}
];

let lineChart = null;
function chartDisplay(uuid, timePeriod) {
  if (lineChart == null) createChart(uuid, timePeriod);
  else updateChart(uuid, timePeriod);
}

function createChart(uuid, timePeriod) {
  let historyURL = `https://api.coinranking.com/v2/coin/${uuid}/history?timePeriod=${timePeriod}`
  retrieveCR(historyURL)
  .then(response => {
    return response.json();
  }).then(json => {
    let data = json.data.history.map(point => {return {
      y: point.price,
      t: point.timestamp * 1000
    }});
    return {dataset: data, change: json.data.change};
  }).then(data => {
    let color = data.change >= 0 ?
        "rgba(90, 244, 170, 0.9)" :
        "rgba(241, 43, 73, 0.9)";
    chart = $('#chart')[0];
    lineChart = new Chart(chart, {
              type: "line",
              data: {
                datasets: [{
                  data: data.dataset,
                  fill: true,
                  borderColor: color,
                  pointBorderColor: "rgba(0, 0, 0, 0)",
                  pointBackgroundColor: "rgba(0, 0, 0, 0)",
                  lineTension: .1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  xAxes: [{
                    type: 'time',
                    gridLines: {
                      lineWidth: 3,
                      display: false
                    },
                    ticks: {
                      display: false,
                      fontSize: 12,
                    },
                  }],
                  yAxes: [{
                    gridLines: {
                      lineWidth: 3
                    },
                    ticks: {
                      maxTicksLimit: 6,
                      fontSize: 25,
                      fontWeight: 600,
                      fontFamily: "nunito"
                    },
                  }],
                },
                legend: {
                  display: false
                },
                tooltips: {
                  mode: 'index',
                  intersect: false,
                  bodyFontFamily: 'nunito, sans-serif',
                  bodyFontStyle: 800,
                  bodyFontSize: 20,
                  titleFontFamily: 'inter, sans-serif',
                  titleFontSize: 15,
                  displayColors: false,
                  callbacks: {
                      label: function(tooltipItem, data) {
                        updateIndicator(tooltipItem.x);
                        return '$' + beautify(truncateNumber('' + tooltipItem.value, 7));
                      }
                  }
                }
              }
            });
  });
}

function updateChart(uuid, timePeriod) {
  let historyURL = `https://api.coinranking.com/v2/coin/${uuid}/history?timePeriod=${timePeriod}`
  retrieveCR(historyURL)
  .then(response => {
    return response.json();
  }).then(json => {
    let data = json.data.history.map(point => {return {
      y: point.price,
      t: point.timestamp * 1000
    }});
    return {dataset: data, change: json.data.change};
  }).then(data => {
    let color = data.change >= 0 ?
        "rgba(90, 244, 170, 0.9)" :
        "rgba(241, 43, 73, 0.9)";
    chart = $('#chart')[0];
    lineChart.data.datasets[0].data = data.dataset;
    lineChart.data.datasets[0].borderColor = color;
    lineChart.update();
  });
}

function updateIndicator(x) {
  let ind = $('#chart-indicator')[0];
  let chartEl = $('#chart')[0];
  let rect = chartEl.getBoundingClientRect();
  ind.style.display = '';
  ind.style.minHeight = chartEl.clientHeight - 30 + "px";;
  if (x != null)  ind.style.left = rect.left + x + "px";
  ind.style.top = rect.top + 15 + "px";
}

// polls to remove indicator line
$(window).on('mouseup', () => {
  $('#chart-indicator')[0].style.display = 'none';
});

$(window).on('resize', () => $('#chart-indicator')[0].style.display = 'none');
$('#chart').on('mouseout', () => $('#chart-indicator')[0].style.display = 'none');
