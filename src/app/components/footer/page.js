import { FacebookOutlined, TwitterOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';

const { Text, Title } = Typography;

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <Row gutter={40} justify="space-between" align="top">
        {/* 公司信息部分 */}
        <Col xs={24} sm={8}>
          <Title level={3} style={titleStyle}>课程平台</Title>
          <Text style={textStyle}>
            提供最专业的在线课程，涵盖从前端开发到后端架构的各类课程，助力你实现技术梦想！
          </Text>
        </Col>

        {/* 快速链接部分 */}
        <Col xs={24} sm={8}>
          <Title level={4} style={subTitleStyle}>快速链接</Title>
          <ul style={linkListStyle}>
            <li><a href="/" style={linkItemStyle}>首页</a></li>
            <li><a href="/courses" style={linkItemStyle}>课程</a></li>
            <li><a href="/about" style={linkItemStyle}>关于我们</a></li>
            <li><a href="/contact" style={linkItemStyle}>联系我们</a></li>
          </ul>
        </Col>

        {/* 社交媒体部分 */}
        <Col xs={24} sm={8}>
          <Title level={4} style={subTitleStyle}>关注我们</Title>
          <div style={socialMediaStyle}>
            <a href="https://facebook.com" style={iconStyle} target="_blank" rel="noopener noreferrer">
              <FacebookOutlined />
            </a>
            <a href="https://twitter.com" style={iconStyle} target="_blank" rel="noopener noreferrer">
              <TwitterOutlined />
            </a>
            <a href="https://linkedin.com" style={iconStyle} target="_blank" rel="noopener noreferrer">
              <LinkedinOutlined />
            </a>
            <a href="https://github.com" style={iconStyle} target="_blank" rel="noopener noreferrer">
              <GithubOutlined />
            </a>
          </div>
        </Col>
      </Row>

      {/* 版权信息 */}
      <div style={copyrightStyle}>
        <Text style={copyrightTextStyle}>
          &copy; 2024 课程平台，保留所有权利 | <a href="/privacy-policy" style={linkItemStyle}>隐私政策</a> | <a href="/terms" style={linkItemStyle}>使用条款</a>
        </Text>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#001529',  // 深色背景
  color: 'white',
  padding: '40px 20px',
  textAlign: 'left',
};

const titleStyle = {
  color: '#fff',
  fontWeight: 'bold',
};

const subTitleStyle = {
  color: '#fff',
};

const textStyle = {
  color: '#ddd',
};

const linkListStyle = {
  padding: 0,
  listStyleType: 'none',
};

const linkItemStyle = {
  color: '#ddd',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  '&:hover': {
    color: '#1890ff',  // 添加hover效果
  },
};

const socialMediaStyle = {
  display: 'flex',
  gap: '10px',
};

const iconStyle = {
  fontSize: '24px',
  color: '#ddd',
  '&:hover': {
    color: '#1890ff',  // 添加hover效果
  },
};

const copyrightStyle = {
  marginTop: '20px',
  textAlign: 'center',
};

const copyrightTextStyle = {
  color: '#ddd',
  fontSize: '14px',
};

export default Footer;
