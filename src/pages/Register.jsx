import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validate passwords match on submit
    if (password !== confirmPass) {
      setError("Passwords don't match");
      return;
    }

    const formData = { name, email, password, phone, address };

    try {
      setLoading(true);
      await api.post("/api/v1/user/register", formData);

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPass("");
      setPhone("");
      setAddress("");

      // Navigate to login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name:</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email:</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password:</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                type="password"
                name="password"
                id="password"
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm" className="block text-sm font-medium text-slate-700">Confirm Password:</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                type="password"
                name="confirmPass"
                id="confirm"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone:</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                type="text"
                name="phone"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address:</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <button
            className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <div className="mt-4 text-sm font-medium text-red-600">{error}</div>}

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-600" to="/login">Login</Link>
        </div>
      </div>
    </main>
  );
}