import React, { useState, Component } from "react";
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    Container,
    Row,
    Col,
} from "reactstrap";
import AddMatch from "./AddMatch";
import axios from "axios";
import Style from "./match.module.scss";

class Match extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            animating: false,
            items: [],
            item: [
                {
                    match_no: 40,
                    date: "23 October 2020",
                    league: "IPL",
                    Team1: "Mumbai Indians",
                    Team2: "Chennai Super Kings",
                    Won_by: "Mumbai Indians",
                },
                {
                    match_no: 41,
                    date: "24 October 2020",
                    league: "IPL",
                    Team1: "Kings XI Punjab",
                    Team2: "Sunrisers Hyderabad",
                    Won_by: "Kings XI Punjab",
                },
                {
                    match_no: 22,
                    date: "24 October 2020",
                    league: "Big Bash",
                    Team1: "Sydney Sixers",
                    Team2: "Melbourne Stars",
                    Won_by: "Sydney Sixers",
                },
            ],
            match_added: true,
            league: [],
            teams: [],
        };
    }

    componentDidMount(props) {
        axios
            .get("http://localhost:5000/matches")
            .then((response) => {
                this.setState({
                    items: response.data,
                });
                console.log(this.state.items);
            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get(`http://localhost:5000/teams/`)
            .then((response) => {
                this.setState({
                    teams: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get(`http://localhost:5000/league/`)
            .then((response) => {
                this.setState({
                    league: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidUpdate(PrevProps, PrevState) {
        if (PrevState.match_added != this.state.match_added) {
            axios
                .get("http://localhost:5000/matches")
                .then((response) => {
                    this.setState({
                        items: response.data,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    next = () => {
        if (this.state.animating) return;
        const nextIndex =
            this.state.activeIndex === this.state.items.length - 1
                ? 0
                : this.state.activeIndex + 1;
        this.setState({
            activeIndex: nextIndex,
        });
    };

    previous = () => {
        if (this.state.animating) return;
        const nextIndex =
            this.state.activeIndex === 0
                ? this.state.items.length - 1
                : this.state.activeIndex - 1;
        this.setState({
            activeIndex: nextIndex,
        });
    };

    goToIndex = (newIndex) => {
        if (this.state.animating) return;
        this.setState({
            activeIndex: newIndex,
        });
    };

    match_adder = (data) => {
        this.setState({
            match_added: !this.state.match_added,
        });
    };

    compareObjects(object1, object2, key) {
        const obj1 = object1[key].toUpperCase();
        const obj2 = object2[key].toUpperCase();

        if (obj1 < obj2) {
            return -1;
        }
        if (obj1 > obj2) {
            return 1;
        }
        return 0;
    }

    render() {
        const { teams, league } = this.state;

        teams.sort((a, b) => {
            return this.compareObjects(a, b, "team_name");
        });

        league.sort((a, b) => {
            return this.compareObjects(a, b, "league_name");
        });

        const { items } = this.state;
        const { activeIndex, animating } = this.state;
        const slides = items.map((item) => {
            return (
                <CarouselItem
                    onExiting={() =>
                        this.setState({
                            animating: true,
                        })
                    }
                    onExited={() =>
                        this.setState({
                            animating: false,
                        })
                    }
                    key={item.match_id}
                >
                    <Container
                        style={{ paddingLeft: "20px", paddingRight: "10px" }}
                    >
                        <Row>
                            <Col xs="1"></Col>
                            <Col>Match {item.match_number}: </Col>
                            <Col xs="1"></Col>
                        </Row>
                        <Row>
                            <Col xs="1"></Col>
                            <Col xs="10">
                                {item.team1[0].team_name} vs{" "}
                                {item.team2[0].team_name}
                            </Col>
                            <Col xs="1"></Col>
                        </Row>
                        <Row>
                            <Col xs="1"></Col>
                            <Col xs="10">
                                Date:{" "}
                                {new Date(item.match_date).toLocaleDateString()}
                            </Col>
                            <Col xs="1"></Col>
                        </Row>
                        <Row>
                            <Col xs="1"></Col>
                            <Col>{item.won_by[0].team_name} won the match</Col>
                            <Col xs="1"></Col>
                        </Row>
                        {/* </div> */}
                    </Container>
                </CarouselItem>
            );
        });

        return (
            <div style={{ marginBottom: "10px" }}>
                <Row>
                    <Col>
                        <div className="titles">Recent Matches</div>
                    </Col>
                    <Col>
                        <AddMatch
                            match_adder={this.match_adder}
                            teams={teams}
                            league={league}
                        />
                    </Col>
                </Row>
                <div className={Style.match_details}>
                    <Carousel
                        activeIndex={activeIndex}
                        next={this.next}
                        previous={this.previous}
                    >
                        {/* <CarouselIndicators
                            items={items}
                            activeIndex={activeIndex}
                            onClickHandler={this.goToIndex}
                        /> */}
                        {slides}
                        <CarouselControl
                            direction="prev"
                            directionText="Previous"
                            onClickHandler={this.previous}
                            style={{ marginRight: "10px" }}
                        />
                        <CarouselControl
                            direction="next"
                            directionText="Next"
                            onClickHandler={this.next}
                        />
                    </Carousel>
                </div>
            </div>
        );
    }
}

export default Match;
