
import './App.css';

import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/admin/Dashboard';
// import Dashboard from './components/Dashboard';
import Layout from './components/admin/Layout';
import Products from './components/admin/Products';
import SalesTable from './components/admin/SalesTable';
import SalesExpenseData from './components/admin/SalesExpenseData';

function App() {
  return (
    <div className="App">
        {/* <Login/> */}

        <BrowserRouter>

        <Routes>
          <Route path='/' element={<Login/>}/>

          <Route path='/admin' element={<Layout/>}>
          <Route index element={<Dashboard/>} />
          <Route path='/admin/products' element={<Products/>}/>
          <Route path='/admin/salestable'element={<SalesTable/>}/>
          <Route path='/admin/salesexpensedata'element={<SalesExpenseData/>}/>
         
          </Route>
          {/* <Route path='/dashboard' element={<Dashboard/>}>
          </Route> */}
        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
