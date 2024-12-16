import bcrypt from "bcryptjs";

export const mockUsers = {
    student: [
        { username: "student001", password: bcrypt.hashSync("student123", 10), isFrozen: false },
        { username: "student002", password: bcrypt.hashSync("student123", 10), isFrozen: false },
        { username: "student003", password: bcrypt.hashSync("student123", 10), isFrozen: false },
    ],
    teacher: [
        { username: "teacher001", password: bcrypt.hashSync("teacher123", 10), isFrozen: false },
    ],
    admin: [
        { username: "admin001", password: bcrypt.hashSync("admin123", 10), isFrozen: false },
    ],
};

export const failedAttempts = {
    ip: {},
    device: {},
};
