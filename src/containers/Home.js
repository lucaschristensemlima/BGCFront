import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";


export default function Home() {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const products = await loadProducts();
        setProducts(products);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadProducts() {
    return API.get("products", "/products");
  }

  function renderProductsList(products) {
    return products.map( (product, i) => (
      <LinkContainer key={product.id} to={`/products/${product.id}`}>
              <ListGroupItem header={product.name}>
                  {"Price: R$ " + product.price + " - Qtd: " + product.qtd}
              </ListGroupItem>
            </LinkContainer>
    ));
    }    
  function renderLander() {
    return (
      <div className="lander">
        <h1>Minion Store</h1>
      </div>
    );
  }

  function renderProducts() {
    return (
      <div className="products">
        <PageHeader>Products</PageHeader>
        <ListGroup>
          {!isLoading && renderProductsList(products)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderProducts() : renderLander()}
    </div>
  );
}