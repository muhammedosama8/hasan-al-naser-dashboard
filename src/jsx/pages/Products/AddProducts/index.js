import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import uploadImg from "../../../../images/upload-img.png";
import "../style.scss";
import { toast } from "react-toastify";
import BaseService from "../../../../services/BaseService";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../../common/Loader";
import { Translate } from "../../../Enums/Tranlate";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ProductsService from "../../../../services/ProductsService";

const AddProducts = () => {
  // const typesOptions = [
  //   {label: 'Premium Products', value: 'premium_products'},
  //   {label: 'High Pressure', value: 'high_pressure'},
  // ]
  const [product, setProduct] = useState({
    title: "",
    // type: '',
    description: EditorState.createEmpty(),
    images: [
      { src: "", loading: false },
      { src: "", loading: false }, 
      { src: "", loading: false }, 
      { src: "", loading: false }, 
      { src: "", loading: false }],
  });
  const [errors, setErrors] = useState({
    desc: false
  });
  const [id, setId] = useState(null);
  const [loading, setLoadning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const productsService = new ProductsService()
  const lang = useSelector((state) => state.auth.lang);

  useEffect(() => {
    let item = location.state

    if(item){
      setLoadning(true)
      setProduct({
        id: item.id,
        title: item?.title,
        // type: typesOptions?.find(res=> res.value === item.type),
        description: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(item?.description))),
        images: product?.images?.map((_,ind)=>{
          return{
            src: item?.show_product_images[ind]?.url || '',
            loading: false
          }
        })
      })
      setId(item.id)
      setLoadning(false)
    }
  }, []);

  const fileHandler = (e, index, ) => {
    let filesAll = e.target.files;
    const filesData = Object.values(filesAll);
    let update = product?.images.map((item, ind) => {
      if (ind === index) {
        return { src: "", loading: true };
      } else {
        return { ...item };
      }
    });
    setProduct({ ...product, images: update });
    new BaseService().postUpload(filesData[0]).then((res) => {
      if (res?.data?.status) {
        let updateImages = product?.images.map((item, ind) => {
          if (ind === index) {
            return { src: res.data.url, loading: false };
          } else {
            return { ...item };
          }
        });
        setProduct({ ...product, images: updateImages });
      }
    });
  };

  const handlerText = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const submit = () => {
    if (!product?.description) {
      setErrors({
        ...errors,
        desc: !product.description,
      });
      return;
    }
    if (product?.images?.filter((res) => !!res?.src)?.length === 0) {
      toast.error("Upload Images");
      return;
    }

    setLoadning(true);
    let data = {
      title: product.title,
      type: "high_pressure", //product.type.value,
      description: draftToHtml(convertToRaw(product?.description.getCurrentContent())),
      images: product?.images
        ?.filter((res) => !!res?.src)
        ?.map((item) => item?.src)
    };

    if (!!id) {
      productsService.update(id, data)?.then((res) => {
        if (res.data?.status === 200) {
          toast.success("Product Updated Successfully");
          navigate(`/home/products`)
        }
        setLoadning(false);
      }).catch(()=> setLoadning(false))
    } else {
      productsService.create(data)?.then((res) => {
        if (res.data?.status === 201) {
          toast.success("Product Added Successfully");
          navigate(`/home/products`)
        }
        setLoadning(false);
      });
    }
  };

  const deleteImg = (index) => {
    let update = product?.images.map((item, ind) => {
      if (ind === index) {
        return {
          ...item,
          src: "",
        };
      } else {
        return { ...item };
      }
    });
    setProduct({ ...product, images: update });
  };

  if (loading) {
    return (
      <Card className="p-4" style={{ minHeight: "30rem" }}>
        <Loader />
      </Card>
    );
  }
  return (
    <Card className="p-4">
      <AvForm onValidSubmit={submit} className="add-product">
        <Row>
          <Col md={6} className="mb-3">
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
                }
              }}
              value={product.title}
              onChange={(e) => handlerText(e)}
            />
          </Col>
          <Col md={12} className="mb-5">
            <label className="text-label">
              {Translate[lang]?.description}
            </label>
            <Editor
              editorState ={product?.description}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={(e) => {
                setProduct({...product, description: e})
                setErrors({...errors, desc: false})
              }}
            />
            {errors["desc"] && (
              <p className="text-danger m-0" style={{ fontSize: "12.8px" }}>
                {Translate[lang].field_required}
              </p>
            )}
          </Col>
        </Row>

        <Row>
        <Col md={12} sm={12} className="mb-3 mt-5">
          {Translate[lang].images}
        </Col>
          {product?.images?.map((data, index) => {
            return (
              <Col md={3} sm={6} className="mb-3" key={index}>
                <div className="image-placeholder" style={{maxWidth: '100%'}}>
                  <div className="avatar-edit h-100">
                    <input
                      type="file"
                      className="d-block w-100 h-100 cursor-pointer"
                      style={{opacity: '0'}}
                      onChange={(e) => fileHandler(e, index)}
                      id={`imageUpload${index}`}
                    />
                  </div>
                  <button
                    className="delete-img"
                    type="button"
                    onClick={() => deleteImg(index)}
                  >
                    <i className="la la-trash"></i>
                  </button>
                  <div className="avatar-preview w-100">
                    {!!data.src ? (
                      <div id={`imagePreview${index}`}>
                        <img
                          id={`saveImageFile${index}`}
                          src={data?.src}
                          alt="icon"
                        />
                      </div>
                    ) : (
                      <div id={`imagePreview${index}`}>
                        {data.loading && <Loader />}
                        {!data.loading  && (
                          <img
                            id={`saveImageFile${index}`}
                            src={uploadImg}
                            alt="icon"
                            style={{
                              width: "60px",
                              height: "60px",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/home/products")}
          >
            {Translate[lang]?.cancel}
          </Button>
          <Button variant="primary" loading={loading} type="submit">
            {Translate[lang]?.submit}
          </Button>
        </div>
      </AvForm>
    </Card>
  );
};

export default AddProducts;
