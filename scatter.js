function createScatterPlot(id, raw_datapoints, centroid_values, title) {
    // Get the canvas context
    var ctx = document.getElementById(id).getContext('2d');

    // Create a scatter plot
    var myChart = new Chart(ctx, {


        type: 'scatter',
        data: {
            datasets: [

                                {
                    label: 'Centroids',
                    data: centroid_values.map(point => ({ x: point[0], y: point[1] })),
                    backgroundColor: 'white',
                    pointStyle: 'cross',
                    pointRadius: 10,
                    borderColor: 'white',
                    borderWidth: 1
                },
                {
                    label: 'Data Points',
                    data: raw_datapoints.map((point) => ({ x: point[0], y: point[1] })), // label: data_labels[index]
                    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Rainbow colormap
                    borderColor: 'black',
                    pointRadius: 5,
                    borderWidth: 1
                },

            ]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        color: 'grey',
                        borderColor: 'grey'
                    },
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Principal Component 1',
                        color: 'white',
                        font: {
                            weight: 'bold',
                            size: 20,
                            align: 'center'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'grey',
                        borderColor: 'grey'
                    },
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Principal Component 2',
                        color: 'white',
                        font: {
                            weight: 'bold',
                            size: 20,
                            align: 'center'
                        }
                    }
                }

            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                    }
                },
                title: {
                    display: true,
                    text: title,
                    color: 'yellow',
                    font: {
                        weight: 'bold',
                        size: 20
                    }
                }
            }
        }
    });

    return myChart;
}