function createScatterPlot(id, raw_datapoints, centroid_values, title) {
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
                    pointRadius: 5
                },
                {
                    label: 'Centroids',
                    data: centroid_values.map(point => ({ x: point[0], y: point[1] })),
                    backgroundColor: 'black',
                    pointStyle: 'cross',
                    pointRadius: 10
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Principal Component 1'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Principal Component 2'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });

    return myChart;
}