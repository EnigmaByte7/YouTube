import { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';


function Header(props) {
    const [list, setList] = useState([]);

    useEffect(() => {

        const key = process.env.REACT_APP_API_KEY;
        async function fetchChannel(cid){
            try{
                let url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&part=statistics&part=brandingSettings&id=${cid}&key=${key}`;
                const response = await fetch(url);
                if (!response.ok){
                    throw new Error("Bad response")
                }
                let data = await response.json();
                async function numberformat(number){
                    if (number <= 999){
                        return number;
                    }
                    else if(number <= 9999 || number <= 99999 || number <= 999999){
                        return ((number/1000).toFixed() + 'K');
                    }
                    else {
                        return ((number/1000000).toFixed()+'M');
                    }
                }
                return {
                    channelimg: data.items[0].snippet.thumbnails.default.url,
                    subscount: await numberformat(data.items[0].statistics.subscriberCount),
                    channelDescription: data.items[0].brandingSettings.channel.description
                }
            }
            catch(error){
                console.log(error);
            }
        }
        async function fetchVidDetails(id){
            try {
                let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&part=statistics&part=snippet&id=${id}&key=${key}`;
                const response = await fetch(url);
                if (!response.ok){
                    throw new Error('Response not ok')
                }
                async function numberformat(number){
                    if (number <= 999){
                        return number;
                    }
                    else if(number <= 9999 || number <= 99999 || number <= 999999){
                        return ((number/1000).toFixed() + 'K');
                    }
                    else {
                        return ((number/1000000).toFixed()+'M');
                    }
                }
                async function resolveDate(dt){
                    let today = new Date();
                    date = new Date(dt);
                    if (today.getFullYear() - date.getFullYear() > 0){
                        let year = today.getFullYear() - date.getFullYear();
                        return (year > 1 ? `${year} years ago` : `${year} year ago`);
                    }
                    else if(today.getMonth() - date.getMonth() > 0){
                        let month = today.getMonth() - date.getMonth();
                        return (month > 1 ? `${month} months ago` : `${month} month ago`);
                    }
                    else if(today.getDate() - date.getDate() > 0){
                        let day = today.getDate() - date.getDate();
                        return (day > 1 ? `${day} days ago`: `${day} day ago`);
                    }
                    else if (today.getHours() - date.getHours() > 0){
                        let hours = today.getHours() - date.getHours();
                        return (hours > 1 ? `${hours} hours ago`:`${hours} hour ago`);
                    }
                    else{
                        return "latest";
                    }
                }
                async function timeformat(text){
                    text = text.replace(/(PT|S|P)/g,"");
                    text = text.replace(/(H|M|DT)/g,":");
                    if (text.length === 1)
                    {
                        text = '00:0'+text;
                    }
                    else if (text.length === 2){
                        text = '00:'+text;
                    }
                    else if (text.length === 3){
                        text = '0'+text+'0';
                    }
                    else if (text.length === 4){
                        text = '0'+text;
                    }
                    return text;
                }
                const data = await response.json();
                let views = await numberformat(data.items[0].statistics.viewCount);
                let likes = await numberformat(data.items[0].statistics.likeCount);
                let text = await timeformat(data.items[0].contentDetails.duration);
                let date = await data.items[0].snippet.publishedAt
                return {
                    views : views,
                    likes: likes,
                    duration: text,
                    date: date,
                    publishedAt: await resolveDate(date)
                }
            }
            catch(error){
                console.log(error);
            }
        }
    
        
        async function fetchData() {
            try {
                let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${props.q}&maxResults=10&type=video&key=${key}`;
                const response  = await fetch(url)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                let result = [];
                let i;
                for (i = 0; i<10; i++){
                    result.push({
                        genDetails:{title: data.items[i].snippet.title,
                                   thumbnails: data.items[i].snippet.thumbnails.high.url,
                                   channelName: data.items[i].snippet.channelTitle},
                        vidDetails: await fetchVidDetails(data.items[i].id.videoId),
                        channelDetails: await fetchChannel(data.items[i].snippet.channelId),
                        vidId :await data.items[i].id.videoId,
                        channelId: data.items[i].snippet.channelId
                    })
                }
                setList(result);
            }
            catch(error){
                console.log(error);
            }

        }
        fetchData();
    }, [props.q]);

    console.log(list)
    return (
        <div className='box'>
            {
                (list && list.length > 0) ?
                    list.map(result => (
                        <div className='result' >
                            <div className='img-container'>
                                <img src={result.genDetails.thumbnails} alt="Thumbnail"></img>
                            </div>
                            <div className="time">{result.vidDetails.duration}</div>
                            <div className='details'>
                                <div className='container'>
                                    <div className='logo'>
                                        <img src={result.channelDetails.channelimg} alt='channelimg'></img>
                                    </div>
                                </div>
                                <div className='text'>
                                    <Link to={`/video/${result.vidId}/${result.channelId}/${encodeURIComponent(result.genDetails.title)}/${props.q}/${result.channelDetails.subscount}/${result.vidDetails.likes}/${result.vidDetails.views}/${encodeURIComponent(result.channelDetails.channelDescription)}/${result.genDetails.channelName}/${encodeURIComponent(result.channelDetails.channelimg)}`} key={result.vidId} style={{textDecoration:'none'}}>
                                    <div className='title'>{result.genDetails.title}</div>                    
                                    </Link>
                                    <div className='viddetails'>
                                        <div className='channelname'>{result.genDetails.channelName}</div>
                                        <div className='date'>{result.vidDetails.views} views <span id='dot'>●</span> {result.vidDetails.publishedAt}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    <p></p>
            }
        </div>
    )
}
    
export default Header;