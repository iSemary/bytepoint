import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link, router } from "@inertiajs/react";
import axiosConfig from "../configs/AxiosConfig";
import { Box } from "@mui/material";
import { Token } from "../configs/Token";

const Header = ({ user, userLoading, open, setOpen }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        setLogoutLoading(true);

        axiosConfig
            .post("auth/logout")
            .then((response) => {
                Token.explode();
                setTimeout(() => {
                    setLogoutLoading(false);
                    window.location.href = '/';
                }, 2000);
            })
            .catch((error) => {
                Alert(error.response.data.message, "error", 5000);
                console.error(error);
                setLogoutLoading(false);
            });
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {user ? (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setOpen(!open)}
                    >
                        <MenuIcon />
                    </IconButton>
                ) : (
                    ""
                )}
                <Typography
                    variant="h6"
                    component={Link}
                    href="/"
                    style={{ flexGrow: 1, textDecoration: "none" }}
                    color="inherit"
                >
                    {import.meta.env.VITE_APP_NAME}
                </Typography>
                {userLoading ? (
                    <CircularProgress color="inherit" size={24} />
                ) : user ? (
                    <>
                        <IconButton
                            size="large"
                            onClick={handleMenu}
                            color="inherit"
                            sx={{ borderRadius: 0 }}
                        >
                            <AccountCircle />
                            <Typography variant="h6" color="inherit">
                                &nbsp;{user?.data?.data?.user?.name}
                            </Typography>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                onClick={handleClose}
                                component={Link}
                                href="/settings"
                            >
                                Settings
                            </MenuItem>
                            <MenuItem onClick={handleLogout} href="/logout">
                                Logout
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} href="/login">
                            Log in
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            href="/register"
                        >
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
            {logoutLoading ? (
                <Box className="fixed-loader">
                    <Box>
                        <CircularProgress
                            size={150}
                            style={{ color: "#ffffff91" }}
                        />
                        <Typography variant="h4">Logging out</Typography>
                    </Box>
                </Box>
            ) : (
                ""
            )}
        </AppBar>
    );
};

export default Header;
