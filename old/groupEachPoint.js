import * as tf from '@tensorflow/tfjs';

function groupEachPoint(centroids, datapoints){

    var distanceMatrix = [];
    for(let i = 0; i < centroids.length; i++){
        var distances = []; // stores distances from centroid i to each datapoint
        for(let k = 0; k < datapoints.length; k++){
            var distance = 0 //  sum of all differences sqaured - take sqrt before adding to distances array
            for(let l = 0; l < 25; l++){
                distance += (centroids[i][l] - datapoints[k][l]) ** 2
            }
            distances.push(Math.sqrt(distance)) // append distance to datapoint k
        }
        distanceMatrix.push(distances) // append distances fron centroid i to each datapoint to the datapointMatrix
    }
    return distanceMatrix
}