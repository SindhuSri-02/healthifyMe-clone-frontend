import {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'

function App() {
  const [email,SetEmail] = useState('');
  const [password,SetPassword] = useState('');

  const navigate = useNavigate()

  async function loginUser(event) {
    event.preventDefault();

    const response = await fetch('http://localhost:1337/api/authenticate/login',{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({email,password})
    })

    const data = await response.json()
    const {success,jwtTocken,user} = data
    if(success){
      localStorage.setItem('token',jwtTocken)
      localStorage.setItem('loggedInUser',user)
      setTimeout(() =>{
        navigate('/home')
      },1000)
    }
  }

  return (
    <div class="div-container">
        <h2>Login</h2>
        <form onSubmit={loginUser}>
            <input type="email" placeholder='email' value={email} onChange={(e)=>SetEmail(e.target.value)} required />
            <br />
            <input type="password" placeholder='password' value={password} onChange={(e)=>SetPassword(e.target.value)} required />
            <br />
            <input type="submit" value="Login"/>
        </form>
        <h3>Don't have an account? <a href="/register">Register</a> </h3>
      <ToastContainer />
    </div>
  );
}

export default App;
