//function to generate random values like NumPy's randn
function genRandLike(shape, data) {
    return tf.randomNormal(shape, 0, 1, 'float32');
}

// Function to compute pairwise affinity between data and centroids
function affinity(data, centroids) {
    const distances = tf.sub(data, centroids);
    return tf.norm(distances, 2, 2).square();
}

// Main Function to perform K-Means clustering in TensorFlow.js
async function kMeans(data, numCentroids, numIters, eps = 0.1, centr = null) {
    let best = null;

    // Fresh start (reset all centroids) on each iteration
    for (let iter = 0; iter < numIters; iter++) {
        console.log(iter);

        // Init random, prior, and best centroids
        if (centr === null) {
            centr = genRandLike([numCentroids, data.shape[1]], data);
        }
        let prior = null;

        // Always perform at least one iteration
        while (true) {
            console.log('.');

            // Find centroids which are close to and not close to data
            const distances = affinity(tf.expandDims(data, 1), centr);
            const groups = tf.argMin(distances, 1).dataSync();
            const hasData = Array.from(new Set(groups));
            //const hasNoData = tf.compat.setdiff1d(tf.range(centr.shape[0]), hasData).dataSync();
            const allIndices = Array.from({ length: centr.shape[0] }, (_, i) => i);
            const hasNoData = allIndices.filter((index) => !hasData.includes(index));

            const flattenedIndices = hasNoData.map((index) => index * centr.shape[1]);
            //for Centr
            const updates = genRandLike([hasNoData.length * centr.shape[1]], data);
            const rowsToUpdate = tf.tensor(flattenedIndices.map((index) => Array.from({ length: centr.shape[1] }, (_, i) => updates[index + i])));


            // Randomly replace centroids not close to data
            prior = centr.clone();
            //centr = centr.scatter(hasNoData, genRandLike([hasNoData.length, data.shape[1]], data));
            //centr = tf.tensor_scatter_nd_update(centr, flattenedIndices, updates);
            centr = centr.mul(tf.scalar(1).sub(rowsToUpdate)).add(rowsToUpdate);
            console.log("Before where:", centr.shape);




            // The problematic line with 'where'
            console.log("Center: ", centr);

            // Update other centroids to be the average of their datapoints
            for (let i = 0; i < hasData.length; i++) {
                // console.log("Before where: 2", centr.shape);
                // console.log("Groups shape: ", groups);
                // console.log("Groups shape: ", hasData[i]);


                console.log("centr shape:", centr.shape);
                console.log("rowsToUpdate shape:", rowsToUpdate.shape);

                const points = data.gather(tf.where(tf.equal(groups, hasData[i]))).squeeze(0);
                centr = centr.scatter([hasData[i]], tf.mean(points, 0));
            }

            // If centroids not changing, stop
            if (tf.norm(affinity(prior, centr), 2, 1).less(eps).all().dataSync()[0]) {
                break;
            }
        }

        // Find the total distance for all datapoints to their centroids as a correlate of accuracy
        const dist = tf.sum(tf.min(affinity(tf.expandDims(data, 1), centr), 1)).dataSync()[0];

        if (best === null || best[0] > dist) {
            best = [dist, centr.clone()];
        }
    }

    // Return best accuracy centroids
    return best[-1];
}

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



