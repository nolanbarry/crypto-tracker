function createChart(timePeriod) {
  let historyURL = `https://api.coinranking.com/v2/coin/BTCogvtv82FCd/history?timePeriod=${timePeriod}`
  retrieveCR(historyURL)
  .then(response => {
    return response.json();
  }).then(json => {
    console.log(json);
  }).then(data => {
    chart = ${'#chart'}[0];
      let lineChart = new Chart(chart, {
              type: "line",
              data: {
                labels: data[i].map(x => x.hour + " " + x.period),
                datasets: [{
                  data: temps,
                  fill: true,
                  borderColor: "rgb(0, 57, 230)",
                  lineTension: 0.5
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  xAxes: [{
                    gridLines: {
                      display: false
                    },
                  }],
                  yAxes: [{
                    display: false,
                    gridLines: {
                      display: false
                    },
                    ticks: {
                      maxTicksLimit: 6,
                      max: (Math.max(...temps) - Math.min(...temps)) + Math.max(...temps)
                    },
                  }]
                },
                legend: {
                  display: false
                },
                plugins: {
                  datalabels: {
                    font: {
                      family: "minion-pro",
                      weight: 700,
                      size: "14"
                    },
                    color: '#111111',
                    align: 'top',
                    clamp: true,
                    formatter: function(context) {
                      return Math.round(context) + '°';
                    }
                  }
                }
              }
            });
  });
}
