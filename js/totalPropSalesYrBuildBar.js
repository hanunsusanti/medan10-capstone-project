let sortedLabels = [];
let sortedData = [];

//Variable untuk menampung chart dan data yang ditampilkan oleh chart
var chartSalesByYearBuilt = null;
var dataSalesByYearBuilt = [];

fetch("json/nycPropSales.json")
  .then((response) => response.json())
  .then((data) => {
    const arrSalesByYearBuilt = [];

    data.forEach((property) => {

      if(arrSalesByYearBuilt.find((item) => item.yearBuilt === property.YEAR_BUILT)){
        const index = arrSalesByYearBuilt.findIndex((item) => item. yearBuilt === property.YEAR_BUILT);
        arrSalesByYearBuilt[index].total += 1;
      }else{
        arrSalesByYearBuilt.push({
          yearBuilt: property.YEAR_BUILT,
          total: 1,
        });
      }
    });

    arrSalesByYearBuilt.sort((a, b) => b.yearBuilt - a.yearBuilt);
    window.dataSalesByYearBuilt = arrSalesByYearBuilt;

    sortedLabels = arrSalesByYearBuilt.map((item)=> item.yearBuilt);
    sortedData = arrSalesByYearBuilt.map((item)=> item.total);

    createChart(sortedLabels, sortedData);
  })

  .catch((error) => {
    console.error("Error fetching the property data:", error);
  });

function createChart(labels, data) {
  const ctx = document.getElementById("propertySalesByYearBuiltChart").getContext("2d");
  ctx.canvas.height = "auto";


  const propertySalesByYearBuiltChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Property Sales",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", // Mengatur orientasi sumbu x menjadi sumbu y
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Year Built",
          },
        },
        x: {
          title: {
            display: true,
            text: "Total Sales",
          },
        },
      },
    },
  });
  
  //dimasukkan chartnya ke dalam variable penampung global
  window.chartSalesByYearBuilt = propertySalesByYearBuiltChart;
}

function sortData(order) {
  if (order === "asc") {
    sortedLabels.sort();
    sortedData.sort(
      (a, b) => sortedLabels.indexOf(a) - sortedLabels.indexOf(b)
    );
  } else if (order === "desc") {
    sortedLabels.sort().reverse();
    sortedData.sort(
      (a, b) => sortedLabels.indexOf(b) - sortedLabels.indexOf(a)
    );
  }

  propertySalesByYearBuiltChart.destroy();
  createChart(sortedLabels, sortedData);
}

function filterDataSalesByYearBuilt(e) {
  e.preventDefault();
  var startYear = parseInt(document.getElementById("year-built-from").value);
  var finishYear = parseInt(document.getElementById("year-built-to").value);
  var flagFlip = false;
  if (startYear > finishYear) {
    var temp = startYear;
    startYear = finishYear;
    finishYear = temp;
    flagFlip = true;
  }
  let arrFiltered = window.dataSalesByYearBuilt.filter(
    (item) => item.yearBuilt >= startYear && item.yearBuilt <= finishYear
  );

  arrFiltered.sort((a, b) => a.yearBuilt - b.yearBuilt);
  if (flagFlip) {
    arrFiltered.reverse();
  }
  let labels = arrFiltered.map((item) => item.yearBuilt);
  let data = arrFiltered.map((item) => item.total);

  chartSalesByYearBuilt.data.labels = labels;
  chartSalesByYearBuilt.data.datasets[0].data = data;
  chartSalesByYearBuilt.update();
}

function sortDataSalesByYearBuilt(e) {
  e.preventDefault();
  var arrLabels = chartSalesByYearBuilt.data.labels;
  var arrData = chartSalesByYearBuilt.data.datasets[0].data;
  var arrTemp = [];
  const sortBy = document.getElementById("year-built-sort-by").value;
  const order = document.getElementById("year-built-order-by").value;

  for (var i = 0; i < arrLabels.length; i++) {
    arrTemp.push({ yearBuilt: arrLabels[i], total: arrData[i] });
  }

  if (sortBy === "yearBuilt") {
    if (order === "asc") {
      arrTemp.sort((a, b) => a.yearBuilt - b.yearBuilt);
    } else if (order === "desc") {
      arrTemp.sort((a, b) => b.yearBuilt - a.yearBuilt);
    }
  } else if (sortBy === "total") {
    if (order === "asc") {
      arrTemp.sort((a, b) => a.total - b.total);
    } else if (order === "desc") {
      arrTemp.sort((a, b) => b.total - a.total);
    }
  }

  let labels = arrTemp.map((item) => item.yearBuilt);
  let data = arrTemp.map((item) => item.total);

  chartSalesByYearBuilt.data.labels = labels;
  chartSalesByYearBuilt.data.datasets[0].data = data;
  chartSalesByYearBuilt.update();
}
