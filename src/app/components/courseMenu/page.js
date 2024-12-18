"use client"
import { Menu } from 'antd';
import { useState } from 'react';

const CourseMenu = () => {
  const items = [
    {
      key: '1',
      // icon: <MailOutlined />,
      label: '课程概述与目标',
      children: [
        {
          key: '11',
          label: '课程简介',
        },
        {
          key: '12',
          label: '学习目标',
        },
        {
          key: '13',
          label: '课程评价标准',
        },
      ],
    },
    {
      key: '2',
      // icon: <AppstoreOutlined />,
      label: '数字集成电路基础',
      children: [
        {
          key: '21',
          label: '数字电路概念与基本元素',
        },
        {
          key: '22',
          label: '逻辑门与组合逻辑',
        },
        {
          key: '23',
          label: 'Chisel开发环境搭建',
          children: [
            {
              key: '231',
              label: '时序逻辑与寄存器',
            },
            {
              key: '232',
              label: '电子元件与电路模型',
            },
            {
              key: '233',
              label: 'Chisel简介与安装',
            },
          ],
        },
        {
          key: '24',
          label: 'LC-3处理器架构',
          children: [
            {
              key: '241',
              label: 'LC-3处理器概述',
            },
            {
              key: '242',
              label: '数据通路与控制单元',
            },
            {
              key: '243',
              label: '指令集与执行模型',
            },
            {
              key: '244',
              label: 'LC-3与现代处理器对比',
            },
            {
              key: '245',
              label: '测试代码编写与运行',
            },
            {
              key: '246',
              label: '仿真结果与分析',
            },
          ],
        },
      ],
    },
    {
      key: '3',
      // icon: <SettingOutlined />,
      label: 'UART模块设计与应用',
      children: [
        {
          key: '31',
          label: 'UART基本工作原理',
        },
        {
          key: '32',
          label: 'UART模块设计',
        },
        {
          key: '33',
          label: 'UART模块调试与应用',
        },
        {
          key: '34',
          label: '存储器模块实现与验证',
        },
        {
          key: '35',
          label: '数据通路测试',
        },
        {
          key: '36',
          label: ' 数据通路的组成',
        },
      ],
    },
  ];
  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  const levelKeys = getLevelKeys(items);

  const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  }

  return (
    <>
      <div style={{marginTop:30,marginLeft:30,marginBottom:20}}>章节目录</div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['231']}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: "100%",
          border:"none",
        }}
        items={items}
      />
    </>
  );
};


export default CourseMenu;
