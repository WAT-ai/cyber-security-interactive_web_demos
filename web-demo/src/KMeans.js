import { Link, Element } from 'react-scroll';
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import './Model.css'
import Papa from 'papaparse';
import * as tfVis from '@tensorflow/tfjs-vis';


const KMeans = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [afterTraining, setAfterTraining] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [trainingTime, setTrainingTime] = useState(0);
    const [memoryUsage, setMemoryUsage] = useState(0);
    const [data, setData] = useState([1]);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);


    const ResultsPopup = ({ onClose }) => {
        const [currentPage, setCurrentPage] = useState(1);
        const handleNextPage = () => {
            if (currentPage < 4) {
                setCurrentPage(currentPage + 1);
            }
        };

        const handlePrevPage = () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        };
        const renderPageContent = () => {
            switch (currentPage) {
                case 1:
                    return <p>Results: {results ? results.join(", ") : "No results"}</p>;
                case 2:
                    return <p>Time To Train: {trainingTime} seconds</p>;
                case 3:
                    return <p>Memory Usage: {memoryUsage}</p>;
                case 4:
                    return <p>Page 4 content</p>;
                
                default:
                    return null;
            }
        };

        return (
          <div className="results-popup">
            {renderPageContent()}
            
    
            <div className='result-toggle'>
                <button onClick={handlePrevPage} className='result-toggle-button'>Previous</button>
                <button onClick={handleNextPage} className='result-toggle-button'>Next</button>
            </div>


            <div className='close'>
                <button onClick={onClose} >Close</button>
            </div>
            
          </div>
        );
    };

    const handleTrainClick = async () => {
        setIsTraining(true);
        const startTime = performance.now();
        const startMemory = performance.memory;

  
          

    
        // TensorFlow.js
        // IMPLEMENTING NAIVE KMEANS

        // Translation Functions
        function genRandLike(shape, data) {
            return tf.randomNormal(shape, 0, 1, 'float32');
        }
        
        // Function to compute pairwise affinity between data and centroids
        function affinity(data, centroids) {
            const distances = tf.sub(data, centroids);
            return tf.norm(distances, 2, 2).square();
        }
        
        // KMeans Function
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
                    const allIndices = Array.from({ length: centr.shape[0] }, (_, i) => i);  //size 5
                    console.log('Allindecies: ', allIndices)
                    const hasNoData = allIndices.filter((index) => !hasData.includes(index)); //size 4
                    console.log('hasData: ', hasData)
                    const flattenedIndices = hasNoData.map((index) => index * centr.shape[1]);
        
                    for (let index = 0; index < hasNoData.length; index++) {
                        centr[index] = genRandLike(21, data)
                    }
                    const updates = genRandLike([hasNoData.length * centr.shape[1]], data);
                    const rowsToUpdate = tf.tensor(flattenedIndices.map((index) => Array.from({ length: centr.shape[1] }, (_, i) => updates[index + i])));
                    /* target
                        groups = np.argmin(affinity(np.expand_dims(data, 1), centr), axis=1)
                        has_data = np.unique(groups)
                        has_no_data = np.setdiff1d(np.arange(centr.shape[0]), has_data, assume_unique=True)
            
                        # Randomly replace centroids not close to data
                        prior = centr.copy()
                        centr[has_no_data, :] = gen_rand_like((has_no_data.shape[0], data.shape[-1]), data)
                    */
                    
                    // Randomly replace centroids not close to data
                    prior = centr.clone();
                    centr = tf.mul(centr, tf.transpose(tf.scalar(1).sub(rowsToUpdate))).add(rowsToUpdate);
                    
                    //centr[has_no_data, :] = gen_rand_like((has_no_data.shape[0], data.shape[-1]), data)
                    // const randomData = tf.randomNormal([numRows, numCols]);
                    console.log("Before where:", centr.shape);
                     
        
                        /*  
                        const numRows = 1;
                        const numCols = 5;  // Number of columns in the tensor

                        // Generate random data for a tensor's row
                        const randomData = tf.randomNormal([numRows, numCols]);

                        // Print the generated tensor
                        randomData.print();
                        */
        
                    
        
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

        loadCSVData().then((benignData) => {
            // Now you can use benignData in your K-Means or other computations
            const numCentroids = 5;
            const numIters = 1;
            const eps = 1.0;
            console.log(benignData)
            kMeans(benignData, numCentroids, numIters, eps).then((bestCentroids) => {
                console.log(bestCentroids.shape);
            });
        });
        


        // END OF OF KMEANS

        const endTime = performance.now();
        const endMemory = performance.memory;
        setTrainingTime(((endTime-startTime)/1000).toFixed(2)); 
        setMemoryUsage(endMemory-startMemory);       

        
        setResults();

        setIsTraining(false);
        setAfterTraining(true);
        setData([2,3]);
    };

    const handleViewResultsClick = () => {
        setShowResults(true);
    };
    
    const handleCloseResults = () => {
        setShowResults(false);
    };
    

    return (  
        <div className='kmeans' style={{ height: '100vh', backgroundColor: '#333' }}>
            
            <div style={{  display: "flex", flexDirection: "row", alignItems: "center"  }} className="title">
                
                <h1 className="title-text">KMeans</h1>
                <button className="train-button" onClick={afterTraining? handleViewResultsClick : handleTrainClick} > 
                    {afterTraining? "View Results!" : isTraining ? "Training..." : "Train Model"}
                </button>
                

                {(isTraining || afterTraining) && (
                    <div style={{ flex: 10, marginLeft: "20px"}}>
                        <p></p>
                        <div
                        style={{
                        width: `${trainingProgress/4}%`,
                        height: "20px",
                        backgroundColor: "lime",
                        }}
                        ><p style={{ textAlign:'left', marginLeft:"20px"}}>{Math.floor(trainingProgress)}%</p></div>
                    </div>
                )}

            </div>
            <p>{data}</p>

            <div className="next-button">
                <Link to="conclusion" smooth={true} duration={500} className='next-button-link'>TO CONCLUSION </Link>
            </div>

            
            {showResults && <ResultsPopup onClose={handleCloseResults} />}

            <h1>Explain how model works</h1>
            
       </div>
        
    );
}
 
export default KMeans;