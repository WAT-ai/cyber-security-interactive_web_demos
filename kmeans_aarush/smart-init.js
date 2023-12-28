// app.js
const tf = require('@tensorflow/tfjs');

function affinity(data, centroids) {
    const distances = tf.sub(data, centroids);
    return tf.norm(distances, 2, 2).square();
};

// (main array) (normalised probability array) -> integer
function random_choice(array, p) {
    
}

function normalise(data) {
    const means = data.mean(0);
    const stds = tf.moments(data).variance.sqrt();
};

// Initialize Centroids:

function init_centr(data, num_centr, old_centr) {

    // There are no current centroids - Naive Selection
    if (old_centr === null && num_centr > 0) {
        const idx = tf.randomUniform(data.shape)[0];
        old_centr = data.slice([idx], [idx + 1]);
    }
    else { // Otherwise: Smart centroid selection

        // Compute distance between each point and closest centroids
        const view = data.reshape((data.shape[0], [1], data.shape[-1]));
        const dist = tf.min(affinity(view, old_centr), axis=-1);
        dist = dist / tf.sum(dist);

        // Pick centroid
        const idx = random_choice(data.shape[0], 1, dist);
        old_centr = tf.concat([old_centr, data.slice([idx], [idx + 1])]);
    }
};

// Function to load and preprocess the CSV data
async function loadCSVData() {
    // Replace "your/local/path/your_data.csv" with the path to your local CSV file
    const csvUrl = "0.001percent_2classes.csv";

    // Fetch the CSV file
    const response = await fetch(csvUrl);
    const csvText = await response.text();

    // Parse CSV text into an array of objects
    const csvData = Papa.parse(csvText, { header: true, dynamicTyping: true }).data;

    // Extract features and convert to Tensor
    const features = ["duration", "srate", /* ... */];
    const xData = csvData.map((row) => features.map((feature) => row[feature]));
    const benignData = tf.tensor2d(xData);

    return benignData;
}

//Test
// const benignData = tf.tensor2d([[]]);
// const numCentroids = 5;
// const numIters = 1;
// const eps = 1.0;
// const bestCentroids = await kMeans(benignData, numCentroids, numIters, eps);
// console.log(bestCentroids);

loadCSVData().then((benignData) => {
    // Now you can use benignData in your K-Means or other computations
    const numCentroids = 5;
    const numIters = 1;
    const eps = 1.0;

    kMeans(benignData, numCentroids, numIters, eps).then((bestCentroids) => {
        console.log(bestCentroids.shape);
    });
});