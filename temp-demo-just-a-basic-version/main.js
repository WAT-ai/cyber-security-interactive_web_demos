
// Global Vars
let load_tensorData;
let load_arrayData;

// Function to load and preprocess the CSV data
async function loadCSVData(normalized = false) {
    const csvUrl = "0.001percent_2classes.csv";

    // Fetch the CSV file
    const response = await fetch(csvUrl);
    const csvText = await response.text();

    // Parse CSV text into an array of objects
    const csvData = Papa.parse(csvText, { header: true, dynamicTyping: true }).data;

    // Extract features and convert to Tensor
    const features = ["duration", "srate", /* ... */];
    let arrayData = csvData.map((row) => features.map((feature) => row[feature]));

    // Only keep max 1K rows (algorithm already slow)
    let tensorData = tf.tensor2d(arrayData).slice([0, 0], [1000, 2]);

    // normalization (optional)
    if (normalized) {
        const { mean, variance } = tf.moments(tensorData, 0);
        tensorData = tf.sub(tensorData, mean).div(tf.sqrt(variance));
        arrayData = tensorData.arraySync();
    }

    return [tensorData, arrayData];
}




loadCSVData(false).then(([tensorData, arrayData]) => {
    const numCentroids = 10;
    const numIters = 1;
    const eps = 6.0;

    // save loaded values to global vars
    load_tensorData = tensorData;
    load_arrayData = arrayData;

    kMeans(tensorData, numCentroids, numIters, eps).then((bestCentroids) => {
        createScatterPlot("init-regular-data-scatter", arrayData,
            bestCentroids.arraySync(), "K-Means Clustering with PCA (Single Iteration)");
    });
});


function runkmeans() {
    const numCentroids = 10;
    const numIters = 20;
    const eps = 6.0;

    document.getElementById('btn-rawkmeans').style.display = 'none';
    document.getElementById('txt-train').style.display = 'block'



    kMeans(load_tensorData, numCentroids, numIters, eps).then((bestCentroids) => {
        document.getElementById('txt-train').style.display = 'none'
        createScatterPlot("rawkmeans-regular-data-scatter", load_arrayData,
            bestCentroids.arraySync(), "K-Means Clustering with PCA (10 Iterations)");
    });
}


function runkmeans_normalized() {
    document.getElementById('btn-normkmeans').style.display = 'none';
    document.getElementById('txt-train_norm').style.display = 'block'



    loadCSVData(true).then(([tensorData, arrayData]) => {
        const numCentroids = 10;
        const numIters = 10;
        const eps = 6.0;

        kMeans(tensorData, numCentroids, numIters, eps).then((bestCentroids) => {
            document.getElementById('txt-train_norm').style.display = 'none'
            createScatterPlot("normkmeans-regular-data-scatter", arrayData,
                bestCentroids.arraySync(), "K-Means Clustering with PCA - Normalized (10 Iterations)");
        });
    });
}