import React, { Component } from 'react';
import { Container, Menu, Card, Tab, Image, Grid, Transition, Message, Button, Icon, Divider } from 'semantic-ui-react';
import Layout from '../Layout.js';
import createReactClass from 'create-react-class';
import PlayerStatCard from './PlayerStatCard.js';
import playerData from '../../data/TempPlayerData.js';
import Carousel from 'nuka-carousel';
import PlayerOverview from './PlayerOverview.js';
import CardBackground from '../../img/abstract-background.png';
import { PLATFORMS } from '../../data/common_constants';
import { Link } from "react-router-dom";
import { SyncLoader, ScaleLoader, PulseLoader, RingLoader, ClipLoader } from 'react-spinners';
import { connect } from 'react-redux';
import { resetErrors, validateUserDirectPath, fetchFireteamMembers } from '../../actions/fireteams_index';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class SlidingTabsDemo extends Component {
    render() {
        return (

            <Tabs
                defaultActiveKey="1"
                tabPosition='left'
            >
                <TabPane tab={<Image src="https://www.bungie.net/img/theme/destiny/icons/game_modes/allmodes.png" size='tiny' centered />} key="1">
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition='top'
                    >
                        <TabPane tab='Fireteam' key="11">Overview</TabPane>
                        <TabPane tab="Team Stats" key="21">Player 1</TabPane>
                    </Tabs>
                </TabPane>
                <TabPane tab="Player 1" key="2">Player 1</TabPane>
                <TabPane tab="Player 2" key="3">Player 2</TabPane>
                <TabPane tab="Player 3" key="4">Player 3</TabPane>
                <TabPane tab="Player 4" key="5">Player 4</TabPane>
            </Tabs>

        );
    }
}


class BetaMessage extends Component {
    state = { visible: true }

    handleDismiss = () => {
        this.setState({ visible: false })
    }

    render() {
        const content = (
            <div>
                This is just a demo of what we're working on. Soon you'll be able to look up any player and find their current fireteam, similar to below.
           <br />
                You searched for: {this.props.gamertag} on {PLATFORMS[this.props.platform]}.
         </div>
        )
        if (this.state.visible) {
            return (
                <Message
                    icon='smile'
                    info
                    header='Heads up!'
                    onDismiss={this.handleDismiss}
                    content={content}
                />

            )
        }
        return (
            <div />
        )
    }
}

const OverviewSlides = (props) => {
    var Decorators = [{
        component: createReactClass({
            render() {
                return (<div />
                )
            }
        }),
        position: 'CenterLeft',
        style: {
            padding: 20
        }
    }];
    return (
        <Carousel wrapAround={true} decorators={Decorators}>
            {props.slides}
        </Carousel>
    )
}

const FireteamOverview = (props) => {
    // console.log(this.props)
    let columns;
    if (props.data[0] !== undefined) {
        columns = props.data[0].map(function (object, i) {
            return (
                <PlayerStatCard key={i + 5} data={object} />
            )
        });
    }

    return (
        <div style={{ marginLeft: '2%', marginRight: '2%' }}>
            <Grid centered stretched verticalAlign='middle' columns={4} style={{ height: '80vh' }}>
                <Grid.Row>
                    {columns}
                </Grid.Row>
            </Grid>
        </div>
    )
}

const FireteamStatsView = (props) => {

    return (
        <div style={{ padding: '15px', color: '#f5f5f5' }} >

            average kd: {props.data[1].average_kd} <br />
            deaths: {props.data[1].deaths} <br />
            games_played: {props.data[1].games_played}<br />
            kills: {props.data[1].kills}<br />
            longest_stream: {props.data[1].longest_streak}<br />
            losses: {props.data[1].losses}<br />
            win rate: {props.data[1].win_rate} %<br />
            wins: {props.data[1].wins}<br />

        </div>

    )
}

class FireteamPage extends Component {

    state = { activeItem: 'home' }

    componentWillMount() {
        this.props.validateUserDirectPath(this.props.match.params)
        setTimeout(() => {
            if (!this.props.error) {
                this.props.fetchFireteamMembers(this.props.match.params)
            } else {
                console.log("There's something wrong here.... I'm done working for now..")
            }
        }, 1);
    }

    handleDismiss = () => {
        this.props.resetErrors();
    }

    changePlayer = (e, { name }) => this.setState({ activeItem: name })

