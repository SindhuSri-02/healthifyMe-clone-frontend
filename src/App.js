import {React} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import User from './pages/User'
// import RefreshHandler from './RefreshHandler'

const App = ()=>{
    // const [isAuthenticated, setIsAuthenticated] = useState(false)
    // const PrivateRoute = ({element}) =>{
    //     return isAuthenticated ? element : <Navigate to="/login" />
    // }

    return(
        <div>
        <BrowserRouter>
        {/* <RefreshHandler setIsAuthenticated={setIsAuthenticated} /> */}
      <Routes>
        <Route path={["/", "/login"]} element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
        </div>
    )
}

export default App;