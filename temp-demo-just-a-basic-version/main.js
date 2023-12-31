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
    let tensorData = tf.tensor2d(arrayData).slice([0,0], [1000,2]);

    // normalization (optional)
    if (normalized) {
        const {mean, variance} = tf.moments(tensorData, 0);
        tensorData = tf.sub(tensorData, mean).div(tf.sqrt(variance));
        arrayData = tensorData.arraySync();
    }

    return [tensorData, arrayData];
}



loadCSVData(true).then(([tensorData, arrayData]) => { 
    const numCentroids = 10;
    const numIters = 1;
    const eps = 6.0;

    kMeans(tensorData, numCentroids, numIters, eps).then((bestCentroids) => {
        createScatterPlot("init-regular-data-scatter", arrayData, 
                          bestCentroids.arraySync());
    });
});