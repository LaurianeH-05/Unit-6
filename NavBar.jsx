import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function NavBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  
  const menuItems = [
    {
      title: 'Markets',
      icon: '📈',
      path: '/',
      subItems: [
        { title: 'Forex', path: '/forex' },
        { title: 'Crypto', path: '/crypto' },
        { title: 'Commodities', path: '/commodities' }
      ]
    },
    {
      title: 'Learn',
      icon: '📚',
      path: '/learn',
      subItems: [
        { title: 'Basics', path: '/basics' },
        { title: 'Investing', path: '/investing' },
        { title: 'Budgeting', path: '/budgeting' }
      ]
    },
    {
      title: 'Portfolio',
      icon: '💼',
      path: '/portfolio'
    }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">💸</span>
        <h1>TeenFinance</h1>
      </div>

      <div className="navbar-menu">
        {menuItems.map((item) => (
          <div 
            key={item.title}
            className="nav-item"
            onMouseEnter={() => item.subItems && setActiveMenu(item.title)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link 
              to={item.path} 
              className="nav-link"
            >
              <span className="nav-icon">{item.icon}</span>
              {item.title}
              {item.subItems && <span className="dropdown-arrow">▾</span>}
            </Link>

            {item.subItems && activeMenu === item.title && (
              <div className="submenu">
                {item.subItems.map(sub => (
                  <Link
                    key={sub.title}
                    to={sub.path}
                    className="submenu-item"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="navbar-footer">
        <Link to="/profile" className="profile-link">
          <span className="profile-icon">👤</span>
          My Profile
        </Link>
      </div>
    </nav>
  );
}