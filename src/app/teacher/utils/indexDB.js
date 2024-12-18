// src/utils/indexedDbUtils.js
import Idb from 'idb-js';

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
                store.createIndex("id", "id", { unique: false });
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
    try {
        const db = await openDatabase();
        const transaction = db.transaction("courses", "readwrite");
        const store = transaction.objectStore("courses");

        // 深度拷贝，去除无法克隆的数据
        const sanitizedCourse = JSON.parse(JSON.stringify(course));

        const request = store.put(sanitizedCourse);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log("Course updated successfully");
                resolve();
            };
            request.onerror = (event) => {
                reject("Error updating course: " + event.target.error);
            };
        });
    } catch (error) {
        console.error("更新课程失败:", error);
        throw error;
    }
}


export async function getNextCourseId() {
    try {
        const db = await openDatabase();
        const tx = db.transaction("courses", "readonly");
        const store = tx.objectStore("courses");

        // 等待获取所有键值
        const allKeysRequest = store.getAllKeys();

        return new Promise((resolve, reject) => {
            allKeysRequest.onsuccess = () => {
                const allKeys = allKeysRequest.result;
                const nextId =  Math.max(...allKeys) > 20240 ? Math.max(...allKeys) + 1 : 20241; // 生成下一个 ID
                console.log("生成的课程 ID:", nextId);
                resolve(nextId);
            };

            allKeysRequest.onerror = () => {
                console.error("获取键值失败:", allKeysRequest.error);
                reject(allKeysRequest.error);
            };
        });
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
export const getCourseById = async (id) => {
    const db = await openDatabase();
    const tx = db.transaction("courses", "readonly");
    const store = tx.objectStore("courses");
    return store.get(id);
};


const DB_NAME = "CourseDB";
const DB_VERSION = 1;
const STORE_NAME = "courseImages";

export const openImageDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // 如果表不存在，则新建对象存储
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, {
                    keyPath: "id", // 主键
                    autoIncrement: true, // 自动生成 id
                });
                objectStore.createIndex("courseId", "courseId", { unique: false });
                objectStore.createIndex("imageOrder", "imageOrder", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

export const addCourseImages = async (courseId, imagePaths) => {
    const db = await openImageDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        imagePaths.forEach((imagePath, index) => {
            // 构建存储对象
            const imageData = {
                courseId: courseId,  // 课程 ID
                imagePath: imagePath, // 图片路径
                imageOrder: index + 1, // 图片顺序，从 1 开始
            };

            store.add(imageData);
        });

        transaction.oncomplete = () => {
            console.log("图片数据已成功添加到 IndexedDB");
            resolve();
        };
        transaction.onerror = (event) => {
            console.error("图片数据保存失败", event.target.error);
            reject(event.target.error);
        };
    });
};

export const getCourseImages = async (courseId) => {
    const db = await openImageDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("courseId");

        const request = index.getAll(IDBKeyRange.only(courseId));

        request.onsuccess = (event) => {
            console.log("获取到的课程图片数据:", event.target.result);
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error("获取课程图片失败", event.target.error);
            reject(event.target.error);
        };
    });
};


