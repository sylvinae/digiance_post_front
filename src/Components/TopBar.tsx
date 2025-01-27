import React from "react";
import { Button, Navbar, Container } from "react-bootstrap";

interface TopBarProps {
  user: {
    username: string;
    email: string;
  } | null;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout }) => {
  return (
    <Navbar
      expand="lg"
      className="p-3  w-100 container-fluid"
      style={{ backgroundColor: "#f2f4f7" }}
    >
      <Container fluid>
        <Navbar.Brand>Post Tracker</Navbar.Brand>
        {user && (
          <div className="d-flex align-items-center ">
            <span className="text-black me-3">Welcome, {user.username}</span>
            <Button variant="light" onClick={onLogout}>
              Logout
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default TopBar;
