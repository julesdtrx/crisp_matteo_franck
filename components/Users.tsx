import { getUsers } from "@/action/GetUsers"; // Import users data
import { User } from "@/types/Users"; // Create a type for users from db (see below)
 
export default async function Users() { // Note the 'async', it's important to wait the data before render the component
  const response = await getUsers(); // Call function to get users
 
  if (!response.ok || response.status >= 300) {
    return <p>Une erreur est survenue</p>;
  }
 
  const users = await response.json(); // Decode response
 
  return users.map((user: User, i: number) => { // Return users list
    return (
      <p key={i}>
        {user.firstname} {user.pwd} : {user.email}
      </p>
    );
  });
}