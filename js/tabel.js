fetch('json/nycPropSales.json')
    .then((response) => {
        //Dari text file dikonversi menjadi JSON Object (Parsing) : response.json()
        //Bisa juga cara lainnya adalah JSON.parse(response)
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

