import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Modal, Progress, Icon } from 'antd';
// import Hls from 'hls.js';
import styled from 'styled-components';

import './index.scss';
import DroneVideo from '../../data/assets/img/drone_video.mp4';

import * as CONSTANTS from '../../data/config/constants';
import * as pageActions from '../../data/redux/page_details/actions';
import * as userActions from '../../data/redux/user_details/actions';

function mapStateToProps(state) {
    return {
        page_details: state.page_details
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, pageActions, userActions), dispatch)
    };
}


const PlayerWrapper = styled.div`
    position:relative;
`;
const PlayerInner = styled.div`
`;
const VideoTitle = styled.h2 `
    font-size: 22px;
    color: rgba(0, 0, 0 , 0.7);
    line-height: 25px;
    font-weight: 400;
`;
const VideoLiveButtonTitle = styled.span `
    display: inline-block;
    border: 1px solid red;
    color: white;
    padding: 2px 10px;
    animation: flash-red linear infinite 3s;
    margin-bottom: 10px;
    line-height: 25px;
    font-size: 14px;
    margin-right: 5px;
    font-weight: 400;
`;

class Home extends Component {
    state = {
        dronModalVisible: false,
        showProgress: false,
        showDoneMessage: false,
        percent: 10
    };

    componentWillMount() {
        this.props.actions.pageChanged(CONSTANTS.appPages.home);
        this.props.actions.getHomePage();
    }

    componentDidMount() {
        const video = this.player;
        // const streamURL = `https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8`;
        // const streamURL = `http://54.196.138.124/hls/movie.m3u8/index.m3u8`;

        const self = this;

        // setTimeout(() => {
        //     if (Hls.isSupported() && this.player) {
        //         const hlsConfig = {
        //             debug: true
        //         };

        //         const hls = new Hls(hlsConfig);
        //         hls.loadSource(streamURL);
        //         hls.attachMedia(video);
        //         hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        //             console.log(data);
        //             video.play();
        //         });
        //     } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        //         video.src = streamURL;
        //         video.addEventListener('canplay', function () {
        //             video.play();
        //         });
        //     }
        // }, 2000);

        video.src = DroneVideo;
        video.play();
        video.onplay = function() {
            setTimeout(() => {
                self.setState({
                    dronModalVisible: false,
                    showProgress: false,
                    showDoneMessage: false,
                    percent: 10
                }, () => {
                    self.showDronMessage();
                });
            }, 37000);
        };

        // setTimeout(() => {
        //     this.setState({
        //         dronModalVisible: false,
        //         showProgress: false,
        //         showDoneMessage: false,
        //         percent: 10
        //     }, () => {
        //         this.showDronMessage();
        //     });
        // }, 3000);
    }

    showDronMessage = () => {
        const self = this;
        this.setState({
            dronModalVisible: true,
            showProgress: true,
            message: 'Fetching nearest drone'
        }, () => {
            setTimeout(() => {
                self.setState({
                    percent: 25,
                    message: "Drone found!"
                }, () => {
                    setTimeout(() => {
                        self.setState({
                            percent: 50,
                            message: "Deploying drone"
                        }, () => {
                            setTimeout(() => {
                                self.setState({
                                    percent: 100,
                                    showDoneMessage: true
                                }, () => {
                                    setTimeout(() => {
                                        self.setState({
                                            dronModalVisible: false
                                        });
                                    }, 3000);
                                });
                            }, 2000);
                        });
                    }, 2000);
                });
            }, 3000);
        });
    }

    _onTouchInsidePlayer = () => {
        if(this.player.paused){
            this.player.play();
        }else{
            this.player.pause();
        }
    }

    render() {
        const style = {
            width: 640,
            height: 360,
            background: '#000'
        };

        return (
            <Row className="HomeContainer full-height page-container flex-column flex-jsa flex-ac full-flex">
                <h1 className="color-white text-center">FASCARE CAM</h1>
                <PlayerWrapper>
                    <VideoTitle>
                        <VideoLiveButtonTitle>Live</VideoLiveButtonTitle>
                    </VideoTitle>
                    <PlayerInner>
                        <video controls={false} onClick={this._onTouchInsidePlayer} style={style} ref={(player) => this.player = player} autoPlay={true} />
                    </PlayerInner>
                </PlayerWrapper>
                <Modal title="" style={{ bottom: 50 }} visible={this.state.dronModalVisible}
                    footer={null}> 
                    {!this.state.showDoneMessage &&
                        <div className="messageContainer flex-column">
                            <div className="flex-row">
                                <div className="mapContainer">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.7597111447335!2d72.19719441424556!3d22.774297031277882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395eb8f1c08348f3%3A0x847ac8e924b075ec!2siCreate!5e0!3m2!1sen!2ssg!4v1525008463777" width="200" height="200" frameBorder="0" style={{ border: 0 }} />
                                </div>
                                <div className="l-pad-10 message full-flex flex-column flex-jsa">
                                    <h2><b><Icon type="exclamation-circle-o" style={{color: 'red', fontSize: 40}}/> Accident detected at location [22.774965, 72.199340]</b></h2>
                                    <span>Address: <br />
                                        <b>International Centre for Entrepreneurship and Technology (icreate), Devdholera, Gujarat, Chimanlal Girdharlal Road, Ellisbridge, Ahmedabad, Gujarat, India</b>
                                    </span>
                                </div>
                            </div>  
                            <div className="loadingContainer t-pad-10">
                                <Progress showInfo={false} percent={this.state.percent}/>
                                <div className="t-pad-10 flex-row flex-center">
                                    <Icon className="font-md" type="loading" />
                                    <h4 className="l-pad-20 full-flex font-md">{this.state.message}</h4>
                                </div> 
                            </div>
                        </div>
                    }  
                    {this.state.showDoneMessage &&
                        <div className="messageContainer flex-row flex-center" style={{ minHeight: 200}}>
                            <div className="l-pad-10 message full-flex flex-row flex-jsa flex-ac">
                                <h2 className="r-pad-10 full-flex"><b>Drone with essential medicines is deployed to location [22.774965, 72.199340]</b></h2>
                                <Progress type="circle" format={() => 'Drone Deployed'} percent={100} />

                            </div>
                        </div>
                    }
                </Modal>
            </Row>
        );
    }
}

Home.propTypes = {
    page_details: PropTypes.object,
    actions: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Home);
