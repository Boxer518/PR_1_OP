import React, { useState } from "react";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const products = [
    { id: 1, name: "MacBook Pro 2023", price: 1500, image: "https://netrinoimages.s3.eu-west-2.amazonaws.com/2023/11/09/1600268/477717/macbook_pro_16inch_2023_3d_model_c4d_max_obj_fbx_ma_lwo_3ds_3dm_stl_4894009_m.png" },
    { id: 2, name: "AirPods Pro 2", price: 250, image: "https://guide-images.cdn.ifixit.com/igi/T6yrbgnUegiFLeVJ.standard" },
    { id: 3, name: "iPhone 16 Pro Max", price: 1000, image: "https://guide-images.cdn.ifixit.com/igi/nGcRgAKBpmABSW5N.standard" },
    { id: 4, name: "Apple Watch 7", price: 400, image: "https://netrinoimages.s3.eu-west-2.amazonaws.com/2017/03/16/140444/421934/apple_watch_series_6_silicone_solo_loop_silver_3d_model_c4d_max_obj_fbx_ma_lwo_3ds_3dm_stl_4347729_m.jpg" },
  ];

  const addToCart = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);

  return (
    <div className="app-container">
      <div className="products-section">
        <h2>Техника</h2>
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price} €</p>
              <button onClick={() => addToCart(product)}>Добавить в корзину</button>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-section">
        <h2>Корзина</h2>
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-info">
                  <strong>{item.name}</strong>
                  <div className="cart-controls">
                    <button onClick={() => removeFromCart(item)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
                <div>{item.price * item.qty} €</div>
              </div>
            ))}
            <div className="cart-total">
              <strong>Итого: {totalPrice} €</strong>
            </div>
            <button className="clear-btn" onClick={clearCart}>
              Очистить корзину
            </button>
          </>
        )}
      </div>
    </div>
  );
}


export default App;