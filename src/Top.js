import srch from './searchbtn.png';
import yt from './ytlogo.png';
import ytdark from './yt-dark.png';
import mobyt from './yt-mobile.png';
import { useNavigate } from 'react-router-dom';

window.addEventListener('load', function() {
  setInterval(function() {
    document.getElementById('loadingbar').style.display = 'none';}
    , 4000);

});


export default function Top(props) {
    let history = useNavigate();
    return (

        <div className={`yt-header ${props.dark === 1 ? 'dark' : 'light'}`}>
        <div className='Loading'>
          <div id='loadingbar'></div>
        </div>
            <div className="yt-logo">
                <img src={props.dark === 1 ? (window.innerWidth < 768 ? mobyt : ytdark ) : (window.innerWidth < 768 ? mobyt : yt )} alt='yt-logo' />
            </div>
            <form id='search'>
                <input type='text' name='search' id='searchbar' placeholder="Search" className={props.dark === 1 ? 'dark-input' : 'light'} />
                <button type='button' className={props.dark === 1 ? 'dark-button' : 'light'} id='searchbtn' onClick={(event)=>{
                    event.preventDefault();
                    props.func(document.getElementById('searchbar').value);
                    history('/');
                }}>
                    <img className={`srchbtn ${props.dark === 1 ? 'dark-img' : 'light'}`} src={srch} alt='search' />
                </button>
            </form>
            <a href='https://github.com/EnigmaByte7'><div className="gitlink"></div></a>
        </div>
    );
}
