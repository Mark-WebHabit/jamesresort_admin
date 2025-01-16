import { useState } from "react";
import Body from "../components/Body";
import { ref, set, get, query, equalTo, orderByChild } from "firebase/database";
import bcrypt from "bcryptjs";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validateInput = () => {
    if (!adminName) {
      setError("Admin Name is required");
      return false;
    }
    if (!email) {
      setError("Email is required");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateInput()) {
      return;
    }

    try {
      // Check for email and admin name duplication
      const emailQuery = query(
        ref(db, "Admin"),
        orderByChild("email"),
        equalTo(email)
      );
      const adminNameQuery = query(
        ref(db, "Admin"),
        orderByChild("adminName"),
        equalTo(adminName)
      );

      const emailSnapshot = await get(emailQuery);
      const adminNameSnapshot = await get(adminNameQuery);

      if (emailSnapshot.exists() || adminNameSnapshot.exists()) {
        setError("Email or Admin Name already in use");
        return;
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Save to Realtime Database
      const newAdminRef = ref(db, "Admin/" + email.replace(".", "_"));
      set(newAdminRef, {
        adminName,
        email,
        password: hashedPassword,
      });

      setSuccess("Signup successful!");
      navigate("/");
    } catch (err) {
      console.error("Error signing up:", err);
      setError("An error occurred during signup");
    }
  };

  return (
    <Body>
      <div className="body w-full md:w-1/2 max-w-[600px] h-full flex flex-col items-center bg-[rgba(0,0,0,0.5)] p-4">
        <img
          src="/images/resort_logo.png"
          className="max-w-[300px] w-full mb-10"
          alt="logo"
        />
        <form
          className="w-full flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label
              htmlFor="admin-name"
              className="text-white font-bold text-xl"
            >
              Admin Name
            </label>
            <input
              type="text"
              id="admin-name"
              className="p-2 max-w-[450px] w-[450px] rounded-2xl"
              placeholder="Enter admin name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white font-bold text-xl">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="p-2 max-w-[450px] w-[450px] rounded-2xl"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-white font-bold text-xl">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="p-2 max-w-[450px] w-[450px] rounded-2xl"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-500 font-bold text-lg">{error}</div>
          )}
          {success && (
            <div className="text-green-500 font-bold text-lg">{success}</div>
          )}
          <button
            type="submit"
            className="p-2 mt-4 bg-[#ffce55] font-bold text-xl text-white max-w-[450px] w-[450px] rounded-2xl"
          >
            Signup
          </button>
        </form>
        <a href="/" className="text-white mt-8 text-xl">
          Login
        </a>
      </div>
    </Body>
  );
}

export default Signup;
