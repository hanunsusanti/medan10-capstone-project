fetch('json/forTable.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        window.propertyData = data;
        let table = new DataTable('#data-tabel', {
            data : window.propertyData,
            responsive: true,
            scrollX: true,
            scrollY: 600,
            lengthMenu: [[15, 20, 50, 100],[15, 20, 50, 100]],
            columns : [
                { data: 'BOROUGH' },
                { data: 'NEIGHBORHOOD' },
                { data: 'YEAR_BUILT' },
                { data: 'BUILDING_CLASS_CATEGORY' },
                { data: 'SALE_PRICE' }
            ]
        });
    });

