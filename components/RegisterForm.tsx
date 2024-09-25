"use client";
 
import { hashPassword } from "@/utils/bcryptjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
 
export default function RegisterForm() {
  const [error, setError] = useState(<></>);
  const router = useRouter();
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
 
    // Get data from form
    const firstname = e.currentTarget.firstname.value.trim();
    const email = e.currentTarget.email.value.trim();
    const plainPassword = e.currentTarget.password.value.trim();
    // If any data is empty
    if (
      firstname == "" ||
      email == "" ||
      plainPassword == ""
    ) {
      setError(<p>All fields are required</p>);
    } else {
      try {
        const password = await hashPassword(plainPassword); // Hash password
        // Fetch "/api/register" route
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            email,
            password,
          }),
        });
        // If there is an error (user already exists for exemple)
        if (!response.ok || response.status >= 300) {
          const { message } = await response.json();
          setError(<p>{message}</p>);
        } else {
          router.push("/login"); // Redirect to login page
        }
      } catch (error) {
        console.error(error);
        setError(<p>An error occured</p>);
      }
    }
  };
 
  return (
    <>
      <form method="POST" onSubmit={handleRegister}>
        <label htmlFor="firstname">firstname : </label>
        <input type="text" name="firstname" id="firstname" placeholder="John" />
        <br />
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
        <input type="submit" name="register" value="Register" />
      </form>
      {error && error}
    </>
  );
}