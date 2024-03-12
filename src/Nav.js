import Menu from './menu.png';
import Home from './home.png';
import Trending from './fire.png';
import Game from './game.png';
import Music from './music.png';
import News from './news.png';
import Sports from './trophy.png';

function Nav(props){
    let values = [
        { name: 'Trending', src: Trending },
        { name: 'Game', src: Game },
        { name: 'Music', src: Music },
        { name: 'News', src: News },
        { name: 'Sports', src: Sports }
    ];
    return (            
    <div className="nav" >
            <a href='https://youtube-rosy-seven.vercel.app/'> 
            <div className='flask' >
                <img className='navimg' src={Home}></img>
                <div className='caption'>Home</div>
            </div> 
            </a>
            {values.map((result)=>(
                    <div className='flask' onClick={()=>{props.fun(result.name)}}>
                        <img className='navimg' src={result.src}></img>
                        <div className='caption'>{result.name}</div>
                    </div> 
            ))}
    </div>       
    )      
} 
export default Nav;
