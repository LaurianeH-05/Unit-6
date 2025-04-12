import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';

export default function Layout() {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        {/* Add loading spinner while content loads */}
        <div className="initial-loader"></div>
        <Outlet />
      </main>
    </div>
  );
}