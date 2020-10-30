import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import AddLeague from "./AddLeague";
import axios from "axios";
import Style from "./Utils/league_type.module.scss";

class LeaguePage extends Component {
    constructor() {
        super();
        this.state = {
            leag: [],
        };
    }

    componentDidMount(props) {
        axios
            .get("http://localhost:5000/league_type/")
            .then((response) => {
                this.setState({
                    leag: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    league_adder = (data) => {
        this.setState({
            leag: [...this.state.leag, data],
        });
    };

    render() {
        const leaguesss = this.state.leag.map((lea, index) => (
            <React.Fragment>
                <div className={Style.league_type}>
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <img
                            src={`${lea.league_logo_link}`}
                            style={{
                                width: "200px",
                                height: "200px",
                            }}
                            alt={`${lea.league_name} logo`}
                        ></img>
                    </div>
                    <div className={Style.league_type_details}>
                        <div
                            style={{
                                padding: "32px 24px",
                                paddingBottom: "16px",
                            }}
                        >
                            <div>
                                <span style={{ display: "block" }}>
                                    {lea.league_name}
                                </span>
                            </div>
                            <div>
                                Format: <span>{lea.league_format}</span>
                            </div>
                        </div>
                        {/* <div> */}
                        <Link
                            to={{
                                pathname: `/${lea.league_name}`,
                                state: {
                                    league_type_id: lea.league_type_id,
                                },
                            }}
                            style={{ textDecoration: "none" }}
                        >
                            <div
                                style={{
                                    backgroundColor: "#00838d",
                                    justifySelf: "center",
                                    color: "#fff",
                                    padding: "10px",
                                    textDecoration: "none",
                                    width: "100%",
                                    textAlign: "center",
                                }}
                            >
                                Details
                            </div>
                        </Link>
                        {/* </div> */}
                    </div>
                </div>
                {/* <Col lg="1"></Col> */}
            </React.Fragment>
        ));

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <div className="titles">Popular Leagues</div>
                    </Col>
                    <Col>
                        <AddLeague league_changer={this.league_adder} />
                    </Col>
                </Row>

                <Row>{leaguesss}</Row>
            </React.Fragment>
        );
    }
}

export default LeaguePage;
