import axios from 'axios';
import {
  Button,
  Card,
  Grid,
  MenuItem,
  Link,
  List,
  ListItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

// NOTE: rendering cart in client side because of cookies (avoiding differences between
// client side and server side) -> it does not matter for SEO anyway

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Não há mais do produto selecionado em estoque');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    router.push('/shipping');
  };
  return (
    <Layout title="seu carrinho">
      <Typography component="h1" variant="h1">
        Carrinho de Compras
      </Typography>
      {cartItems.length === 0 ? (
        <div>
          Seu carrinho está vazio.{' '}
          <NextLink href="/">
            <Link>Vamos às compras?</Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Imagem</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="right">Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <NextLink href={`/product/${item.slug}`} passHref>
                        <Link>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                        </Link>
                      </NextLink>
                    </TableCell>
                    <TableCell>
                      <NextLink href={`/product/${item.slug}`} passHref>
                        <Link>
                          <Typography>{item.name}</Typography>
                        </Link>
                      </NextLink>
                    </TableCell>
                    <TableCell align="right">
                      <Select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <MenuItem key={x + 1} value={x + 1}>
                            {x + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="right">${item.price}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => removeItemHandler(item)}
                      >
                        x
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    itens) : R${' '}
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={checkoutHandler}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
