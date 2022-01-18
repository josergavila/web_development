import React, { useContext } from 'react';
import axios from 'axios';
import Image from 'next/image';
import NextLink from 'next/link';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
// import data from "../../utils/data";
import db from '../../utils/db';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';

export default function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  console.log(product);
  const classes = useStyles();
  // ------------------------------------
  // NOTE: used if static data from utils
  // const router = useRouter();
  // const { slug } = router.query;
  // const product = data.products.find((a) => a.slug === slug);
  // ------------------------------------
  if (!product) {
    return <div>Ops, produto não encontrado!</div>;
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Não há mais do produto selecionado em estoque');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    router.push('/cart');
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>voltar à página inicial</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Categoria: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Marca: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Avaliações: {product.rating}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Descrição: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0
                        ? 'Em estoque'
                        : 'Não disponível'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Adicionar ao carrinho
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

// function needs to be named exactly like this - read nextjs docs
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  // mongoose returns object from documents class -> lean converts to plain object
  const product = await Product.find({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product[0]),
    },
  };
}
