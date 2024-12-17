// src/utils/indexedDbUtils.js

// 打开数据库
export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("CourseDatabase", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // 创建课程信息的 Object Store
            if (!db.objectStoreNames.contains("courses")) {
                const store = db.createObjectStore("courses", { keyPath: "id", autoIncrement: true });

                // 定义索引
                store.createIndex("title", "title", { unique: false });
                store.createIndex("description", "description", { unique: false });
                store.createIndex("teachers", "teachers", { unique: false });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result); // 数据库打开成功
        };

        request.onerror = (event) => {
            reject("Database error: " + event.target.errorCode);
        };
    });
}

// 添加课程
export async function addCourse(course) {
    const db = await openDatabase();
    const transaction = db.transaction("courses", "readwrite");
    const store = transaction.objectStore("courses");

    const request = store.add(course);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            console.log("Course added successfully");
            resolve();
        };
        request.onerror = (event) => {
            reject("Error adding course: " + event.target.error);
        };
    });
}

// 获取所有课程
export async function getAllCourses() {
    const db = await openDatabase();
    const transaction = db.transaction("courses", "readonly");
    const store = transaction.objectStore("courses");

    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject("Error fetching courses: " + event.target.error);
        };
    });
}

// 更新课程
export async function updateCourse(course) {
    const db = await openDatabase();
    const transaction = db.transaction("courses", "readwrite");
    const store = transaction.objectStore("courses");

    const request = store.put(course);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            console.log("Course updated successfully");
            resolve();
        };
        request.onerror = (event) => {
            reject("Error updating course: " + event.target.error);
        };
    });
}

export async function getNextCourseId() {
    try {
        const db = await openDatabase();
        const tx = db.transaction("courses", "readonly");
        const store = tx.objectStore("courses");
        const allKeys = await store.getAllKeys();
        const nextId = allKeys.length > 0 ? Math.max(...allKeys) + 1 : 20241; // 初始 ID 为 20241
        console.log("生成的课程 ID:", nextId);
        return nextId;
    } catch (error) {
        console.error("生成课程 ID 失败:", error);
        throw error;
    }
}

// 删除课程
export async function deleteCourse(courseId) {
    const db = await openDatabase();
    const transaction = db.transaction("courses", "readwrite");
    const store = transaction.objectStore("courses");

    const request = store.delete(courseId);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            console.log("Course deleted successfully");
            resolve();
        };
        request.onerror = (event) => {
            reject("Error deleting course: " + event.target.error);
        };
    });
}
