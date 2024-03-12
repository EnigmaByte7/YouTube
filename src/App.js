import './App.css';
import Header from './Header';
import yt from './ytlogo.png';
import {useState} from 'react';
import srch from './searchbtn.png';
import Options from './Options';
import Nav from './Nav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Player from './Player';
import Top from './Top';

function App() {
  let [query,setQuery] = useState('dsa');
  console.log(query);
  function handleclick(q){
    setQuery(q);
  }
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={
          <div className="App">
          <Nav fun={handleclick}/>
          <div className='main'>
            <div className='top'> 
              <Top func={handleclick} q={query} dark={0}/>
              <Options func={handleclick} />
            </div>
              <Header q={query}/>
            </div> 
        </div>
        }></Route>
        <Route path='/video/:id/:cid/:name/:query/:subs/:likes/:views/:desc/:cname/:curl' element={
          <div>
            <Top func={handleclick} q={query} dark={1}/>
            <Player q={query}/>
          </div>}>
        </Route>
      </Routes>
    </Router>
  )}



export default App;
