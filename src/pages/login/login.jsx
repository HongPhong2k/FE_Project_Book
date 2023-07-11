import { Button, Divider, Form, Input, message, notification } from "antd";
import "./login.scss";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ApiLogin } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";
import { useEffect } from "react";
import {
  doLoginSocialFalse,
  doLoginSocialTrue,
} from "../../redux/cart/cartSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoginSocial = useSelector((state) => state.cart.isLoginSocial);
  //////////////////
  history.pushState(null, document.title, location.href);
  window.addEventListener("popstate", function (event) {
    history.pushState(null, document.title, location.href);
  });

  const onFinish = async (values) => {
    const { email, password } = values;
    let res = await ApiLogin(email, password);
    if (res?.data) {
      localStorage.setItem("access_token", res.access_token);
      dispatch(doLoginAction(res.data));
      message.success("Đăng nhập thành công");
      navigate("/");
    } else {
      notification.error({
        message: "Đăng nhập thất bại",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 4,
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access_token")) return navigate("/");
    dispatch(doLoginSocialFalse());
  }, []);
  console.log("loginnnnnn", isLoginSocial);
  const handleLoginWithGoogle = () => {
    window.open("http://localhost:8086/api/v1/auth/google", "_self");
    dispatch(doLoginSocialTrue());
  };
  const handleLoginWithFacebook = () => {
    window.open("http://localhost:8086/api/v1/auth/facebook", "_self");
  };
  return (
    <div className="login-container">
      <div className="content">
        <div className="title-login">Đăng Nhập</div>
        <Divider />
        <div className="form-content">
          <Form name="basic" onFinish={onFinish} autoComplete="off">
            <Form.Item
              labelCol={{ span: 24 }}
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="text">
          <p onClick={() => navigate("/register")}>Đăng kí</p>
          <u>Quên mật khẩu ?</u>
        </div>
        <div className="group">
          <Divider
            style={{
              borderColor: "black",
            }}
          >
            Or Sign Up Using
          </Divider>
          <div className="login-with">
            <div className="google" onClick={() => handleLoginWithGoogle()}>
              <GoogleOutlined />
            </div>
            <div className="faceBook" onClick={handleLoginWithFacebook}>
              <FacebookOutlined />
            </div>
          </div>
          <div className="home" onClick={() => navigate("/")}>
            &#60;Trang Chủ&#62;
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
