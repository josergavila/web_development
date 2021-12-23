import React, { Component } from "react";
import Login from "./Login";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import ShoppingCart from "./ShoppingCart";
import CustomersList from "./CustomersList";
import NoMatchPage from "./NoMatchPage";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/*" element={<NoMatchPage />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
