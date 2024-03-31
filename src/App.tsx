import { useState, useEffect } from 'react'
import './App.css'
import { UserService, User } from './utils/services/UserService'
import LoginForm from './components/LoginForm'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true);

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
      {/* {isLoading && <p>Loading users...</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.first_name} {user.last_name} {user.user_role}</li>
        ))}
      </ul>
      <button onClick={handleFetchUsers}>Fetch Users</button> */}
      <LoginForm />
    </div>
  )
}

export default App