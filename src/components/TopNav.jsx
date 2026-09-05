import { Link, useLocation } from "react-router-dom";
import "./TopNav.css";

export default function TopNav() {
  const { pathname } = useLocation();

  return (
    <nav className="top-nav" aria-label="Navigazione principale">
      <Link to="/" className={`top-nav-link ${pathname === "/" ? "active" : ""}`}>
        Home
      </Link>
      <Link to="/contatti" className={`top-nav-link ${pathname === "/contatti" ? "active" : ""}`}>
        Contatti
      </Link>
    </nav>
  );
}
