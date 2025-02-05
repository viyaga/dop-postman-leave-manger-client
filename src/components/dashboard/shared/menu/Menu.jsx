import { menu } from "@/data";
import "./menu.scss";
import { MdLogout } from "react-icons/md";
import { signOut } from "@/auth";
import LinkItem from "./linkItem/LinkItem";
import CloseBtn from "./closeBtn/CloseBtn";

const Menu = () => {
  return (
    <div className="menu">
      <div className="header">
        <div className="logo">
          <img src="/logo.svg" alt="" />
          <span>DOPLM</span>
        </div>
        <CloseBtn />
      </div>

      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <LinkItem key={listItem.id} url={listItem.url} icon={listItem.icon} title={listItem.title} />
          ))}
        </div>
      ))}
      <form action={async () => {
        "use server";
        await signOut();
      }}
      >
        <button className="logout">
          <MdLogout size={24} />
          <span className="logout-title">Logout</span>
        </button>
      </form>
    </div>
  );
};

export default Menu;