    render() {
        // const { activeItem } = this.state
        function getPlayerCharacters(props) {
            var chars = [];
            // eslint-disable-next-line
            props.characters.map(function (object, i) {
                chars.push({ menuItem: `${object.character_type}`, render: () => <Tab.Pane><PlayerOverview player_name={props.player_name} data={object} /></Tab.Pane> })
            });
            return chars;
        };


        const teamPanes = [
            { menuItem: 'Fireteam', render: () => <Tab.Pane><FireteamOverview data={this.props.fireteam} /></Tab.Pane> },
            {
                menuItem: 'Stats', render: () =>
                    <Tab.Pane>
                        <pre>
                            <code>
                                average kd: {this.props.fireteam[1].average_kd}
                                deaths: {this.props.fireteam[1].deaths}
                                games_played: {this.props.fireteam[1].games_played}
                                kills: {this.props.fireteam[1].kills}
                                longest_stream: {this.props.fireteam[1].longest_streak}
                                losses: {this.props.fireteam[1].losses}
                                win rate: {this.props.fireteam[1].win_rate} %
                                wins: {this.props.fireteam[1].wins}
                            </code>
                        </pre>
                    </Tab.Pane>
            }
        ]

        // const sideTabs = [{ menuItem:  <Menu.Item style={{ textAlign: 'center', padding: '0', height: '16%', backgroundImage: `url(${TrialsLogo})`, backgroundSize: 'cover', backgroundPosition: 'center'}} key='overview'></Menu.Item>, render: () => <Tab.Pane><Tab className='overview-tabs' panes={teamPanes} /></Tab.Pane> }];
        const sideTabs = [{
            menuItem:
                <Menu.Item
                    style={{
                        textAlign: 'center',
                        padding: '0',
                        height: '16%',
                        backgroundImage: 'url("https://www.bungie.net/img/theme/destiny/icons/game_modes/allmodes.png")',
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }}
                    key='overview'>
                </Menu.Item>,
            render: () => <Tab.Pane><Tab className='overview-tabs' panes={teamPanes} /></Tab.Pane>
        }];



        const slides = [];
        let players = this.props.fireteam
        let playerPanes = [];

        if (players[0] !== undefined) {
            playerPanes = players[0].map(function (object, i) {
                console.log(object)
                // sideTabs.push({ menuItem: <Menu.Item style={{ textAlign: 'center' }} key={`player${i + 1}`}><Image className='trials-player-icon' src={object.characters[0].emblem} /></Menu.Item>, render: () => <Tab.Pane><Tab className='player-tabs' panes={getPlayerCharacters(object)} /></Tab.Pane> })
                slides.push(
                    <div>
                        {<PlayerStatCard key={`slides${i}`} data={object} />}
                    </div>
                );
                return (
                    <TabPane
                        tab={object.player_name}
                        key={`tabs${i}`}
                    >
                        <Tabs
                            defaultActiveKey={`${object.player_name}${i}hunter`}
                            tabPosition='top'
                            size='large'
                            type='card'
                            style={{ backgroundColor: '#212121', minHeight: '85vh' }}
                        >
                            <TabPane tab='Hunter' key={`${object.player_name}${i}hunter`}>
                                <div style={{ padding: '15px', color: '#f5f5f5' }}>
                                    Hang tight! Soon you'll be able to look at specific stats for each character for this player!
                                </div>
                            </TabPane>
                            <TabPane tab="Warlock" key={`${object.player_name}${i}warlock`}>
                                <div style={{ padding: '15px', color: '#f5f5f5' }}>
                                    Hang tight! Soon you'll be able to look at specific stats for each character for this player!
                                </div>
                            </TabPane>
                            <TabPane tab="Titan" key={`${object.player_name}${i}titan`}>
                                <div style={{ padding: '15px', color: '#f5f5f5' }}>
                                    Hang tight! Soon you'll be able to look at specific stats for each character for this player!
                                </div>
                            </TabPane>
                        </Tabs>

                    </TabPane>
                )
            });
        }

        return (
            <Layout>
                <div className="profile-page" style={{ minHeight: '100vh' }}>
                    <Container style={{ width: '90%' }}>
                        {this.props.error ?
                            <Message
                                negative
                                attached
                                onDismiss={this.handleDismiss}
                                header={`Sorry! ${this.props.error}`}
                            />
                            : null
                        }
                        <Button as={Link} to='/fireteams' basic inverted icon className='fireteam-back-btn'>
                            <Icon name='search' size='huge' />
                        </Button>

                        <Card className='hide-on-mobile' fluid style={{ marginTop: '20px', backgroundColor: '#212121', boxShadow: 'none' }}>
                            <Card.Content style={{ padding: '0' }}>
                                {!this.props.error ?
                                    <Tabs
                                        defaultActiveKey="1"
                                        tabPosition='left'
                                        style={{ minHeight: '85vh' }}
                                    >
                                        <TabPane
                                            tab={<Image src="https://www.bungie.net/img/theme/destiny/icons/game_modes/allmodes.png"
                                                style={{ width: '60px' }}
                                                centered />
                                            }
                                            key="1"
                                        >
                                            <Tabs
                                                defaultActiveKey="1"
                                                tabPosition='top'
                                                size='large'
                                                type='card'
                                                style={{ backgroundColor: '#212121', minHeight: '85vh' }}
                                            >
                                                <TabPane tab='Fireteam' key="11"><FireteamOverview data={this.props.fireteam} /></TabPane>
                                                <TabPane tab="Team Stats" key="21"><FireteamStatsView data={this.props.fireteam} /></TabPane>
                                            </Tabs>
                                        </TabPane>
                                        {playerPanes}

                                    </Tabs>
                                    :
                                    null
                                }
                            </Card.Content>
                        </Card>
                        <div style={{ paddingLeft: '4%', paddingTop: '2%', minHeight: '550px' }} className='hide-on-med-and-up' >
                            {this.props.error ?
                                null
                                : <OverviewSlides slides={slides} />
                            }

                        </div>

                    </Container>
                </div>
            </Layout>
        );
    }
}


function mapStateToProps(state) {
    return {
        error: state.fireteam.error,
        fireteam: state.fireteam.fireteam
    }
}

export default connect(mapStateToProps, { validateUserDirectPath, resetErrors, fetchFireteamMembers })(FireteamPage)
