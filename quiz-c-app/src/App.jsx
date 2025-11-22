import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import QuizPage from "./pages/quizPage/quizPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz-langage-c" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
