import { useState } from "react";
import Home from "./Home";
import InputForm from "./InputForm";
import Report from "./Report";

function App() {
  const [menu, setMenu] = useState("home");

  return (
    <div className="min-h-screen bg-gray-100">
      {menu === "home" && <Home setMenu={setMenu} />}
      {menu === "input" && <InputForm setMenu={setMenu} />}
      {menu === "report" && <Report setMenu={setMenu} />}
    </div>
  );
}

export default App;
