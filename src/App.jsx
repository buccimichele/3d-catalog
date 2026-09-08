import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClickSpark from "./components/ClickSpark";
import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";

export default function App() {
  return (
    <BrowserRouter>
      <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={18} sparkCount={8} duration={450}>
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contatti" element={<Privacy />} />
        </Routes>
      </ClickSpark>
    </BrowserRouter>
  );
}
