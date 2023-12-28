import React from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import Navbar from './Navbar';
import Header from './Header';

import Introduction from './Introduction';
import KMeans from './KMeans';
import DBScan from './DBScan';
import NegativeSelection from './NegativeSelection';
import Conclusion from './Conclusion';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import KmeansPP from './KmeansPP';
import Normalizer from './normalizer';
import N from './N';


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
    
       /*  PUT THIS BETWEEN MODEL AND SECTION
      <div className="model">
        <DBScan />
      </div>  

      <div className="model">
        <NegativeSelection />
      </div>  
      */
  );
}

export default App;
