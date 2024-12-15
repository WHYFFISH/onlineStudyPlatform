import React, { useState } from "react";
import { Input, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import style from "../../teacher/PublishClass/PublishClass.module.css";

const TeachersInfo = () => {
  // 用于存储所有老师信息的输入框
  const [teachers, setTeachers,workPlace] = useState([{ id: 1, name: "" ,place:""}]);

  // 添加新的输入框
  const addTeacher = () => {
    setTeachers([...teachers, { id: Date.now(), name: "" }]);
  };

  // 更新输入框的值
  const updateTeacherName = (id, value) => {
    const updatedTeachers = teachers.map((teacher) =>
      teacher.id === id ? { ...teacher, name: value } : teacher
    );
    setTeachers(updatedTeachers);
  };

  const updateTeacherPlace = (id, value) => {
    const updatedTeachers = teachers.map((teacher) =>
      teacher.id === id ? { ...teacher, place: value } : teacher
    );
    setTeachers(updatedTeachers);
  };

  // 删除输入框
  const removeTeacher = (id) => {
    const filteredTeachers = teachers.filter((teacher) => teacher.id !== id);
    setTeachers(filteredTeachers);
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
            onChange={(e) => updateTeacherName(teacher.id, e.target.value)}
            className={style.shortInput}
          />
          <label>单位：</label>
          <Input
            placeholder="请输入老师单位"
            value={teacher.place}
            onChange={(e) => updateTeacherName(teacher.place, e.target.value)}
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
