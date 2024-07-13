let dataTotal = [];
let dataAvg = [];
let salesVsAvgPriceChart = null;

function updateChart(labels, totalSalesData, avgPriceData) {
    // Perbarui data grafik
    salesVsAvgPriceChart.data.labels = labels;
    salesVsAvgPriceChart.data.datasets[0].data = totalSalesData;
    salesVsAvgPriceChart.data.datasets[1].data = avgPriceData;

    // Perbarui grafik
    salesVsAvgPriceChart.update();
}

function sortDataTotalVsAvgSales(sortBy, orderBy) {
    let sortedData = [];
    if (sortBy === "totalSales") {
        sortedData = dataTotal.slice().sort((a, b) => {
            return orderBy === "asc" ? a.totalSales - b.totalSales : b.totalSales - a.totalSales;
        });
    } else if (sortBy === "avgSales") {
        sortedData = dataAvg.slice().sort((a, b) => {
            return orderBy === "asc" ? a.avgPrice - b.avgPrice : b.avgPrice - a.avgPrice;
        });
    }

    const labels = sortedData.map(item => item.buildingClass);
    const totalSalesData = sortedData.map(item => item.totalSales || 0);
    const avgPriceData = sortedData.map(item => item.avgPrice || 0);

    updateChart(labels, totalSalesData, avgPriceData);
}

fetch('json/nycPropSales.json')
.then((response) => response.json())
.then((data) => {
    const salesByBuildingClass = {};
    const avgPriceByBuildingClass = {};

    data.forEach((property) => {
        const buildingClass = property.BUILDING_CLASS_CATEGORY;
        const salePrice = parseFloat(property.SALE_PRICE || 0);

        if (salePrice > 0) {
            if (!salesByBuildingClass[buildingClass]) {
                salesByBuildingClass[buildingClass] = 1;
                dataTotal.push({
                    buildingClass: buildingClass,
                    totalSales: 1,
                });
            } else {
                salesByBuildingClass[buildingClass] += 1;
                let index = dataTotal.findIndex(
                    (item) => item.buildingClass === buildingClass
                );
                dataTotal[index].totalSales += 1;
            }
        }

        if (!avgPriceByBuildingClass[buildingClass]) {
            avgPriceByBuildingClass[buildingClass] = [salePrice, 1];
        } else {
            avgPriceByBuildingClass[buildingClass][0] += salePrice;
            avgPriceByBuildingClass[buildingClass][1] += 1;
        }
    });

    Object.keys(avgPriceByBuildingClass).forEach((buildingClass) => {
        const [totalPrice, count] = avgPriceByBuildingClass[buildingClass];
        avgPriceByBuildingClass[buildingClass] = totalPrice / count;
    });

    dataTotal.sort((a, b) => b.totalSales - a.totalSales);

    dataAvg = Object.keys(avgPriceByBuildingClass).map((buildingClass) => ({
        buildingClass: buildingClass,
        avgPrice: avgPriceByBuildingClass[buildingClass],
    }));
    dataAvg.sort((a, b) => b.avgPrice - a.avgPrice);

    const labels = dataTotal.map(item => item.buildingClass);
    const totalSalesData = dataTotal.map(item => item.totalSales);
    const avgPriceData = dataAvg.map(item => item.avgPrice);

    const ctx = document.getElementById('salesVsAvgPriceChart').getContext('2d');
    ctx.canvas.height = 400;

     salesVsAvgPriceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Sales',
                data: totalSalesData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                yAxisID: 'y1',
            }, {
                label: 'Avg Sales Price',
                data: avgPriceData,
                borderColor: 'rgba(192, 75, 192, 1)',
                backgroundColor: 'rgba(192, 75, 192, 0.2)',
                borderWidth: 1,
                yAxisID: 'y2',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            let newLabel = this.getLabelForValue(value).substring(0, 8) + '...';
                            return newLabel;
                        }
                    }
                },
                y1: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Sales'
                    },
                    position: 'left',
                },
                y2: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Dollar ($)'
                    },
                    position: 'right',
                    ticks: {
                        callback: function(value) {
                            let newLabel = value.toLocaleString('en-US', {
                                maximumFractionDigits: 2,
                                notation: 'compact',
                                compactDisplay: 'short'
                            });
                            return newLabel;
                        }
                    }
                }
            }
        }
    });
})
.catch((error) => {
    console.error('Error fetching the property data:', error);
});


const filterForm = document.getElementById('filterForm');

filterForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const sortBy = document.getElementById('total-avg-sort-by').value;
    const orderBy = document.getElementById('total-avg-order-by').value;

    sortDataTotalVsAvgSales(sortBy, orderBy);
});
