import React from "react";
import "./Error404.css";
import "../subcomponents/RectButton.css";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class Error404 extends React.Component {

    render() {
        let className = this.props.className + " error404-container animated zoomIn";

        return (
            <Container fluid={true} className={className}>
                <div className="error404-header">404</div>
                <div className="error404-title">OOPS! NOTHING WAS FOUND</div>
                <div className="error404-content">The page you are looking for might have been removed had its name changed or is temporarily unavailable</div>
                <Link to="/login">
                    <Button className="rect-btn btn-for-modal error404-btnReturn">return to login</Button>
                </Link>
            </Container>
        );
    }
}

export default Error404;