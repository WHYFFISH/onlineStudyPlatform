import { db } from "../../../utils/db"; // 导入数据库连接

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // 查询 role 为 "学生" 的用户
            const [rows] = await db.execute(`
        SELECT id, name, email, phone, avatar, status, created_at 
        FROM Users 
        WHERE role = '学生'
      `);

            if (rows.length > 0) {
                res.status(200).json({
                    success: true,
                    message: "获取学生列表成功",
                    data: rows,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "没有找到学生用户",
                    data: [],
                });
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            res.status(500).json({
                success: false,
                message: "服务器内部错误，请稍后重试",
            });
        }
    } else {
        res.status(405).json({ success: false, message: "请求方法不被允许" });
    }
}
