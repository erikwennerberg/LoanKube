import React from 'react';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
          <NavLink to="/">Main Dashboard</NavLink>
          <NavLink to="/admin">Admin Page</NavLink>
       </div>
    );
}
 
export default Navigation;