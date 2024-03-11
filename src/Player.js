import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import up from './up.png';
import down from './dwn.png';
let key = 'AIzaSyBiM1E3IvBR8skWHQY_vzsij8WN89K7VHo';

async function fetchVidDetails(id){
  try {
      let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&part=statistics&part=snippet&id=${id}&key=${key}`;
      const response = await fetch(url);
      if (!response.ok){
          throw new Error('Response not ok')
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
      const data = await response.json();
      let views = await numberformat(data.items[0].statistics.viewCount);
      let date = await data.items[0].snippet.publishedAt;
      let likes = await numberformat(data.items[0].statistics.likeCount);
      return {
          views : views,
          date: date,
          publishedAt: await resolveDate(date),
          likes: likes
      }
  }
  catch(error){
      console.log(error);
  }
}

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

async function fetchData(query,setResult) {
  try {
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=10&type=video&key=${key}`;
      const response  = await fetch(url)
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      let i;
      let temp=[];
      for (i = 0; i<10; i++){
          temp.push({
              genDetails:{title: data.items[i].snippet.title,
                         thumbnails: data.items[i].snippet.thumbnails.high.url,
                         channelName: data.items[i].snippet.channelTitle},
              vidDetails: await fetchVidDetails(data.items[i].id.videoId),
              channelDetails: await fetchChannel(data.items[i].snippet.channelId),
              vidId :await data.items[i].id.videoId,
              channelId: data.items[i].snippet.channelId
          })
      }
      setResult(temp);
  }
  catch(error){
      console.log(error);
  }

}

export default function Player(props) {
    const {id , cid , name, query, subs, likes, views, desc,cname,curl} = useParams();
    const [result,setResult] = useState([]);
    useEffect(() => {
      const fetchDataAsync = async () => {
          await fetchData(query,setResult);
          console.log(result);
      };

          fetchDataAsync();
      }, [query]);
    
    return (
    <div className='vidplayer'>
      <div className='player'>
        <iframe
        id='player'
          width="100%"
          height="480"
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder="0"
          title="player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      <div className='vid-title'>{name}</div>
      <div className='channel-details'>
        <img src={curl} alt='chlogo'></img>
        <div className='cdetails'>
          <div className='cname'>{cname}</div>
          <div className='subs'>{subs} Subscribers</div>
        </div>
        <div className='subs-button'>Subscribe</div>
        <div className='likes-btn'>
          <div className='upvote'><img src={up}></img>{likes}</div>
          <div className='downvote'><img src={down}></img></div>
        </div>
      </div>
        <div className='description'>
          <div className='views'>{views} views</div>
          <div className='desc'>{desc}</div>
        </div>
      </div>
      <div className='suggest'>
        {
          result.map((data) =>    {if(data.vidId !== id) {return(
          <div className='suggest-result'>
              <div className='sub-img'>
                <img src={data.genDetails.thumbnails} alt='thumbnail'></img>
              </div>
              <div className='sub-desc'>
              <Link to={`/video/${data.vidId}/${data.channelId}/${encodeURIComponent(data.genDetails.title)}/${props.q}/${data.channelDetails.subscount}/${data.vidDetails.likes}/${data.vidDetails.views}/${encodeURIComponent(data.channelDetails.channelDescription)}/${data.genDetails.channelName}/${encodeURIComponent(data.channelDetails.channelimg)}`} key={data.vidId} style={{textDecoration:'none', color:'rgb(15,15,15)'}}>
                <div className='sub-title'>{data.genDetails.title}</div>
              </Link>
                <div className='sub-chname'>{data.genDetails.channelName}</div>
                <div className='sub-views'>{data.vidDetails.views} views ● {data.vidDetails.publishedAt}</div>
              </div>
            </div>
            )}})
        }
      </div>
    </div>
    )
}
