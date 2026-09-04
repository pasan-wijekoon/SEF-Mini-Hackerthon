import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

type Role = 'guest' | 'donor' | 'recipient';

interface NavLink {
    path: string;
    label: string;
    roles?: Role[];
}

export function Navbar() {
    const { role } = useRole();
    const location = useLocation();

    const navLinks: NavLink[] = [
        { path: '/', label: 'Home' },
        { path: '/donate', label: 'Donate', roles: ['donor'] },
        { path: '/my-listings', label: 'My Listings', roles: ['donor'] },
        { path: '/browse', label: 'Browse', roles: ['recipient'] },
        { path: '/about', label: 'About' },
    ];

    const filteredLinks = navLinks.filter((link) => {
        if (!link.roles) return true;
        return link.roles.includes(role);
    });

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    FoodShare LK
                </Link>

                <div className="navbar-links">
                    {filteredLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar-role">
                    <span className="role-badge">
                        {role === 'guest' ? 'Guest' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                </div>
            </div>
        </nav>
    );
}