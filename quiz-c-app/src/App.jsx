import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import QuizPage from "./pages/quizPage/quizPage";
import ResultPage from "./pages/resultPage/resultPage";
import ClassementPage from "./pages/ClassementPage/ClassementPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz-langage-c" element={<QuizPage />} />
        <Route path="/resultats" element={<ResultPage />} />
        <Route path="/classements" element={<ClassementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
