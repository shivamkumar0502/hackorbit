
import {Routes, Route ,Navigate, useLocation} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete";
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import Profile from "./pages/Profile";
import InterviewPage from "./pages/InterviewPage";
import LiveInterview from "./pages/LiveInterview";
import InterviewResult from "./pages/InterviewResult";
import InterviewLobby from "./pages/InterviewLobby";
import LandingPage from "./pages/LandingPage";

import Visualizer from './pages/Visualizer';
import Dashboard from './pages/Dashboard';
import Contest from './pages/Contest';

function App(){
  
  const dispatch = useDispatch();
  const location = useLocation();
  const loginDestination = ['/dashboard', '/contest'].includes(location.state?.from) ? location.state.from : '/home';
  const {isAuthenticated,user,initialized} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (!initialized) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
    <Routes>

{/* Landing Page */}

<Route path="/" element={<LandingPage />} />
<Route path="/visualizer" element={<Visualizer />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/contest" element={<Contest />} />

{/* Auth */}

<Route path="/login" element={isAuthenticated ? <Navigate to={loginDestination} replace /> : <Login />} />

<Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />

{/* Main Platform */}
<Route path="/practice" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />

<Route path="/home" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />

<Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />

{/* <Route path="/problem/:problemId" element={<ProblemPage />} /> */}
<Route
path="/problem/:problemId"
element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />}
/>

<Route path="*" element={<Navigate to="/" />} />

{/* Interview */}
<Route path="/live-interview/:sessionId" element={isAuthenticated ? <LiveInterview /> : <Navigate to="/login" />} />
<Route path="/interview-result/:sessionId" element={isAuthenticated ? <InterviewResult /> : <Navigate to="/login" />} />

<Route path="/interview" element={isAuthenticated ? <InterviewPage /> : <Navigate to="/login" />} />

<Route path="/live-interview" element={isAuthenticated ? <LiveInterview /> : <Navigate to="/login" />} />

<Route path="/interview-result" element={isAuthenticated ? <InterviewResult /> : <Navigate to="/login" />} />

<Route path="/interview-lobby" element={isAuthenticated ? <InterviewLobby /> : <Navigate to="/login" />} />

{/* Admin */}

<Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />

<Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />

<Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />

<Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />

<Route 
path="/admin/upload/:problemId"
element={
isAuthenticated && user?.role === 'admin'
? <AdminUpload />
: <Navigate to="/" />
}
/>

</Routes>
  </>
  )
}

export default App;
