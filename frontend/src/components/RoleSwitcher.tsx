import { useRole } from '../context/RoleContext';

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  const roles = [
    { value: 'guest', label: 'Guest' },
    { value: 'donor', label: 'Donor' },
    { value: 'recipient', label: 'Recipient' },
  ];

  return (
    <div className="role-switcher">
      <label htmlFor="role-select" className="role-switcher-label">
        Switch Role:
      </label>
      <select
        id="role-select"
        value={role}
        onChange={(e) => setRole(e.target.value as 'guest' | 'donor' | 'recipient')}
        className="role-switcher-select"
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}