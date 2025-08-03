"use client"

import { useGetAllUsersQuery } from "@/redux/api/userApi";

const ManageUsers = () => {
    const { data: allUsers } = useGetAllUsersQuery({})
    return (
        <div>
            manage users
        </div>
    );
};

export default ManageUsers;