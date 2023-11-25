import React from "react";
import { Link, Element } from 'react-scroll';
import './Model.css'
const Introduction = () => {
    return (  
        
        <div className='section' id='introduction' style={{
            height: '100vh',
            backgroundColor: '#333' 
        }}>
            <div className="title">
                <h1 className="title-text">Wat AI Cybersecurity Web Demo</h1>
            </div>

            <div>
                <h1>Objective</h1>
            </div>

            <div>
                <h1>Dataset</h1>
            </div>
            
            


            <div className="next-button">
                <Link to='kmeans' smooth={true} duration={500} className="next-button-link">TO OUR MODELS </Link>
            </div>
            
            
            
        </div>
        
    );
}
 
export default Introduction;