// app.js
const tf = require('@tensorflow/tfjs');

const HARDCODE_RANGE = tf.max(benignData, 0).sub(tf.min(benignData, 0));

function affinity(data, centroids) {
    const distances = tf.sub(data, centroids);
    return tf.norm(distances, 2, 2).square();
};

function normalise(data) {
    const means = data.mean(0);
    const stds = tf.moments(data).variance.sqrt();
};

function gen_rand_like(dim) {
    tf.randomUniform(dim).mul(HARDCODE_RANGE);
};

function k_means(data, num_centroids, num_iters, eps, centr) {
    // Resetting all centroids each iteration of loop
    for (let i = 0; i < num_iters; i++) {
        print(i);
        // Randomly initializing centroids through first iteration of loop
        if (centr === null) {
            centr = gen_rand_like(tf.tensor([num_centroids, data.shape[-1]]));
        };
        const prior = null;
        const best = null;

        while (True) {
            const groups = tf.argMin(affinity(tf.expandDims(data, 1), centr), 1);
            const has_data =  tf.unique(groups);
            const has_no_data = tf.setdiff1dAsync(tf.range(0, centr.shape[0], 1, 'int32'), has_data);
            
            prior = centr.clone();
            centr = tf.TensorScatterUpdate(centr, tf.where(has_no_data), gen_rand_like((has_no_data[0], data.shape[-1])));

            for (let i = 0; i < has_data.shape[0]; i++) {
                const points = tf.gather(data, tf.where(tf.equal(groups, tf.cast(hasData.slice([i], [1]), 'int32'))).flatten()).squeeze(0);
                centr = tf.TensorScatterUpdate(centr, i, tf.mean(points, 0));
            };
            const condition = affinity(prior, centr).less(eps).all();
            if (condition) {
                break;
            };

        };

        const dist = tf.sum(tf.min(affinity(tf.expandDims(data, 1)), centr), 1)
        if (best === null || best[0] > dist) {
            best = (dist, centr);

        };

        return best[-1];

    };

    const best_centr = k_means(benign_data, 5, 1, 1.0, null);
    print(best_centr.shape);

};



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