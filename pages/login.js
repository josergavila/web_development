import axios from 'axios';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Cookies from 'js-cookie';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query; //login?redirect=shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/'); // automatically gets redirect to home page
    }
  }, []);
  // --------------------------------------------------------------
  // no need to use UseState when using react-hook-form
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // --------------------------------------------------------------
  const classes = useStyles();
  const submitHandler = async ({ email, password }) => {
    // e.preventDefault();
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);
      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: 'error' }
      );
      // alert(err.response.data ? err.response.data.message : err.message)
    }
  };
  return (
    <Layout title="login">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                // validation of fields implemented here
                required: true,
                pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'email inválido.'
                        : 'email é obrigatório'
                      : ''
                  }
                  // onChange={(e) => setEmail(e.target.value)} // if not using react-hook-form enable onChange
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                // validation of fields implemented here
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Senha"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'senha não tem o número mínimo de caracteres.'
                        : 'senha é obrigatório'
                      : ''
                  }
                  // onChange={(e) => setEmail(e.target.value)} // if not using react-hook-form enable onChange
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Ainda não tem uma conta? &nbsp;
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link>Crie sua conta</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
