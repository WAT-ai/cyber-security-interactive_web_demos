import React from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';

import Introduction from './Introduction';
import KMeans from './KMeans';
import Conclusion from './Conclusion';
import { BrowserRouter as Router} from 'react-router-dom';



function App() {
  return (

    
    <Router>
      <div className="App">      
        
        <div className="content">
          <Introduction />
        </div>   
       
        <div className="model">
          <KMeans />
        </div>

        <div className="section">
          <Conclusion />
        </div>  
      
    </div>
    </Router>
  );
}

export default App;
