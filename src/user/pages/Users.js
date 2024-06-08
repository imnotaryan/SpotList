import React from "react";
import UserList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Max',
      image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg2Ge37vqtFK8fnCZl5MPY91pQORXennBVAA&s',
      places: 3
    }
  ];
  return <UserList items={USERS} />;
};

export default Users;
