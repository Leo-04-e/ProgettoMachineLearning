import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import BarraNavigazione from "./componets/BarraNavigazione";
import Predict from "./componets/Predict";
import PredictFile from "./componets/PredictFile";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BarraNavigazione />}>
            <Route index element={<Navigate to="/Predict" />} />
            <Route path="Predict" element={<Predict />} />
            <Route path="PredictFile" element={<PredictFile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);