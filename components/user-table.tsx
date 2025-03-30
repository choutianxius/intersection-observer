"use client";

import { getUsers, type User } from "@/lib/actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import React from "react";

const PAGE_SIZE = 35;

export default function UserTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [nextOffset, setNextOffset] = React.useState<number | undefined>(
    undefined,
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  const observerRef = React.useRef<IntersectionObserver>(undefined);

  async function loadMoreUsers() {
    setLoading(true);
    try {
      const [users_, nextOffset_] = await getUsers({
        offset: nextOffset,
        limit: PAGE_SIZE,
      });
      setUsers((x) => [...x, ...users_]);
      setNextOffset(nextOffset_);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  /**
   * @see https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
   */
  function lastRowRef(tr: HTMLTableRowElement | null) {
    if (loading) {
      return;
    }
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries?.[0]?.isIntersecting && nextOffset !== undefined) {
        loadMoreUsers();
      }
    });
    if (tr) {
      observerRef.current.observe(tr);
    }
  }

  React.useEffect(() => {
    // initial load
    loadMoreUsers();
  }, []);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Weight (lbs)</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users &&
            users.map((user, idx) => (
              <TableRow
                key={`user-row-${user.userId}`}
                ref={idx === users.length - 1 ? lastRowRef : null}
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <a
                    className="text-sky-400 hover:text-sky-500"
                    href={`#${user.userId}`}
                  >
                    {user.username}
                  </a>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.weight}</TableCell>
                <TableCell>{formatDate(user.lastLogin)}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {loading && <p>Loading...</p>}
    </>
  );
}

function formatDate(t: Date): string {
  return (
    `${t.getFullYear()}/` +
    `${String(t.getMonth() + 1).padStart(2, "0")}/` +
    `${String(t.getDate()).padStart(2, "0")} ` +
    `${String(t.getHours()).padStart(2, "0")}:` +
    `${String(t.getMinutes()).padStart(2, "0")}:` +
    `${String(t.getSeconds()).padStart(2, "0")}`
  );
}
