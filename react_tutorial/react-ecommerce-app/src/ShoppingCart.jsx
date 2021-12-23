import React, { Component } from "react";
import Product from "./Product";

export default class ShoppingCart extends Component {
  // Executes when the component is mounted
  constructor(props) {
    super(props); // calling super class constructor
    // initialization of state
    this.state = {
      products: [],
    };
  }

  render() {
    return (
      <div className="container-fluid">
        <h4>Shopping Cart</h4>
        <div className="row">
          {this.state.products.map((prod) => {
            return (
              <Product
                key={prod.id}
                product={prod}
                onIncrement={this.handleIncrement}
                onDecrement={this.handleDecrement}
                onDelete={this.handleDelete}
              >
                <button className="btn btn-primary">Buy Now</button>
              </Product>
            );
          })}
        </div>
      </div>
    );
  }

  componentDidMount = async () => {
    //   fetch data from data source here
    var response = await fetch("http://localhost:5000/products", {
      method: "GET",
    });
    var prods = await response.json();
    this.setState({ products: prods });
  };

  componentDidUpdate() {}

  componentWillUnmount() {}

  componentDidCatch(error, info) {}

  handleIncrement = (product, maxQty) => {
    let allProducts = [...this.state.products];
    let index = allProducts.indexOf(product);

    if (allProducts[index].quantity < maxQty) {
      allProducts[index].quantity++;
    }

    // updates state of current component
    this.setState({ product: allProducts });
  };

  handleDecrement = (product, minQty) => {
    let allProducts = [...this.state.products];
    let index = allProducts.indexOf(product);

    if (allProducts[index].quantity > minQty) {
      allProducts[index].quantity--;
    }

    // updates state of current component
    this.setState({ product: allProducts });
  };

  handleDelete = (product) => {
    let allProducts = [...this.state.products];
    let index = allProducts.indexOf(product);

    // deletes product based on index
    if (window.confirm("Are you sure to delete?")) {
      allProducts.splice(index, 1);
    }

    // updates state of current component
    this.setState({ products: allProducts });
  };
}
