"use client";
 
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
 
export default function LoginForm() {
  const [error, setError] = useState(<></>);
  const router = useRouter();
  const pathname = usePathname();
 
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
 
    // Get data from form
    const email = e.currentTarget.email.value.trim();
    const password = e.currentTarget.password.value.trim();
    // If any data is empty
    if (email == "" || password == "") {
      setError(<p>All fields are required</p>);
    } else {
      try {
        // Fetch "/api/login" route
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        // If there is an error
        if (!response.ok || response.status >= 300) {
          const { message } = await response.json();
          setError(<p>{message}</p>);
        } else {
          if (pathname.startsWith("/login")) {
            router.push("/pages/page1"); // Redirect to /mon-compte page
          }
          router.refresh(); // Keep this page
        }
      } catch (error) {
        console.error(error);
        setError(<p>An error occured</p>);
      }
    }
  };
 
  return (
    <>
      <form method="POST" onSubmit={handleLogin}>
        <label htmlFor="email">Email : </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="john.doe@gmail.com"
        />
        <br />
        <label htmlFor="password">Password : </label>
        <input type="password" name="password" id="password" />
        <br />
        <input type="submit" name="login" value="Login" />
      </form>
      {error && error}
    </>
  );
}