fetch('json/nycPropSales.json')
.then((response) => response.json())
.then((data) => {
    // Proses data
    const salesByBuildingClass = {};
    const avgPriceByBuildingClass = {};

    data.forEach((property) => {
        const buildingClass = property.BUILDING_CLASS_CATEGORY;
        const salePrice = parseFloat(property.SALE_PRICE || 0);

        // Total Sales by Building Class
        if (!salesByBuildingClass[buildingClass]) {
            salesByBuildingClass[buildingClass] = salePrice;
        } else {
            salesByBuildingClass[buildingClass] += salePrice;
        }

        // Avg Sales Price by Building Class
        if (!avgPriceByBuildingClass[buildingClass]) {
            avgPriceByBuildingClass[buildingClass] = [salePrice, 1]; // [totalPrice, count]
        } else {
            avgPriceByBuildingClass[buildingClass][0] += salePrice;
            avgPriceByBuildingClass[buildingClass][1] += 1;
        }
    });

    // Hitung rata-rata harga jual
    Object.keys(avgPriceByBuildingClass).forEach((buildingClass) => {
        const [totalPrice, count] = avgPriceByBuildingClass[buildingClass];
        avgPriceByBuildingClass[buildingClass] = totalPrice / count;
    });

    // Siapkan data untuk grafik
    const labels = Object.keys(salesByBuildingClass);
    const totalSalesData = Object.values(salesByBuildingClass);
    const avgPriceData = Object.values(avgPriceByBuildingClass);

    // Buat grafik menggunakan Chart.js
    const ctx = document.getElementById('salesVsAvgPriceChart').getContext('2d');
    const salesVsAvgPriceChart = new Chart(ctx, {
        type: 'line', // Ubah menjadi line chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Sales',
                data: totalSalesData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }, {
                label: 'Avg Sales Price',
                data: avgPriceData,
                borderColor: 'rgba(192, 75, 192, 1)',
                backgroundColor: 'rgba(192, 75, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Dollar ($)'
                    }
                }
            }
        }
    });
})
.catch((error) => {
    console.error('Error fetching the property data:', error);
});
