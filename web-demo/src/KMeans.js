import { Link, Element } from 'react-scroll';
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import './Model.css'

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
        
    
        // TensorFlow.js
        // This is just a placeholder, replace it actual model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
        model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
    
        const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
        const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);
    
        const startTime = performance.now();
        const startMemory = performance.memory;
        await model.fit(xs, ys, {
            epochs: 100,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                  const progress = ((epoch + 1) / 100) * 100;
                  setTrainingProgress(progress);
                },
            },
        });
        const endTime = performance.now();
        const endMemory = performance.memory;
        setTrainingTime(((endTime-startTime)/1000).toFixed(2)); 
        setMemoryUsage(endMemory-startMemory);       

        const modelResults = await model.predict(tf.tensor2d([2, 3], [2, 1])).data();
        setResults(Array.from(modelResults));

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
                <Link to="dbscan" smooth={true} duration={500} className='next-button-link'>TO NEXT MODEL </Link>
            </div>

            
            {showResults && <ResultsPopup onClose={handleCloseResults} />}

            <h1>Explain how model works</h1>
            
       </div>
        
    );
}
 
export default KMeans;