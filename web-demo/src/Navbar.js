import { Link, Element } from 'react-scroll';

const Navbar = () => {
    return (  
       <nav className="navbar">
        <h1>Wat AI Cybersecurity: Web Demo</h1>
        <div className="links">
            <a href="/">Home</a>
            <a href="/create" style={{
                color: "white",
                backgroundColor: '#f1356d',
                borderRadius: '8px'
            }}>New Blog</a>
        </div>
       </nav> 
    );
}
 
export default Navbar;