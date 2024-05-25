fetch('json/nycPropSales.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        window.propertyData = data;
        // console.log(window.propertyData);
        let table = new DataTable('#data-tabel', {
            data : window.propertyData,
            columns : [
                { data: 'NEIGHBORHOOD' },
                { data: 'YEAR_BUILT' },
                { data: 'SALE_PRICE' }
            ]
        });
    });

