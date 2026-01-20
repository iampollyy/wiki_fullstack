import styles from "./UserManagementPage.module.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiFetch } from "@shared/utils/fetch";
import { RootState } from "@core/store/store";
import { useNavigate } from "react-router";

type UserRole = "admin" | "user";

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export const UserManagementPage = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }

    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        const res = await apiFetch("users");
        const data = (await res.json()) as IUser[];

        setUsers(
          data.map((user) => ({
            ...user,
            role: (user.role as UserRole) || "user",
          }))
        );
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load the users list. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [currentUser, navigate]);

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      setUpdatingUserId(userId);
      setError(null);

      await apiFetch(`users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <div className={styles.userManagementPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <p className={styles.subtitle}>
          Only administrators can view the list of users and change their roles.
        </p>
      </div>

      {loading && <p className={styles.statusMessage}>Loading users list…</p>}

      {!loading && error && (
        <p className={`${styles.statusMessage} ${styles.statusMessage_error}`}>
          {error}
        </p>
      )}

      {!loading && !error && users.length === 0 && (
        <p className={styles.statusMessage}>No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.cell_head}>Name</th>
                <th className={styles.cell_head}>Email</th>
                <th className={styles.cell_head}>Current Role</th>
                <th className={styles.cell_head}>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={styles.row}>
                  <td className={styles.cell}>
                    <div className={styles.userIdentity}>
                      <div className={styles.avatar}>
                        {user.firstName.charAt(0).toUpperCase()}
                        {user.lastName.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.userNames}>
                        <span className={styles.userFullName}>
                          {user.firstName} {user.lastName}
                        </span>
                        <span className={styles.userId}>ID: {user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.cell}>
                    <span className={styles.email}>{user.email}</span>
                  </td>
                  <td className={styles.cell}>
                    <span
                      className={`${styles.roleBadge} ${
                        user.role === "admin"
                          ? styles.roleBadge_admin
                          : styles.roleBadge_user
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className={styles.cell}>
                    <select
                      className={styles.roleSelect}
                      value={user.role}
                      disabled={updatingUserId === user.id}
                      onChange={(event) =>
                        handleRoleChange(
                          user.id,
                          event.target.value as UserRole
                        )
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
