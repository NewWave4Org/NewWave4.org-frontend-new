'use client';
import UsersTable from "@/components/admin/Users/UsersTable";
import { getUserInfo } from "@/store/auth/action";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getUsers } from "@/store/users/actions";
import { useEffect } from "react";

function UsersPage() {
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.users.users);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getUserInfo());
  }, [dispatch]);

  return (
    <UsersTable users={users} />
  );
}

export default UsersPage;