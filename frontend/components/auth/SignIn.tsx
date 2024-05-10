'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { AuthContext } from '@/contexts/authContext';

export default function SignIn() {
  const [alert, setAlert] = useState<boolean>(false);
  const [uid, setUID] = useState(localStorage.setItem("my_user_id", ''))
  const { isAuth, setAuth } = useContext(AuthContext);
  const { push } = useRouter();

  useEffect(() => {
    if (isAuth) {
      console.log('AUTH');

      // Now that we're authenticated, get user id and set in localStorage
      fetch(`${process.env.BACKEND_URL}/auth/profile`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          if (res.status === 200) {   
            res.json().then((re)=>{
              // alert(re)
              localStorage.setItem("my_user_id", String(re.user_id));
              push('/discover');
            });       

          } else {
            // If it doesn't successfully get the info, set userid to -1
            localStorage.setItem("my_user_id", String(-1));
            localStorage.setItem("feed", "discover");
          }
        })
        .catch((error) => error.message);
      // push('/discover');
    }
  }, [isAuth]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          //upon succesful login set auth to true
          setAuth(true);
          setAlert(false);
          if (username!=null){
            localStorage.setItem("username", String(username));
          }
        } else {
          setAlert(true);
        }
      })
      .catch((err) => {
        if (err.message != 'NEXT_REDIRECT') {
          setAlert(true);
        }
      });
      
    
  };

  return (
    //TODO THEME
    <div>
      {alert ? (
        <Alert severity="error" onClose={() => setAlert(false)}>
          Username or password incorrect.
        </Alert>
      ) : (
        <></>
      )}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/auth/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
