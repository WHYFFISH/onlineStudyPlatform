import React from 'react';
import style from "../../teacher/PublishClass/PublishClass.module.css";
import { Flex, Input } from 'antd';
import AddTeacherInfo from "../components/addTeacherInfo";
const { TextArea } = Input;
const onChange = (e) => {
    console.log('Change:', e.target.value);
};
const FilesContent = () => {
    return (
        <div className={style.centerContainer}>
            <h1 className={style.centertitle}>课程基础信息</h1>
            <div className={style.labelInputContainer}>
                <label >课程名：</label>
                <Input placeholder="请输入用户名" style={{ width: '400px' }} />
            </div>
            <div className={style.labelInputContainer}>
                <label >课程语种：</label>
                <Input placeholder="" style={{ width: '125px' }} />
                <label >开课次数：</label>
                <Input placeholder="" style={{ width: '145px' }} />
            </div>
            <div className={style.labelInputContainer}>
                <label >建议学分：</label>
                <Input placeholder="" style={{ width: '125px' }} />
                <label >建议学时：</label>
                <Input placeholder="" style={{ width: '145px' }} />
            </div>

            <AddTeacherInfo />
            {/* 
            <div className={style.labelInputContainer}>
                <label >建议教学对象：</label>
                <TextArea
                    placeholder="建议教学对象"
                    autoSize={{
                        minRows: 2,
                        maxRows: 6,
                    }}
                    style={{ width: '350px' }}
                />
            </div> */}

            <div className={style.InfoInputContainer}>
                <label >建议教学对象：</label>
                <Flex vertical gap={32}>
                    <TextArea showCount maxLength={150} onChange={onChange} placeholder="建议教学对象"
                        style={{
                            height: 120,
                            resize: 'none',
                            width: '485px'
                        }} />

                </Flex>
            </div>

            <div className={style.InfoInputContainer}>
                <label >课程简介：</label>
                <Flex vertical gap={32}>
                    <TextArea showCount maxLength={2000} onChange={onChange} placeholder="课程简介"
                        style={{
                            height: 240,
                            resize: 'none',
                            width: '485px'
                        }}
                    />
                </Flex>
            </div>

            <button className={style.actionButton}>
                发布
            </button>

        </div>

    );
};

export default FilesContent;