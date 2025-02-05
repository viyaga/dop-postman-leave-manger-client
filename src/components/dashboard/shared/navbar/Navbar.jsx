import "./navbar.scss";
import ToggleSidebarBtn from "./toggleSidebarBtn/ToggleSidebarBtn";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="/logo.svg" alt="" />
        <span>DOP Leave Manager</span>
      </div>
      <div className="icons">
        <ToggleSidebarBtn />
        {/* 
        <div className="user">
          <img
            src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
          />
          <span>Jane</span>
        </div>
       */}
      </div>
    </div>
  );
};

export default Navbar;
