import { nanoid } from "nanoid";
import { unstable_noStore as noStore } from "next/cache";

export type User = {
  userId: string;
  username: string;
  name: string;
  weight: number;
  lastLogin: Date;
  createdAt: Date;
};

const nameParts: string[] = [
  "Happy",
  "Cat",
  "Ice",
  "Hamburger",
  "Pizza",
  "Flower",
  "Squirrel",
  "Labrador",
  "Husky",
  "John",
  "Smith",
  "Tofu",
  "Pepper",
  "Justin",
  "Roth",
  "Cook",
  "Gates",
  "Mark",
];

function isInteger(x: number): boolean {
  return x === Math.floor(x);
}

function randInt(a: number, b?: number): number {
  if (b === undefined) {
    if (a <= 0) {
      throw new Error("Maximum should be greater than 0");
    }
    if (!isInteger(a)) {
      throw new Error("Maximum should be an integer");
    }
    return randInt(0, a);
  }
  if (a >= b) {
    throw new Error("Invalid range");
  }
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("Bounds should be integers");
  }
  return a + Math.floor((b - a) * Math.random());
}

function randNamePart() {
  return nameParts[randInt(nameParts.length)];
}

function genUsername() {
  return [randNamePart(), randNamePart()].map((x) => x.toLowerCase()).join("_");
}

function genName() {
  return [randNamePart(), randNamePart()].join(" ");
}

function genUser(): User {
  return {
    userId: nanoid(),
    username: genUsername(),
    name: genName(),
    weight: randInt(100, 200),
    lastLogin: new Date(
      2025,
      2,
      randInt(1, 28),
      randInt(24),
      randInt(60),
      randInt(60),
    ),
    createdAt: new Date(
      2025,
      3,
      randInt(1, 31),
      randInt(24),
      randInt(60),
      randInt(60),
    ),
  };
}

function genUsers(count: number): User[] {
  if (count <= 0) {
    throw new Error("Should generate at least 1 user");
  }
  if (!isInteger(count)) {
    throw new Error("Should give an integer");
  }
  return Array.from({ length: count }).map((_) => genUser());
}

const numTotalUsers = 150;

export async function getUsers({
  offset,
  limit,
}: {
  offset?: number;
  limit?: number;
} = {}): Promise<[User[], number | undefined]> {
  noStore();
  if (offset !== undefined && (!isInteger(offset) || offset < 0)) {
    throw new Error("Offset should be non-negative integer");
  }
  if (limit !== undefined && (!isInteger(limit) || limit <= 0)) {
    throw new Error("Limit should be positive integer");
  }

  const effectiveOffset = offset === undefined ? 0 : offset;
  if (limit === undefined) {
    return [genUsers(numTotalUsers), undefined];
  }
  if (effectiveOffset >= numTotalUsers) {
    return [[], undefined];
  }
  const users = genUsers(Math.min(limit, numTotalUsers - effectiveOffset));
  let nextOffset: number | undefined = effectiveOffset + users.length;
  if (nextOffset >= numTotalUsers) {
    nextOffset = undefined;
  }

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, Math.random() * 2000);
  });
  return [users, nextOffset];
}
