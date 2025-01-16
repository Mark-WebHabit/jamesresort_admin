import { useState } from "react";
import Body from "../components/Body";
import { ref, get, query, equalTo, orderByChild } from "firebase/database";
import bcrypt from "bcryptjs";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Check for admin name in the database
      const adminNameQuery = query(
        ref(db, "Admin"),
        orderByChild("adminName"),
        equalTo(adminName)
      );

      const adminNameSnapshot = await get(adminNameQuery);

      if (!adminNameSnapshot.exists()) {
        setError("Admin Name does not exist");
        return;
      }

      // Get the admin data
      let adminData = null;
      adminNameSnapshot.forEach((childSnapshot) => {
        adminData = childSnapshot.val();
      });

      // Check if the password matches
      const passwordMatch = bcrypt.compareSync(password, adminData.password);

      if (!passwordMatch) {
        setError("Incorrect password");
        return;
      }

      // Redirect to dashboard
      localStorage.setItem("user", "authenticated");
      navigate("/home");
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred during login");
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
          <button
            type="submit"
            className="p-2 mt-4 bg-[#ffce55] font-bold text-xl text-white max-w-[450px] w-[450px] rounded-2xl"
          >
            Login
          </button>
        </form>
        <a href="/signup" className="text-white mt-8 text-xl">
          Sign up
        </a>
      </div>
    </Body>
  );
}

export default Login;
