import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [name,SetName] = useState('');
  const [email,SetEmail] = useState('');
  const [password,SetPassword] = useState('');

  const navigate = useNavigate()

  async function registerUser(event) {
    event.preventDefault();

    const response = await fetch('process.env.BACKEND_URL/api/authenticate/register',{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({name,email,password})
    })

    const data = await response.json()
    console.log(data)
    const {success} = data
    if(success){
      setTimeout(() =>{
        navigate('/login')
      },1000)
    }
  }

  return (
    <div class="div-container">
        <h2>Register</h2>
        <form onSubmit={registerUser}>
            <input type="text" placeholder='name' value={name} onChange={(e)=>SetName(e.target.value)} required />
            <br />
            <input type="email" placeholder='email' value={email} onChange={(e)=>SetEmail(e.target.value)} required />
            <br />
            <input type="password" placeholder='password' value={password} onChange={(e)=>SetPassword(e.target.value)} required />
            <br />
            <input type="submit" value="Register"/>
        </form>
        <h3>Already have an account? <a href="/login">Login</a> </h3>
    </div>
  );
}

export default App;
