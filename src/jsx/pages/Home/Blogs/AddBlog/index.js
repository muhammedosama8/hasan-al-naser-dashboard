import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import "../style.scss";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Translate } from "../../../../Enums/Tranlate";
import BaseService from "../../../../../services/BaseService";
import Loader from "../../../../common/Loader";
import uploadImg from "../../../../../images/upload-img.png"
import BlogService from "../../../../../services/BlogService";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'draft-js/dist/Draft.css';

const AddBlog = () => {
  const [blog, setBlog] = useState({
    title: "",
    date: "",
    category: "",
    description: EditorState.createEmpty(),
    image_src: ""
  });
  const [errors, setErrors] = useState({
    description: false,
    image: false
  })
  const [confirm, setConfirm] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoadning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const Auth = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.auth.lang);
  const blogService = new BlogService()

  useEffect(()=>{
    if(!!location.state){
      setId(location.state?.id)
      setBlog({
        ...location.state,
        description: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(location.state?.description))),
        date:location.state?.date?.split("T")[0],
        image_src: location.state?.image
      })
    }
  },[])

  const fileHandler = (e) => {
    if(e.target.files?.length === 0){
      return
    }
    let filesAll = e.target.files;
    const filesData = Object.values(filesAll);

    new BaseService().postUpload(filesData[0]).then((res) => {
      if (res?.data?.status) {
        setBlog({ ...blog, image_src: res.data.url });
      }
    });
  };

  const handlerText = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const submit = () => {
    if (!blog.description || !blog.image_src) {
      setErrors({
        description: !blog.description,
        image: !blog.image_src,
      });
      return;
    }

    setLoadning(true);
    let data = {
      title: blog.title,
      description: draftToHtml(convertToRaw(blog?.description.getCurrentContent())),
      image: blog?.image_src,
      category: blog.category,
      date: blog.date,
    };

    if (!!id) {
      blogService.update(id, data)?.then((res) => {
        if (res.data?.status === 200) {
          toast.success("Blog Updated Successfully");
          navigate(`/home/blogs`)
        }
        setLoadning(false);
      });
    } else {
      blogService.create(data)?.then((res) => {
        if (res.data?.status === 201) {
          setConfirm(true);
          toast.success("Blog Added Successfully");
        }
        setLoadning(false);
      });
    }
  };

  const deleteImg = () => {
    setBlog({ ...blog, image_src: "" });
  };

  if (Auth.showLoading) {
    return (
      <Card className="p-4" style={{ minHeight: "30rem" }}>
        <Loader />
      </Card>
    );
  }
  return (
    <Card className="p-4">
      <AvForm onValidSubmit={submit} className="add-blog">
        <Row>
          <Col md={12} className="mb-3">
            <AvField
              label={`${Translate[lang]?.title}`}
              type="text"
              placeholder={Translate[lang]?.title}
              bsSize="lg"
              name="title"
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                },
                // pattern: {
                //   value: "/^[A-Za-z0-9 ]+$/",
                //   errorMessage: `English format is invalid`,
                // },
              }}
              value={blog.title}
              onChange={(e) => handlerText(e)}
            />
          </Col>
          <Col md={12} className="mb-3">
            <label className="text-label">
              {Translate[lang]?.description}
            </label>
            <Editor
                editorState ={blog?.description}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(e) => {
                  setBlog({...blog, description: e})
                }}
            />
            {/* <textarea
              name="description"
              style={{
                minHeight: "80px",
                maxHeight: "200px",
                height: "200px",
              }}
              className="form-control"
              required
              placeholder={Translate[lang]?.description}
              value={blog.description}
              onChange={(e) => {
                setErrors({
                  ...errors,
                  description: false,
                });
                handlerText(e);
              }}
              rows="6"
            ></textarea> */}
            {errors.description && (
              <p className="text-danger m-0" style={{ fontSize: "12.8px" }}>
                {Translate[lang].field_required}
              </p>
            )}
          </Col>
          <Col md={6} className="mb-3">
            <label className="text-label">
              {Translate[lang]?.date}
            </label>
            <input
              name="date"
              className="form-control"
              type="date"
              required
              value={blog.date}
              onChange={(e) => {
                handlerText(e);
              }}
            ></input>
          </Col>
          <Col md={6} sm={6} className="mb-3">
            <AvField
              label={Translate[lang]?.category}
              type="text"
              placeholder={Translate[lang]?.category}
              bsSize="lg"
              name="category"
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                },
              }}
              value={blog.category}
              onChange={(e) => handlerText(e)}
            />
          </Col>
        </Row>

        <Row>
        <Col md={9} sm={12} className="mb-3">
          <label className="text-label">
              {Translate[lang]?.image}
            </label>
                <div className="image-placeholder">
                  <div className="avatar-edit w-100 h-100">
                    <input
                      type="file"
                      className="w-100 h-100 d-block cursor-pointer"
                      style={{opacity: '0'}}
                      onChange={(e) => fileHandler(e)}
                      id={`imageUpload`}
                    />
                    {/* <label htmlFor={`imageUpload`} name=""></label> */}
                  </div>
                  <button
                    className="delete-img"
                    type="button"
                    style={{
                      left: lang === 'ar' ? '16px' : "auto",
                      right: lang === 'en' ? '16px' : "auto",
                    }}
                    onClick={() => deleteImg()}
                  >
                    <i className="la la-trash"></i>
                  </button>
                  <div className="avatar-preview">
                    {!!blog?.image_src ? (
                      <div id={`imagePreview`}>
                        <img
                          id={`saveImageFile`}
                          src={blog?.image_src}
                          alt="icon"
                        />
                      </div>
                    ) : (
                      <div id={`imagePreview`}>
                        {/* {files[0]?.name && (
                          <img
                            id={`saveImageFile$`}
                            src={URL.createObjectURL(files[0])}
                            alt="icon"
                          />
                        )} */}
                        {!blog?.image_src && (
                          <img
                            id={`saveImageFile`}
                            src={uploadImg}
                            alt="icon"
                            style={{
                              width: "100px", height: "100px",
                              maxHeight: "100px", maxWidth: "100px"
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Col>
        </Row>

        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/home/blogs")}
          >
            {Translate[lang]?.cancel}
          </Button>
          <Button variant="primary" loading={loading} type="submit">
            {!!id ? Translate[lang]?.edit : Translate[lang]?.submit}
          </Button>
        </div>
      </AvForm>
      {confirm}
    </Card>
  );
};

export default AddBlog;
