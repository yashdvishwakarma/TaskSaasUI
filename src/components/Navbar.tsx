import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";


export default function NavBar() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };
  
  const user = localStorage.getItem("user");
  const name = user ? JSON.parse(user).fullName : null;


  return (
    <nav style={{ padding: 10, paddingBottom: 16, borderBottom: "1px solid #ddd" }}>
      <Link to="/dashboard">TaskSaaS</Link>
      <span style={{ float: "right" }}>
        {name ? <>Hi, {name} | <Button variant="contained"  onClick={logout}>Logout</Button></> : <Link to="/login">Login</Link>}
      </span>
    </nav>
  );
}