import { useState, useEffect } from 'react'
import logoVite from './assets/logo-vite.svg'
import logoElectron from './assets/logo-electron.svg'
import './App.css'
import { UserService, User } from './utils/services/UserService'

function App() {
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState<User[]>([]) // Specify the type of 'users' as an array of 'User' objects

  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  useEffect(() => {
    // handleFetchUsers();
  }, []);
  
  function handleFetchUsers() {
    setIsLoading(true);
    UserService.getUsers().then((users) => {
      setUsers(users);
      setIsLoading(false);
    });
  }

  
  return (
    <div className='App'>
      {isLoading && <p>Loading users...</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.first_name} {user.last_name} {user.user_role}</li>
        ))}
      </ul>

      <button onClick={handleFetchUsers}>Fetch Users</button>
    </div>
  )
}

export default App