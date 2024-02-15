import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

import MyNavbar from './my_component/MyNavbar';
import MyMain from './my_component/MyMain';
import MyLogin from './my_component/MyLogin';
import MyPage from './my_component/MyPage';
import MyEditPage from './my_component/my_form_component/MyEditPage';
import MyPageNotFound from './my_component/MyPageNotFound';

import API from './API';

function App() {
  const [backoffice, setBackOffice] = useState(false);

  const [pages_list, setPagesList] = useState([]);
  const [page, setPage] = useState(undefined);
  const [order, setOrder] = useState(false);

  const [user, setUser] = useState(undefined);
  const [logged_in, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        // NO need to do anything: user is simply not yet authenticated
      }
    };
    checkAuth();
  }, []);

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
  };

  const doLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser(undefined);
  };

  return (
    <Container fluid style={{ padding: '0px' }}>
      <BrowserRouter>
        <MyNavbar backoffice={backoffice} user={user} logged_in={logged_in} doLogout={doLogout} />
        <Routes>
          <Route path='/' element={<MyMain backoffice={backoffice} setBackOffice={setBackOffice} pages_list={pages_list} setPagesList={setPagesList} order={order} setOrder={setOrder} user={user} logged_in={logged_in} />} />
          <Route path='/:backoffice' element={logged_in ? <MyMain backoffice={backoffice} setBackOffice={setBackOffice} pages_list={pages_list} setPagesList={setPagesList} order={order} setOrder={setOrder} user={user} logged_in={logged_in} /> : <Navigate replace to='/' />} />
          <Route path='/pages/:id' element={<MyPage backoffice={backoffice} page={page} setPage={setPage} user={user} logged_in={logged_in} />} />
          <Route path='/edit/:id' element={logged_in ? <MyEditPage backoffice={backoffice} page={page} setPage={setPage} user={user} logged_in={logged_in} /> : <Navigate replace to='/' />} />
          <Route path='/add' element={logged_in ? <MyEditPage backoffice={backoffice} user={user} logged_in={logged_in} /> : <Navigate replace to='/' />} />
          <Route path='/login' element={logged_in ? <Navigate replace to='/backoffice' /> : <MyLogin setUser={setUser} setLoggedIn={setLoggedIn} loginSuccessful={loginSuccessful} />} />
          <Route path='/*' element={<MyPageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
