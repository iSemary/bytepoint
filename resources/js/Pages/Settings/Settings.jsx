import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import {
    Container,
    Typography,
    Tabs,
    Tab,
    Box,
    ToggleButtonGroup,
    ToggleButton,
    TextField,
    Grid,
    Divider,
} from "@mui/material";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LightModeIcon from "@mui/icons-material/LightMode";
import ComputerIcon from "@mui/icons-material/Computer";
import SaveIcon from "@mui/icons-material/Save";
import Select from "react-select";
import axiosConfig from "../../configs/AxiosConfig";
import Alert from "../../configs/Alert";
import ReactSelectDarkMode from "../../configs/styles/ReactSelectDarkMode";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function Settings() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [saveLoading, setSaveLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        country_id: "",
        theme_mode: "1",
        factor_authenticate: 0,
    });

    const [customer, setCustomer] = useState({
        customer_name: "",
        category_id: "",
    });

    useEffect(() => {
        axiosConfig
            .get("categories")
            .then((response) => {
                setCategories(response.data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });

        axiosConfig
            .get("countries")
            .then((response) => {
                setCountries(response.data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });

        axiosConfig
            .get("auth/user/profile")
            .then((response) => {
                const { user: userData, customer: customerData } =
                    response.data.data.data;
                setUser(userData);
                setCustomer(customerData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };

    const handleInputChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    const handleCustomerInputChange = (field, value) => {
        setCustomer({ ...customer, [field]: value });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleThemeMode = (event, value) => {
        setUser({ ...user, theme_mode: value });
    };

    const handleFactorAuthenticateChange = (event, value) => {
        setUser({ ...user, factor_authenticate: value });
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleSave = () => {
        setSaveLoading(true);

        const data = {
            ...user,
            ...customer,
            password,
            password_confirmation: confirmPassword,
        };

        axiosConfig
            .patch("auth/user/update", data)
            .then((response) => {
                Alert(response.data.message, "success", 3000);
            })
            .catch((error) => {
                setPassword("");
                setConfirmPassword("");

                Alert(error.response.data.message, "error", 3000);
            })
            .finally(() => {
                setSaveLoading(false);
            });
    };

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Settings", icon: "whatshot" },
    ];

    const actionButtons = [
        {
            label: "Save Changes",
            onClick: handleSave,
            icon: <SaveIcon />,
            loading: saveLoading,
        },
    ];

    return (
        <Layout links={links} actionButtons={actionButtons} title="Settings">
            <Container>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    aria-label="Settings tabs"
                    orientation="horizontal"
                >
                    <Tab label="Account Settings" />
                    <Tab label="Security & Privacy" />
                    <Tab label="Appearance & Customization" />
                </Tabs>
                <form onSubmit={handleSave}>
                    {/* Account Settings */}
                    <TabPanel value={selectedTab} index={0}>
                        <Typography variant="h6">Account Settings</Typography>
                        <Box mt={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        value={user.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={user.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Customer Title"
                                        name="customerTitle"
                                        value={customer.customer_name}
                                        onChange={(e) =>
                                            handleCustomerInputChange(
                                                "customer_name",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid container mt={1} spacing={2}>
                                <Grid item xs={12} md={6} className="z-2">
                                    <Select
                                        options={countries}
                                        getOptionLabel={(option) =>
                                            option["name"]
                                        }
                                        getOptionValue={(option) =>
                                            option["id"]
                                        }
                                        styles={ReactSelectDarkMode}
                                        value={
                                            user.country_id
                                                ? countries.find(
                                                      (country) =>
                                                          country.id ===
                                                          user.country_id
                                                  )
                                                : null
                                        }
                                        onChange={(selectedOption) =>
                                            handleInputChange(
                                                "country_id",
                                                selectedOption
                                                    ? selectedOption.id
                                                    : null
                                            )
                                        }
                                        placeholder="Country"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className="z-2">
                                    <Select
                                        options={categories}
                                        getOptionLabel={(option) =>
                                            option["title"]
                                        }
                                        getOptionValue={(option) =>
                                            option["id"]
                                        }
                                        value={
                                            customer.category_id
                                                ? categories.find(
                                                      (cat) =>
                                                          cat.id ===
                                                          customer.category_id
                                                  )
                                                : null
                                        }
                                        styles={ReactSelectDarkMode}
                                        onChange={(selectedOption) =>
                                            handleCustomerInputChange(
                                                "category_id",
                                                selectedOption
                                                    ? selectedOption.id
                                                    : null
                                            )
                                        }
                                        placeholder="Category"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </TabPanel>
                    {/* Security & Privacy */}
                    <TabPanel value={selectedTab} index={1}>
                        <Typography variant="h6">Security & Privacy</Typography>
                        <Box mt={1}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="New Password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                </Grid>
                            </Grid>
                            <Divider />
                            <Box mt={1}>
                                <Typography my={1} variant="body1">
                                    2 Factor Authenticate
                                </Typography>
                                <ToggleButtonGroup
                                    value={
                                        user.factor_authenticate === 1 ? 1 : 0
                                    }
                                    exclusive
                                    onChange={handleFactorAuthenticateChange}
                                    aria-label="2 Factor Authenticate"
                                >
                                    <ToggleButton value={1} aria-label="Enable">
                                        <CheckIcon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value={0}
                                        aria-label="Disable"
                                    >
                                        <CloseIcon />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Box>
                    </TabPanel>
                    {/* Appearance & Customization */}
                    <TabPanel value={selectedTab} index={2}>
                        <Typography variant="h6">
                            Appearance & Customization
                        </Typography>
                        <Box mt={1}>
                            <Typography variant="body1">Theme Mode</Typography>
                            <ToggleButtonGroup
                                value={user.theme_mode}
                                exclusive
                                onChange={handleThemeMode}
                                aria-label="Theme Mode"
                            >
                                <ToggleButton value={1} aria-label="Light">
                                    <LightModeIcon />
                                </ToggleButton>
                                <ToggleButton value={2} aria-label="Dark">
                                    <NightsStayIcon />
                                </ToggleButton>
                                <ToggleButton value={3} aria-label="System">
                                    <ComputerIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </TabPanel>
                </form>
            </Container>
        </Layout>
    );
}
