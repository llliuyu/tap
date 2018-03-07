import React from 'react';
import './VideoDetail.css';

const VideoDetail = ({activeVideo}) => {
  
  if(activeVideo === null) {
      return <div>
          Loading...
      </div>
  }
   
  const YTUrl = `https:www.youtube.com/embed/${activeVideo.id ? activeVideo.id.videoId : 'JGwWNGJdvx8'}`;
  return (
      <div className="video-detail">
          <div className="video-container">
              <iframe className="video" frameBorder="0" allowFullScreen src={YTUrl}></iframe>
          </div>
          <div className="details">
              <div>{activeVideo.snippet ? activeVideo.snippet.title : null}</div>
              <div>{activeVideo.snippet ? activeVideo.snippet.description : null}</div>
          </div>
      </div>   
  );
}

export default VideoDetail;