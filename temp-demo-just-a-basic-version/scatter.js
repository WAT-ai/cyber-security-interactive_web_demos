function createScatterPlot(id, raw_datapoints, centroid_values) {
    // Get the canvas context
    var ctx = document.getElementById(id).getContext('2d');

    // Create a scatter plot
    var myChart = new Chart(ctx, {


        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Data Points',
                    data: raw_datapoints.map((point) => ({ x: point[0], y: point[1] })), // label: data_labels[index]
                    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Rainbow colormap
                    borderColor: 'black',
                    pointRadius: 5,
                    borderWidth: 1
                },
                {
                    label: 'Centroids',
                    data: centroid_values.map(point => ({ x: point[0], y: point[1] })),
                    backgroundColor: 'black',
                    pointStyle: 'cross',
                    pointRadius: 10,
                    borderColor: 'white',
                    borderWidth: 1
                }
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
                            weight: 'bold'
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
                            weight: 'bold'
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
                    text: 'K-Means Clustering with PCA',
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