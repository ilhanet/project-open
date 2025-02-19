import { useRef, useState, useEffect } from 'react';
import "video-react/dist/video-react.css"; // import css

import videojs from 'video.js'; // version 7
import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';

const VideoHLS = ({srcVideo, typeVideo}) => {
  const videoRef = useRef();
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    const videoJsOptions = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      liveui: true,
      userActions: {hotkeys: true },
      
      sources: [
       {
          src: srcVideo,
          type: typeVideo,
        },  
      ],
      playbackRates: [0.5, 0.75, 1, 1.5, 2],
    }; 
      
    const p = videojs(
      videoRef.current,
      videoJsOptions,
      function onPlayerReaady() {
        console.log('onPlayerReady');
      }
    );

    setPlayer(p);
    return () => {
      if (player) {
        console.log('dispose');
        player.dispose();
      }
    };
    
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);

  function KeyPlayPause(event) {
    const video = document.getElementById('videoPlayerHLS_html5_api');

    if(event.key === ' ') {
      if (isPlaying) {
          video.pause();
          setIsPlaying(false);
      } else {
          video.play();
          setIsPlaying(true);
      }
    }
  }

  return (
    <div id='VideoEmbed' className='video-player-hls'
    onKeyDown={KeyPlayPause}
      >
        <div className="video-controls-container">

          <div data-vjs-player>
            <video
              playsInline
              id='videoPlayerHLS'
              onContextMenu={(e) => e.preventDefault()}
              ref={videoRef}
              className='video-js  vjs-big-play-centered'
            ></video>
          </div>
        </div>
    </div>
  );
};

VideoHLS.defaultProps = {
  className: '',
  autoplay: false,
  controls: true,
  playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  poster: '',
  sources: [],
  //  videoProgress: () => null,
};

export default VideoHLS;