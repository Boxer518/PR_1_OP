import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import "./App.css";


const GlobalContext = createContext();

const initialState = {
  theme: localStorage.getItem("theme") || "light",
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { ...state, theme: newTheme };
    }
    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.id === action.item.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((i) =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        newCart = [...state.cart, { ...action.item, qty: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case "REMOVE_FROM_CART": {
      const newCart = state.cart.filter((i) => i.id !== action.id);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case "DECREMENT": {
      const newCart = state.cart
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case "CLEAR_CART": {
      localStorage.setItem("cart", "[]");
      return { ...state, cart: [] };
    }
    default:
      return state;
  }
}

export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

const useGlobal = () => useContext(GlobalContext);


const PRODUCTS = [
  {
    id: 1,
    name: "Ноутбук MacBook Pro",
    price: 1200,
    image: "https://i.ebayimg.com/thumbs/images/g/IMwAAOSw6ulkGJI~/s-l300.jpg",
  },
  {
    id: 2,
    name: "Наушники Air Pods",
    price: 150,
    image: "https://avatars.mds.yandex.net/i?id=233e978ef662235e37c80a8074d4a010_sr-5232628-images-thumbs&n=13",
  },
  {
    id: 3,
    name: "Смартфон iPhone",
    price: 800,
    image: "https://s.alicdn.com/@sc04/kf/H600273f97028412bbdd6a9e22e5c4264L.jpg_300x300.jpg",
  },
  {
    id: 4,
    name: "Монитор Samsung\"",
    price: 300,
    image: "https://c1.neweggimages.com/ProductImageCompressAll300/24-022-689-S02.jpg",
  },
  {
    id: 5,
    name: "Клавиатура Razor",
    price: 90,
    image: "https://c1.neweggimages.com/ProductImageCompressAll300/AP3DD2006115DI9E.jpg",
  },
];



function Header() {
  const { state, dispatch } = useGlobal();
  const cartCount = state.cart.reduce((sum, i) => sum + i.qty, 0);
  return (
    <header className="header">
      <div className="logo">Tech Store</div>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Каталог</NavLink>
        <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>Корзина ({cartCount})</NavLink>
      </nav>
      <button className="theme-btn" onClick={() => dispatch({ type: "TOGGLE_THEME" })}>
        {state.theme === "light" ? "Светлая" : "Темная"}
      </button>
    </header>
  );
}

function Catalog() {
  const { dispatch } = useGlobal();
  const navigate = useNavigate();

  const addToCart = (item, redirect = false) => {
    dispatch({ type: "ADD_TO_CART", item });
    if (redirect) navigate("/cart");
  };

  return (
    <div className="page">
      <h2>Каталог товаров</h2>
      <div className="grid">
        {PRODUCTS.map((p) => (
          <div className="card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">{p.price} €</p>
            <div className="buttons">
              <button onClick={() => addToCart(p, false)}>Добавить</button>
              <button className="secondary" onClick={() => addToCart(p, true)}>В корзину →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart() {
  const { state, dispatch } = useGlobal();
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="page">
      <h2>Корзина</h2>
      {state.cart.length === 0 ? (
        <p>Корзина пуста.</p>
      ) : (
        <>
          <ul className="cart-list">
            {state.cart.map((i) => (
              <li key={i.id} className="cart-item">
                <div className="info">
                  <img src={i.image} alt={i.name} />
                  <div>
                    <strong>{i.name}</strong>
                    <p>{i.price} € × {i.qty}</p>
                  </div>
                </div>
                <div className="actions">
                  <button onClick={() => dispatch({ type: "DECREMENT", id: i.id })}>-</button>
                  <button onClick={() => dispatch({ type: "ADD_TO_CART", item: i })}>+</button>
                  <button className="remove" onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: i.id })}>✕</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <strong>Итого: {total} €</strong>
            <button onClick={() => dispatch({ type: "CLEAR_CART" })}>Очистить</button>
          </div>
        </>
      )}
    </div>
  );
}


export default function App() {
  const { state } = useGlobal();
  return (
    <div className={`root ${state.theme}`}>
      <Header />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}