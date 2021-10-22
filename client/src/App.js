import {Helmet} from 'react-helmet'
import {Switch, Route} from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home';
import Collobarete from './Components/Collobarete';
import Contact from './Components/Contact';
import Groups from './Components/Groups';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Logout from './Components/Logout';
import Admin from './Components/Admin';
import NotAuth from './Components/401';
import NotFound from './Components/404'
import Profile from './Components/following';
import userId from './Components/userId'
import LongPost from './Components/LongPost';
import Getimg from './Components/Getimg';
import VerifyEmail from './Components/VerifyEmail';
import Verify from './Components/Verify';
import Dm from './Components/Dm'

function App() {
  return (

    <Layout>
     <Switch>
       <Route exact path ="/" component = {Home}/>
       <Route exact path ="/admin" component = {Admin}/>
       <Route exact path ="/collobarete" component = {Collobarete}/>

       <Route exact path ="/contact" component = {Contact}/>
       <Route exact path ="/groups" component = {Groups}/>
       <Route exact path ="/signup" component = {Signup}/>
       <Route exact path ="/signin" component = {Signin}/>
       <Route exact path = "/logout" component = {Logout} />
       <Route exact path = "/user/:id" component = {userId} />
       <Route exact path = "/post/:id" component = {LongPost} />
       <Route exact path = "/getimg" component = {Getimg} />
       <Route exact path = "/verify/:url" component = {VerifyEmail} />
       <Route exact path = "/verify/" component = {Verify} />
       <Route exact path = "/dm/:id" component = {Dm} />
       <Route exact path = "/401" component = {NotAuth} />
       
       

       <Route component = {NotFound} />
     </Switch>
    </Layout>

  );
}

export default App;


//check if user exist here