import React, { Component } from 'react';

class VideoListItem extends Component{
  constructor(props){
    super(props);
    this.state = {
      video: null
    }
  }

  render() {
    const imageUrl = this.props.video.snippet.thumbnails.default.url;
    return(
      <li className="list-group-item" onClick={() => chooseVideo(video)}> {/*不能写成 onClick={chooseVideo},
                                                                             不是因为this指向不明,
                                                                             而是因为没有办法让video被带入参数*/}
            <div className="video-list media">
                <div className="media-left">
                    <img className="media-object" src={imageUrl}/>
                </div>
                <div className="media-body">
                    <div className="media-heading">
                        {video.snippet.title}
                    </div>
                </div>
            </div>
        </li>
    )
  }
}

export default VideoListItem;