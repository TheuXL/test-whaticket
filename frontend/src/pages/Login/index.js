import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Link,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
} from '@mui/material';

import { 
  LockOutlined, 
  Visibility, 
  VisibilityOff, 
  WhatsApp as WhatsAppIcon 
} from '@mui/icons-material';

import { styled } from '@mui/material/styles';

import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

const LoginWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

const LoginCard = styled(Card)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius * 2,
  maxWidth: 500,
  width: '100%',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  width: 56,
  height: 56,
}));

const LoginBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
  }
}));

const Login = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  return (
    <LoginWrapper>
      <CssBaseline />
      <Container maxWidth="sm">
        <LoginCard>
          <Grid container>
            <Grid item xs={12}>
              <LoginBanner>
                <StyledAvatar>
                  <WhatsAppIcon />
                </StyledAvatar>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {i18n.t("login.title")}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                  {i18n.t("login.subtitle")}
                </Typography>
              </LoginBanner>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={i18n.t("login.form.email")}
                    name="email"
                    value={user.email}
                    onChange={handleChangeInput}
                    autoComplete="email"
                    autoFocus
                    variant="outlined"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={i18n.t("login.form.password")}
                    id="password"
                    value={user.password}
                    onChange={handleChangeInput}
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3, mb: 2, py: 1.2 }}
                  >
                    {i18n.t("login.buttons.submit")}
                  </Button>
                  
                  <Box textAlign="center" mt={2}>
                    <Link
                      component={RouterLink}
                      to="/signup"
                      variant="body2"
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    >
                      {i18n.t("login.buttons.register")}
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </LoginCard>
      </Container>
    </LoginWrapper>
  );
};

export default Login;
