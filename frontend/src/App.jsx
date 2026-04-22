import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [expenseData, setExpenseData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetchExpenses();
      setPage("dashboard");
    }
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/register`, registerData);
      setMessage(res.data.message);
      setRegisterData({ name: "", email: "", password: "" });
      setPage("login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, loginData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      setMessage(res.data.message);
      setLoginData({ email: "", password: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExpenses(res.data);
    } catch (error) {
      setMessage("Failed to fetch expenses");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/expense`, expenseData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage(res.data.message);
      setExpenseData({
        title: "",
        amount: "",
        category: "Food",
        date: "",
      });
      fetchExpenses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add expense");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setExpenses([]);
    setPage("login");
    setMessage("Logged out successfully");
  };

  const filteredExpenses =
    filterCategory === "All"
      ? expenses
      : expenses.filter((exp) => exp.category === filterCategory);

  return (
    <div className="container">
      <h1>Personal Expense Management System</h1>
      {message && <p className="message">{message}</p>}

      {!token ? (
        <>
          <div className="nav-buttons">
            <button onClick={() => setPage("register")}>Register</button>
            <button onClick={() => setPage("login")}>Login</button>
          </div>

          {page === "register" && (
            <div className="card">
              <h2>Register Page</h2>
              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <button type="submit">Register</button>
              </form>
            </div>
          )}

          {page === "login" && (
            <div className="card">
              <h2>Login Page</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
                <button type="submit">Login</button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="card">
          <h2>Dashboard</h2>
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogout}>Logout</button>

          <hr />

          <h3>Add Expense</h3>
          <form onSubmit={handleAddExpense}>
            <input
              type="text"
              placeholder="Expense title"
              value={expenseData.title}
              onChange={(e) =>
                setExpenseData({ ...expenseData, title: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseData.amount}
              onChange={(e) =>
                setExpenseData({ ...expenseData, amount: e.target.value })
              }
              required
            />
            <select
              value={expenseData.category}
              onChange={(e) =>
                setExpenseData({ ...expenseData, category: e.target.value })
              }
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              value={expenseData.date}
              onChange={(e) =>
                setExpenseData({ ...expenseData, date: e.target.value })
              }
            />
            <button type="submit">Add Expense</button>
          </form>

          <hr />

          <h3>Expense List</h3>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>

          {filteredExpenses.length === 0 ? (
            <p>No expenses found</p>
          ) : (
            <ul>
              {filteredExpenses.map((expense) => (
                <li key={expense._id}>
                  <strong>{expense.title}</strong> - ₹{expense.amount} -{" "}
                  {expense.category} -{" "}
                  {new Date(expense.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;