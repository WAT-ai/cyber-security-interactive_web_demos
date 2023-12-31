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
                <p>
                    Our team has been trying to detect hackers' network activity 
                    on smart devices. This is difficult because smart devices 
                    like Amazon Alexas or security cameras are usually powered 
                    by small microcontrollers. Thus, it's impossible to run 
                    intensive software on them. 
                </p>
            </div>

            <div>
                <h1>Dataset</h1>
                <p>
                    Even worse, we've been working with the Canadian Institute 
                    of Cybersecurity's IoT 2023 dataset, which has over 14 GB of 
                    data! Clearly, we can't store (yet alone train algorithms on) a
                    ll this data on a small smart device. Thus, we have some 
                    tricky design requirements in creating ways to detect hackers:
                </p>
                <ol>
                    <li>
                        We had to very carefully find the best statistics about hackers' network requests and use only that minimal information. Ex: We want to know if the hacker has a web request, but not down to nitty gritty details like whether HTTP or HTTPS protocols are used. 
                    </li>
                    <li>
                        We needed an algorithm that we could train on a massive dataset in the cloud. The aim is to store the algorithm on a microcontroller without taking up much space. This is like the ‘knowledge' from the gigabytes of data is ‘distilled' into a much smaller format.
                    </li>
                </ol>

                <p>
                    Given this context, there are a few unsupervised learning AI algorithms that can meet our needs. This is where the negative selection and K-means algorithms come in. </p>
            </div>    
        </div>
        
    );
}
 
export default Introduction;