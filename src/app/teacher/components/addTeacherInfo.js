import React, { useState } from "react";
import { Input, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import style from "../../teacher/PublishClass/PublishClass.module.css";

const TeachersInfo = ({ onTeachersChange }) => {
  // 用于存储所有老师信息的输入框
  const [teachers, setTeachers] = useState([{ id: 1, name: "" ,place:""}]);

  // 添加新的输入框
  const addTeacher = () => {
    setTeachers([...teachers, { id: Date.now(), name: "" ,place:""}]);
  };

  // 更新输入框的值
  const updateTeacher = (id, field, value) => {
    const updatedTeachers = teachers.map((teacher) =>
      teacher.id === id ? { ...teacher, [field]: value } : teacher
    );
    setTeachers(updatedTeachers);
    onTeachersChange(updatedTeachers); // 通知父组件
  };

  const removeTeacher = (id) => {
    const filteredTeachers = teachers.filter((teacher) => teacher.id !== id);
    setTeachers(filteredTeachers);
    onTeachersChange(filteredTeachers); // 通知父组件
  };
 

  return (
    <div className={style.teachersContainer}>
    

      {/* 动态渲染输入框 */}
      {teachers.map((teacher, index) => (
        <Space key={teacher.id} className={style.teacherRow} align="center" >
          <label>老师姓名 {index + 1}：</label>
          <Input
            placeholder="请输入老师姓名"
            value={teacher.name}
            onChange={(e) => updateTeacher(teacher.id, "name",e.target.value)}
            className={style.shortInput}
          />
          <label>单位：</label>
          <Input
            placeholder="请输入老师单位"
            value={teacher.place}
            onChange={(e) => updateTeacher(teacher.id, "place",e.target.value)}
            className={style.shortInput}
          />
          {/* 删除按钮 */}
          {teachers.length > 1 && (
            <MinusCircleOutlined
              onClick={() => removeTeacher(teacher.id)}
              style={{ color: "red", cursor: "pointer" }}
            />
          )}
        </Space>
      ))}

      {/* 添加按钮 */}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addTeacher}
        className={style.addButton}
      >
        添加老师
      </Button>
    </div>
  );
};

export default TeachersInfo;
