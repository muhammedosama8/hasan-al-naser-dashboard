import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from '../../../images/logo.png'

export function  NavMenuToggle(){
	setTimeout(()=>{	
		let mainwrapper = document.querySelector("#main-wrapper");
		if(mainwrapper.classList.contains('menu-toggle')){
			mainwrapper.classList.remove("menu-toggle");
		}else{
			mainwrapper.classList.add("menu-toggle");
		}
	},200);
}

const NavHader = () => {
   const [toggle, setToggle] = useState(false);

   return (
      <div className="nav-header">
         <Link to="/" className="brand-logo">
            <img 
               className="brand-title" 
               src={logoImg} 
               alt="logo" 
               style={{
                  height: '100%',
                  width: '70%',
                  borderRadius: '0'
               }} 
            />
         </Link>

         <div className="nav-control p-0" 
            onClick={() => {
               setToggle(!toggle)
               NavMenuToggle()
            }}
         >
            <div className={`${toggle ? "is-active" : ""}`}>
               <i className="la la-angle-double-left"></i>
            </div>
         </div>
      </div>
   );
};

export default NavHader;
