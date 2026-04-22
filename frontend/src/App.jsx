import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

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
      setPage("dashboard");
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

  const totalBalance = filteredExpenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const monthlySpending = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const getCategoryClass = (category) => {
    switch (category) {
      case "Food":
        return "badge food";
      case "Travel":
        return "badge travel";
      case "Bills":
        return "badge bills";
      case "Shopping":
        return "badge shopping";
      default:
        return "badge other";
    }
  };

  const formatDate = (date) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app-shell">
      {message && <div className="floating-message">{message}</div>}

      {!token ? (
        <div className="auth-page">
          <div className="auth-left">
            <div className="brand-top">
              <div className="brand-icon">▣</div>
              <div>
                <h1>SpendWise</h1>
                <p>PREMIUM FINANCIAL MANAGEMENT</p>
              </div>
            </div>

            <div className="auth-card">
              <h2>{page === "login" ? "Welcome back" : "Create account"}</h2>
              <p className="auth-subtitle">
                {page === "login"
                  ? "Enter your credentials to access your secure dashboard."
                  : "Register to manage your daily expenses beautifully and securely."}
              </p>

              {page === "login" ? (
                <form onSubmit={handleLogin} className="auth-form">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />

                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />

                  <button type="submit" className="primary-btn">
                    Login to Dashboard →
                  </button>

                  <p className="switch-text">
                    New to SpendWise?{" "}
                    <span onClick={() => setPage("register")}>
                      Create a premium account
                    </span>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="auth-form">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />

                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Create password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                  />

                  <button type="submit" className="primary-btn">
                    Create Account →
                  </button>

                  <p className="switch-text">
                    Already have an account?{" "}
                    <span onClick={() => setPage("login")}>Login here</span>
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-glow"></div>
            <div className="security-card">
              <span className="security-badge">Enterprise Security</span>
              <h3>Your wealth, protected by the best technology.</h3>
              <p>
                Simple expense tracking, elegant design, and secure access for
                your daily financial management.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-page">
          <aside className="sidebar">
            <div className="logo-block">
              <h2>SpendWise</h2>
              <p>PREMIUM ACCOUNT</p>
            </div>

            <nav className="side-nav">
              <button className="nav-item active">Dashboard</button>
              <button className="nav-item">Transactions</button>
              <button className="nav-item">Analytics</button>
              <button className="nav-item">Budgets</button>
              <button className="nav-item">Settings</button>
            </nav>

            <button className="add-expense-side">＋ Add Expense</button>

            <button className="logout-link" onClick={handleLogout}>
              Logout
            </button>
          </aside>

          <main className="dashboard-main">
            <div className="topbar">
              <h1>Dashboard Overview</h1>
              <div className="topbar-right">
                <input
                  className="search-box"
                  type="text"
                  placeholder="Search transactions..."
                />
                <div className="avatar-circle">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-title">TOTAL BALANCE</p>
                <h3>₹{totalBalance.toLocaleString()}</h3>
                <span className="green-pill">+12.5% vs last month</span>
              </div>

              <div className="stat-card">
                <p className="stat-title">MONTHLY SPENDING</p>
                <h3>₹{monthlySpending.toLocaleString()}</h3>
                <span className="red-pill">
                  {monthlySpending > 0 ? "Budget tracking active" : "No spending yet"}
                </span>
              </div>

              <div className="stat-card">
                <p className="stat-title">SAVINGS GOAL</p>
                <h3>New Goal Progress</h3>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <small>Estimated completion: 2 months</small>
              </div>
            </div>

            <div className="dashboard-content">
              <section className="expense-form-card">
                <h2>⊞ New Expense</h2>
                <form onSubmit={handleAddExpense} className="expense-form">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Starbucks Coffee"
                    value={expenseData.title}
                    onChange={(e) =>
                      setExpenseData({ ...expenseData, title: e.target.value })
                    }
                    required
                  />

                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={expenseData.amount}
                    onChange={(e) =>
                      setExpenseData({ ...expenseData, amount: e.target.value })
                    }
                    required
                  />

                  <div className="two-cols">
                    <div>
                      <label>Category</label>
                      <select
                        value={expenseData.category}
                        onChange={(e) =>
                          setExpenseData({
                            ...expenseData,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Bills">Bills</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label>Date</label>
                      <input
                        type="date"
                        value={expenseData.date}
                        onChange={(e) =>
                          setExpenseData({
                            ...expenseData,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <button type="submit" className="save-btn">
                    Save Transaction
                  </button>
                </form>

                <div className="mini-banner">
                  <div className="banner-overlay">
                    <h4>Master your finances with detailed insights.</h4>
                    <p>Track smarter. Spend wiser.</p>
                  </div>
                </div>
              </section>

              <section className="recent-expenses-card">
                <div className="recent-header">
                  <h2>◔ Recent Expenses</h2>

                  <div className="recent-actions">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="filter-select"
                    >
                      <option value="All">All Categories</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Bills">Bills</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="expense-list">
                  {filteredExpenses.length === 0 ? (
                    <div className="no-expense-box">No expenses found</div>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <div className="expense-item" key={expense._id}>
                        <div className="expense-icon">
                          {expense.category === "Food"
                            ? "🍴"
                            : expense.category === "Travel"
                            ? "🚗"
                            : expense.category === "Bills"
                            ? "📄"
                            : expense.category === "Shopping"
                            ? "🛍"
                            : "✨"}
                        </div>

                        <div className="expense-details">
                          <h4>{expense.title}</h4>
                          <p>{formatDate(expense.date)}</p>
                        </div>

                        <div className="expense-meta">
                          <span className={getCategoryClass(expense.category)}>
                            {expense.category}
                          </span>
                          <strong>₹{Number(expense.amount).toLocaleString()}</strong>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;