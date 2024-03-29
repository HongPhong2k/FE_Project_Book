import { Button, Divider, Drawer, Space } from "antd";
import { Badge, Descriptions } from "antd";
import moment from "moment";
import { Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AiFillStar } from "react-icons/ai";
const ViewBook = (props) => {
  const { view, setView, dataView, dataBook, setDataView } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const onClose = () => {
    setView(false);
    setFileList([]);
    setDataView("");
  };
  const customData = (dataBook) => {
    let data = dataBook[+dataView?.action];
    let arr = [];
    arr.push({
      uid: uuidv4(),
      name: data?.mainText,
      status: "done",
      url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${data?.thumbnail}`,
    });
    if (data && data.slider) {
      data.slider.map((pic, index) => {
        arr.push({
          uid: uuidv4(),
          name: data?.mainText,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${pic}`,
        });
      });

      setFileList(arr);
    }
  };

  useEffect(() => {
    customData(dataBook);
  }, [dataBook[dataView?.action]]);

  return (
    <>
      <Drawer
        title="Thông tin chi tiết Book"
        placement={"top"}
        height={550}
        onClose={onClose}
        open={view}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Tên sách">
            {dataView.name}
          </Descriptions.Item>
          <Descriptions.Item label="Tên tác giả">
            {dataView.author}
          </Descriptions.Item>
          <Descriptions.Item label="Tên thể loại">
            {dataView.category}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền">
            {dataView.price}đ
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dataView?.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {dataView?.updatedAt}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng">
            {/* <Badge status="processing"  /> */}
            {dataView.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Đã bán">{dataView.sold}</Descriptions.Item>
          <Descriptions.Item label="Đánh giá">
            {dataView.rate} <AiFillStar style={{ color: "yellow" }} />
          </Descriptions.Item>
        </Descriptions>
        <Divider>Ảnh Book</Divider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          showUploadList={{
            showRemoveIcon: false,
          }}
        ></Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </Drawer>
    </>
  );
};

export default ViewBook;
