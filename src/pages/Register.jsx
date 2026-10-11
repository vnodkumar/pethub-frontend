import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import catBackground from "../images/cat-background.jpg";

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
    <main
      className="flex flex-1 items-center justify-center bg-[#ffd21f] bg-[length:98%_auto] bg-[position:200%_top] bg-no-repeat px-4 py-3 font-[Arial,sans-serif] sm:bg-fixed md:justify-start md:pl-[clamp(1.5rem,6vw,5rem)]"
      style={{ backgroundImage: `url(${catBackground})` }}
    >
      <div className="w-full max-w-[420px] rounded-[15px] border border-white/70 bg-white/95 p-4 text-center shadow-[0_15px_30px_rgba(0,0,0,0.1)] backdrop-blur-[5px] sm:p-5">
        <h1 className="mb-3 font-[Comic_Sans_MS,cursive] text-2xl font-bold uppercase text-[#f57c00]">
          Registration Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <div className="space-y-1.5 text-left">
              <label htmlFor="name" className="block text-xs font-medium uppercase text-[#f57c00]">Name</label>
              <input
                className="w-full rounded-lg border-2 border-[#ffd54f] px-3 py-1.5 text-sm text-slate-900 outline-none transition-all focus:border-[#ff9800] focus:shadow-[0_0_8px_rgba(255,152,0,0.5)]"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="phone" className="block text-xs font-medium uppercase text-[#f57c00]">Phone Number</label>
              <input
                className="w-full rounded-lg border-2 border-[#ffd54f] px-3 py-1.5 text-sm text-slate-900 outline-none transition-all focus:border-[#ff9800] focus:shadow-[0_0_8px_rgba(255,152,0,0.5)]"
                type="tel"
                name="phone"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="block text-xs font-medium uppercase text-[#f57c00]">Email</label>
              <input
                className="w-full rounded-lg border-2 border-[#ffd54f] px-3 py-1.5 text-sm text-slate-900 outline-none transition-all focus:border-[#ff9800] focus:shadow-[0_0_8px_rgba(255,152,0,0.5)]"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="password" className="block text-xs font-medium uppercase text-[#f57c00]">Password</label>
              <input
                className="w-full rounded-lg border-2 border-[#ffd54f] px-3 py-1.5 text-sm text-slate-900 outline-none transition-all focus:border-[#ff9800] focus:shadow-[0_0_8px_rgba(255,152,0,0.5)]"
                type="password"
                name="password"
                id="password"
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="confirm" className="block text-xs font-medium uppercase text-[#f57c00]">Confirm Password</label>
              <input
                className="w-full rounded-lg border-2 border-[#ffd54f] px-3 py-1.5 text-sm text-slate-900 outline-none transition-all focus:border-[#ff9800] focus:shadow-[0_0_8px_rgba(255,152,0,0.5)]"
                type="password"
                name="confirmPass"
                id="confirm"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="address" className="block text-xs font-medium uppercase text-[#f57c00]">Address</label>
              <input
                className="w-full rounded-lg border-2 border-[#ffd54f] px-3 py-1.5 text-sm text-slate-900 outline-none transition-all focus:border-[#ff9800] focus:shadow-[0_0_8px_rgba(255,152,0,0.5)]"
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <button
            className="w-full rounded-lg bg-[#ffeb3b] px-4 py-2.5 text-base font-bold text-[#8a4b00] transition-colors hover:bg-[#f57c00] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && (
          <div role="alert" aria-live="assertive" className="mt-3 flex items-start gap-2 rounded-lg   px-3 py-2.5 text-left text-sm font-bold text-red-500 ">
            <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">!</span>
            <span >{error}</span>
          </div>
        )}

        <div className="mt-3 text-center text-sm text-[#f57c00]">
          <Link className=" text-[#f57c00] no-underline hover:underline" to="/login">
            Already have an account? Click here for Login
          </Link>
        </div>
      </div>
    </main>
  );
}
