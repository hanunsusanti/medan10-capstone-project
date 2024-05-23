fetch('json/nycPropSales.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        window.propertyData = data;
        console.log(data)
        createPieAvgPrice();
    });

    function createPieAvgPrice(){
        const ctx = document.getElementById('piechart-avg');
        var arrAvgSales = [];
        for(var i = 1; i <= 5; i++){
            var arrayFiltered = window.propertyData.filter((property) => property.BOROUGH == i.toString());
            var totalSales = arrayFiltered.reduce((total, property) => total + parseInt(property.SALE_PRICE), 0);
            const avgPrice = totalSales / arrayFiltered.length;
            arrAvgSales.push(avgPrice);
        };
        new Chart(ctx, {
            type: 'pie',
            data: {
            labels: ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island'],
            datasets: [{
                label: 'Avg Sale Price Per Borough',
                data: arrAvgSales,
                borderWidth: 1
            }]
            },
            options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });
    }
