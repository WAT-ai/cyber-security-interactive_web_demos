import { Link, Element } from 'react-scroll';
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import './Model.css'
import Papa from 'papaparse';
import * as tfVis from '@tensorflow/tfjs-vis';

/* 
@file               kmeans-naive.js
@brief              K-means clustering with random centroid initialisation
@author             Aarush Ghosh, 
*/


//function to generate random values like NumPy's randn
function genRandLike(shape) {
    return tf.randomNormal(shape, 0, 1, 'float32');
}

// Compute Euclidean distance between data and centroids
function affinity(data, centroids) {
    const distances = tf.sub(data, centroids).square();
    return tf.sum(distances, distances.shape.length - 1).sqrt();
}

// Main Function to perform K-Means clustering in TensorFlow.js
async function kMeans(data, numCentroids, numIters, eps = 0.1, centr = null) {
    let best = null;

    // Fresh start (reset all centroids) on each iteration
    for (let iter = 0; iter < numIters; iter++) {
        console.log("Iteration number: ", iter+1);

        // Init random, prior, and best centroids
        if (centr === null) {
            centr = genRandLike([numCentroids, data.shape[1]]);    // has shape [num_centr x 2]
        }
        const [nCentr, nDims] = centr.shape;
        const nEx = data.shape[0];

        // Always perform at least one update on centroid values
        let numUpdates = 0;
        while (true) {
            const prior = centr.clone();

            // Find centroids which are close to and not close to data
            const distances = affinity(tf.expandDims(data, 1), centr);                // num_examples x num_centroids
            const groupsOG = distances.argMin(1);
            const groups = groupsOG.dataSync();                                       // num_examples

            // save best centroids
            if (best === null || best[0] > distances.sum()) {
                best = [distances.sum(), centr.clone()];
            }
            
            // figure out which centroids have data grouped under them
            const allIndices = Array.from({ length: nCentr }, (_, i) => i);   // [0, 1, 2, ... num_centroids]
            const hasData = Array.from(new Set(groups));                              // from above, filter to centroids with datapoints
            const hasNoData = allIndices.filter((index) => !hasData.includes(index)); // from above filter to centroids w/o datapoints

            // Replace the current centroid values with random ones
            for (let i of hasNoData) {
                const randTensor = genRandLike([1, nDims]);
                centr = tf.concat([
                    centr.slice([0, 0], [i, nDims]),       // data before centr to replace
                    randTensor,                            // new data for centr to replace
                    centr.slice([i + 1, 0], [-1, nDims])   // data after centr to replace
                ]);
            }

            // Update other centroids to be the average of their datapoints
            // this creates [0, 1, 2, 3, ..., num_examples]
            const indices = tf.linspace(0, nEx - 2, nEx);

            // this goes through the ith centroid
            for(let i of hasData){
                // finds which datapoints are grouped into the ith centroid
                const comparison = tf.fill(groupsOG.shape, i);
                const cond = tf.equal(groupsOG, comparison); 

                // gets indices, and then raw values, of those datapoints 
                let closest_to_centr = await tf.booleanMaskAsync(indices, cond);
                closest_to_centr = tf.cast(closest_to_centr, 'int32');
                const selected_datapoints = data.gather(closest_to_centr);

                // setting the value of the ith centroid to be the mean of datapoints grouped under it
                let newCentr = tf.mean(selected_datapoints, axis=0);
                newCentr = tf.expandDims(newCentr, axis=0);

                centr = tf.concat([
                    centr.slice([0, 0], [i, nDims]),       // data before centr to replace
                    newCentr,                              // new data for centr to replace
                    centr.slice([i + 1, 0], [-1, nDims])   // data after centr to replace
                ]);                
            }   

            // If centroids not changing, stop
            const change = affinity(prior, centr).sum();
            numUpdates += 1;
            if (change < eps || numUpdates > 5) break;
            else {
                console.log("Change in centroid values: ");
                change.print();
            }
        }
    }

    // Return best accuracy centroids
    return best[1];
}

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
    const xData = csvData.map((row) => features.map((feature) => row[feature]));
    
    // Only keep max 1K rows (algorithm already slow)
    let benignData = tf.tensor2d(xData).slice([0,0], [1000,2]);

    // normalization (optional)
    if (normalized) {
        const {mean, variance} = tf.moments(benignData, 0);
        benignData = tf.sub(benignData, mean).div(tf.sqrt(variance));
    }

    return benignData;
}

loadCSVData(true).then((benignData) => {
    // Now you can use benignData in your K-Means or other computations
    const numCentroids = 10;
    const numIters = 1;
    const eps = 6.0;

    kMeans(benignData, numCentroids, numIters, eps).then((bestCentroids) => {
        bestCentroids.print();
    });
});



