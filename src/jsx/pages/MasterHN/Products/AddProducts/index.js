import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { AvField, AvForm } from "availity-reactstrap-validation";
import uploadImg from "../../../../../images/upload-img.png";
import "../style.scss";
import { toast } from "react-toastify";
import BaseService from "../../../../../services/BaseService";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../common/Loader";
import { Translate } from "../../../../Enums/Tranlate";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import CategoriesService from "../../../../../services/CategoriesService";
import MHProductsService from "../../../../../services/MHProductsService";
import VariantService from "../../../../../services/VariantService";
import { loadingToggleAction } from "../../../../../store/actions/AuthActions";
import DynamicVariantService from "../../../../../services/MHDynamicVariantService";

const MasterHNAddProducts = () => {
  const [product, setProduct] = useState({
    name_en: "",
    name_ar: "",
    amount: "",
    description_en: "",
    description_ar: "",
    bestSeller: false,
    newIn: false,
    offer: false,
    offerPrice: "",
    price: "",
    category: "",
    code: "",
    variant: [],
    cost: "",
    dynamic_variant: [],
    images: [{ src: "" }, { src: "" }, { src: "" }, { src: "" }, { src: "" }],
  });
  const [errors, setErrors] = useState({
    desc_ar: false,
    desc_en: false,
    images: 0,
  });
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoadning] = useState(false);
  const [imagesForAll, setImagesForAll] = useState(false);
  const [productForAll, setProductForAll] = useState(true);
  const [hasVariant, setHasVariant] = useState(false);
  const [view, setView] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [staticVariantValue, setStaticVariantValue] = useState({});
  const [variant, setVariant] = useState([]);
  const [customVariant, setCustomVariant] = useState([]);
  const [dynamicVariant, setDynamicVariant] = useState([]);
  const [productDynamicVariant, setProductDynamicVariant] = useState([])
  const [files, setFiles] = useState([{}, {}, {}, {}, {}]);
  const navigate = useNavigate();
  const location = useLocation();
  const categoriesService = new CategoriesService();
  const productsService = new MHProductsService();
  const Auth = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.auth.lang);

  useEffect(() => {
    categoriesService.getList().then((res) => {
      if (res?.status === 200) {
        let categories = res.data?.data?.data?.map((item) => {
          return {
            id: item?.id,
            value: item?.id,
            label: lang === "en" ? item.name_en : item.name_ar,
          };
        });
        setCategoriesOptions(categories);
      }
    });
  }, [lang]);

  useEffect(() => {
    if (!!product?.category) {
      new VariantService().getVariant(product?.category?.id)?.then((res) => {
        if (res?.data?.status === 200) {
          if(res?.data?.data.data?.length > 0){
            setHasVariant(true)
            setImagesForAll(false)
            setProductForAll(false)
          } else {
            setHasVariant(false)
            setImagesForAll(true)
            setProductForAll(true)
          }
          let custom = res.data?.data.data?.reduce((result, item) => {
            result[item.name_en] = '';
            return result;
          }, {})
          if(!id) setCustomVariant([{...custom, quantity: '', images: [{}, {}, {}, {}, {}]}])
          setStaticVariantValue(custom)
          setVariant(res.data?.data.data);
        }
      });

      new DynamicVariantService()?.getDynamicVariant(product?.category?.value)
        .then((res) => {
          if (res?.status === 200) {
            let data = res.data?.data?.map((item) => {
              return {
                ...item,
                label: lang === "en" ? item.name_en : item.name_ar,
                value: item.id,
              };
            });
            setDynamicVariant(data);
          }
        });
    }
  }, [product?.category]);

  useEffect(() => {
    setView(location?.state?.view)

    let prod_id = window.location.pathname.split("/products/add-products/")[1];
    setId(Number(prod_id));

    if (!!prod_id) {
      let obj = {}
      let prod = productsService.getProduct(prod_id)
      let dynamic = productsService.getDynamicVariantOfProducts(prod_id)
      dispatch(loadingToggleAction(true));
      Promise.all([prod, dynamic]).then(res=>{
        let data = {}
        if (res[0]?.status === 200) {
          let response = res[0].data?.data;
          data = {
            ...response?.product,
            offerPrice: !!response.product.offerPrice
              ? Number(response.product.offerPrice)
              : "",
            category: {
              ...response?.product.category,
              id: response?.product.category_id,
              value: response.product?.category_id,
              label:
                lang === "en"
                  ? response.product?.category?.name_en
                  : response.product?.category?.name_ar,
            },
            images: product?.images?.map((_, index) => {
              if (!!response.product.product_images[index]?.url) {
                return {
                  src: response.product.product_images[index]?.url,
                };
              } else {
                return {
                  src: "",
                };
              }
            }),
            variant: response.product?.variant?.map((item) => {
              obj[`${item.variant?.name_en}`] = {
                id: item?.variant_value?.id,
                variant_id: item.variant?.id,
                label: item.variant_value?.value_en,
                value: item.variant_value?.value_en,
                value_ar: item.variant?.name_ar,
                value_en: item.variant?.name_en,
              }
              return {
                name_ar: item.variant?.name_ar,
                name_en: item.variant?.name_en,
                variant_id: item.variant?.id,
                variant_value_id: item?.variant_value?.id,
                variant_values: { ...item.variant_value },
              };
            }),
          };
        }
        if (res[1]?.status === 200) {
          data["dynamic_variant"] = res[1].data.data?.map((item) => {
            return {
              ...item,
              label: lang === "en" ? item.name_en : item.name_ar,
            };
          });
        }
        setProduct({ ...data });
        dispatch(loadingToggleAction(false));
        setCustomVariant([{ ...obj, quantity: res[0].data?.data?.product?.amount, price: res[0].data?.data?.product?.price }])
      })
    }
  }, []);

  const fileHandler = (e, index) => {
    let filesAll = e.target.files;
    const filesData = Object.values(filesAll);
    let update = files?.map((file, updateIndex) => {
      if (updateIndex === index) {
        return e.target.files[0];
      } else {
        return file;
      }
    });
    new BaseService().postUpload(filesData[0]).then((res) => {
      if (res?.data?.status) {
        let updateImages = product?.images.map((item, ind) => {
          if (ind === index) {
            return { src: res.data.url };
          } else {
            return { ...item };
          }
        });
        setProduct({ ...product, images: updateImages });
        setFiles([...update]);
      }
    });
    setTimeout(function () {
      setProduct({ ...product, images: update });
    }, 200);
  };

  const variantFileHandler = (e, imageIndex, customVariantIndex) => {
    let filesAll = e.target.files;
    const filesData = Object.values(filesAll);

    new BaseService().postUpload(filesData[0]).then((res) => {
      if (res?.data?.status) {
        let update = customVariant.map((item, ind) => {
          if (ind === customVariantIndex) {
            return {
              ...item,
              images: item?.images?.map((img, imgInd)=>{
              if(imgInd === imageIndex){
                return { src: res.data.url }
              } else {
                return img
              }
            })}
          } else {
            return { ...item };
          }
        });
        setCustomVariant(update);
      }
    });
  };

  const handlerText = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const submit = () => {
    if (!product.description_ar || !product.description_en) {
      setErrors({
        desc_ar: !product.desc_ar,
        desc_en: !product.desc_en,
      });
      return;
    }
    if (imagesForAll && product?.images?.filter((res) => !!res?.src)?.length === 0) {
      toast.error("Upload Images");
      return;
    }
    if (!id && !imagesForAll && customVariant?.map(obj =>
          obj.images.every(obj => Object.keys(obj).length === 0)
        )?.includes(true)) {
      toast.error("Upload Images in Cards");
      return;
    }
    // if (customVariant?.length > 0 && customVariant?.map(({ quantity, images, ...rest }) => ({ ...rest }))?.map(obj =>
    //   Object.values(obj)?.every(value => value === "")
    // )?.includes(true)) {
    //   toast.error("Selected at Least One Variant");
    //   return;
    // }
    setLoadning(true);
    let data = {
      name_en: product.name_en,
      name_ar: product.name_ar,
      code: product.code,
      cost: product?.cost,
      category_id: product.category?.value,
      images: product?.images
        ?.filter((res) => !!res?.src)
        ?.map((item) => item?.src),
      dynamic_variant: product?.dynamic_variant?.map((dy) => {
        return {
          dynamic_variant_id: dy?.id,
        };
      }),
      description_en: product.description_en,
      description_ar: product.description_ar,
      bestSeller: product.bestSeller,
      newIn: product.newIn,
      offer: product.offer,
    };
    if(productForAll) data['price'] = parseFloat(product.price)
    if(!!product.offerPrice) data['offerPrice'] = product.offerPrice
    if(!id) data['all_image']= imagesForAll
    if(!id) data['all_price']= productForAll
    if(!!id && !productForAll) data['price']= Number(customVariant[0]?.price)
    if(!id && hasVariant) data['variant_data'] = customVariant?.map(({ quantity, images, price }) => ({ quantity,images, price }))?.map((res) => {
      let info = {
        price: Number(res?.price) || 0,
        images: res?.images?.filter(img=> !!img.src)?.map(img=> img.src),
        amount: Number(res?.quantity),
      };
      return info
    })
    if(hasVariant){
      data['variant'] = !id ? customVariant.map(({ quantity, images, price, ...rest }) => ({ ...rest }))?.map(res=>{
        return Object.values(res).filter(item => !!item)?.map(data=>{
          return {
            variant_value_id: data?.id,
            variant_id: data?.variant_id,
          }
        })
      }) : customVariant.map(({ quantity, images, price, ...rest }) => ({ ...rest }))?.map(res=>{
        return Object.values(res).filter(item => !!item)?.map(data=>{
          return {
            variant_value_id: data?.id,
            variant_id: data?.variant_id,
          }
        })
      })[0]
    }
    if(!!id && hasVariant) data['amount'] = customVariant[0]?.quantity
    if(!hasVariant) data['amount']= product.amount

    if (!!id) {
      productsService.update(id, data)?.then((res) => {
        if (res.data?.status === 200) {
          toast.success("Product Updated Successfully");
          navigate(`/masterHN/products`)
        }
        setLoadning(false);
      });
    } else {
      productsService.create(data)?.then((res) => {
        if (res.data?.status === 201) {
          setConfirm(true);
          toast.success("Product Added Successfully");
        }
        setLoadning(false);
      });
    }
  };

  const deleteImg = (index) => {
    let updateFiles = files?.map((file, updateIndex) => {
      if (updateIndex === index) {
        return {};
      } else {
        return file;
      }
    });
    setFiles([...updateFiles]);
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

  if (Auth.showLoading) {
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
              label={`${Translate[lang]?.english_title}*`}
              type="text"
              placeholder={Translate[lang]?.english}
              bsSize="lg"
              name="name_en"
              disabled={view}
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                },
              }}
              value={product.name_en}
              onChange={(e) => handlerText(e)}
            />
          </Col>
          <Col md={6} className="mb-3">
            <AvField
              label={`${Translate[lang]?.arabic_title}*`}
              type="text"
              placeholder={Translate[lang]?.arabic}
              value={product.name_ar}
              name="name_ar"
              disabled={view}
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                }
              }}
              onChange={(e) => handlerText(e)}
            />
          </Col>
          <Col md={6} className="mb-3">
            <label className="text-label">
              {Translate[lang]?.english_description}*
            </label>
            <textarea
              name="description_en"
              disabled={view}
              style={{
                minHeight: "80px",
                maxHeight: "150px",
                height: "150px",
              }}
              className="form-control"
              required
              placeholder={Translate[lang]?.english}
              value={product.description_en}
              onChange={(e) => {
                setErrors({
                  ...errors,
                  desc_en: false,
                });
                handlerText(e);
              }}
              rows="6"
            ></textarea>
            {errors["desc_en"] && (
              <p className="text-danger m-0" style={{ fontSize: "12.8px" }}>
                {Translate[lang].field_required}
              </p>
            )}
          </Col>
          <Col md={6} className="mb-3">
            <label className="text-label">
              {Translate[lang]?.arabic_description}*
            </label>
            <textarea
              name="description_ar"
              disabled={view}
              style={{
                minHeight: "80px",
                maxHeight: "150px",
                height: "150px",
              }}
              className="form-control"
              placeholder={Translate[lang]?.arabic}
              value={product.description_ar}
              onChange={(e) => {
                setErrors({
                  ...errors,
                  desc_ar: false,
                });
                handlerText(e);
              }}
              rows="6"
            ></textarea>
            {errors["desc_ar"] && (
              <p className="text-danger m-0" style={{ fontSize: "12.8px" }}>
                {Translate[lang].field_required}
              </p>
            )}
          </Col>
          <Col md={6} sm={6} className="mb-3">
            <label className="text-label">{Translate[lang]?.category}*</label>
            <Select
              value={product.category}
              name="category"
              placeholder={Translate[lang]?.select}
              options={!view ? categoriesOptions : []}
              onChange={(e) =>
                setProduct({
                  ...product,
                  category: e,
                  dynamic_variant: [],
                  variant: [],
                })
              }
            />
          </Col>
          <Col md={6} sm={6} className="mb-3">
            <AvField
              label={Translate[lang]?.code}
              type="text"
              placeholder={Translate[lang]?.code}
              bsSize="lg"
              name="code"
              disabled={view}
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                }
              }}
              value={product.code}
              onChange={(e) => handlerText(e)}
            />
          </Col>
          {(!id && hasVariant)&& <Col md={6} sm={6} className="mb-3">
            <label className="d-block text-label mb-0 mt-4" style={{ marginLeft: "8px" }}>
              <input
                type='checkbox' 
                name='productForAll' 
                className={`${lang === 'ar' ? 'ml-2' : 'mr-2'}`} 
                onClick={(e) => setProductForAll(e.target.checked)} />
              {Translate[lang]?.price_for_all_products}

            </label>
          </Col>}
          {productForAll && <Col md={6} sm={6} className="mb-3">
            <AvField
              label={`${Translate[lang]?.price}*`}
              type="number"
              placeholder={Translate[lang]?.price}
              bsSize="lg"
              name="price"
              min="0.0000000000001"
              disabled={view}
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                },
              }}
              value={product.price}
              onChange={(e) => handlerText(e)}
            />
          </Col>}
          <Col md={6} sm={6} className="mb-3">
            <AvField
              label={`${Translate[lang]?.cost}*`}
              type="number"
              placeholder={Translate[lang]?.cost}
              bsSize="lg"
              disabled={view}
              name="cost"
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                },
              }}
              min="0.0000000000001"
              value={product.cost}
              onChange={(e) => handlerText(e)}
            />
          </Col>
          {!hasVariant && <Col md={6} sm={6} className="mb-3">
            <AvField
              label={`${Translate[lang]?.quantity}*`}
              type="number"
              placeholder={Translate[lang]?.quantity}
              bsSize="lg"
              disabled={view}
              name="amount"
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                },
              }}
              min="1"
              value={product.amount}
              onChange={(e) => handlerText(e)}
            />
          </Col>}
          <Col md={6} sm={6} className="mb-3">
            <AvField
              label={Translate[lang]?.offer_price}
              type="number"
              placeholder={Translate[lang]?.offer_price}
              min="0.0000000000001"
              bsSize="lg"
              disabled={view}
              name="offerPrice"
              value={product.offerPrice}
              onChange={(e) => handlerText(e)}
            />
          </Col>
          <Col md={2} sm={3} className="mb-3">
            <label className="text-label">{Translate[lang]?.best_seller}</label>
            <Form.Check
              type="switch"
              id={`bestSeller`}
              disabled={view}
              checked={product.bestSeller}
              onChange={(e) =>
                setProduct({ ...product, bestSeller: e.target.checked })
              }
            />
          </Col>
          <Col md={2} sm={3} className="mb-3">
            <label className="text-label">{Translate[lang]?.new_in}</label>
            <Form.Check
              type="switch"
              id={`newIn`}
              disabled={view}
              checked={product.newIn}
              onChange={(e) =>
                setProduct({ ...product, newIn: e.target.checked })
              }
            />
          </Col>
          <Col md={2} sm={3} className="mb-3">
            <label className="text-label">{Translate[lang]?.offer}</label>
            <Form.Check
              type="switch"
              id={`offer`}
              disabled={view}
              checked={product.offer}
              onChange={(e) =>
                setProduct({ ...product, offer: e.target.checked })
              }
            />
          </Col>
        </Row>

        {variant?.length > 0 && 
          customVariant?.map((cVariant, index)=>{
            return <Row className="mb-3 position-relative" key={index} style={{ boxShadow: 'rgb(222 222 222 / 89%) 0px 0px 5px', padding: '24px 0 12px 0' }}> 
            {variant.map(res => {
              if(res.name_en === "color"){
                return <>
                <Col md={3} className='mb-3'>
                  <label className="text-label">
                    {lang === "en" ? "Color" : "اللون"}
                  </label>
                  <Select
                    placeholder={Translate[lang]?.select}
                    options={!view ? res.variant_values?.map((res1) => {
                        return {
                          ...res1,
                          label: res1.value_en,
                          value: res1.value_en,
                        };
                    }) : []}
                    styles={{
                      option: (provided, state) => {
                        return {
                          ...provided,
                          "&": {
                            background: state.data?.value,
                            border: `1px solid ${state.data?.value}`,
                          },
                          "&:hover": {
                            border: "1px solid #fff",
                          },
                        };
                      },
                    }}
                    value={cVariant?.color}
                    onChange={(e) => {
                      let update = customVariant?.map((res1, ind) => {
                        if (ind === index) {
                          return {
                            ...res1,
                            color: {...e,variant_id: res.id},
                          };
                        } else {
                          return res1
                        }
                      });
                      setCustomVariant([...update]);
                    }}
                  />
                </Col>
                <Col md={1} className="d-flex align-items-center">
                  <span
                    className={`d-inline-block`}
                    style={{
                      background: cVariant?.color?.value,
                      width: "30px",
                      height: "30px",
                      border: "1px solid",
                      textAlign: "center",
                      marginTop: "16px",
                    }}
                  ></span>
                </Col>
                </>
              } else {
                return <Col md={4} className='mb-3'>
                  <label className="text-label">
                    {lang === "en" ? res.name_en : res.name_ar}
                  </label>
                  <Select
                    placeholder={Translate[lang]?.select}
                    options={!view ? res.variant_values?.map((res1) => {
                        return {
                          ...res1,
                          label: lang === "en" ? res1.value_en : res1.value_ar,
                          value: res1.value_en,
                        };
                    }) : []}
                    value={cVariant[res?.name_en]}
                    onChange={(e) => {
                      let update = customVariant?.map((res1, ind) => {
                        if (ind === index) {
                          return {
                            ...res1,
                            [res.name_en]: {...e,variant_id: res.id},
                          };
                        } else{
                          return res1
                        }
                      });
                      setCustomVariant([...update]);
                    }}
                  />
                </Col>
              }
            })}
          <Col md={4}>
                <AvField
                  label={Translate[lang]?.quantity}
                  type="number"
                  placeholder={Translate[lang]?.quantity}
                  min="0"
                  bsSize="lg"
                  disabled={view}
                  name={`quantity${index}`}
                  value={cVariant?.quantity}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: Translate[lang].field_required,
                    },
                  }}
                  onChange={(e) => {
                    let update = customVariant?.map((res, ind) => {
                      if (ind === index) {
                        return {
                          ...res,
                          quantity: e.target.value,
                        };
                      } else{
                        return res
                      }
                    });
                    setCustomVariant([...update]);
                  }}
                />
          </Col>
          {!productForAll && <Col md={4}>
                <AvField
                  label={Translate[lang]?.price}
                  type="number"
                  placeholder={Translate[lang]?.price}
                  min="0"
                  bsSize="lg"
                  disabled={view}
                  name={`price${index}`}
                  value={cVariant?.price}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: Translate[lang].field_required,
                    },
                  }}
                  onChange={(e) => {
                    let update = customVariant?.map((res, ind) => {
                      if (ind === index) {
                        return {
                          ...res,
                          price: e.target.value,
                        };
                      } else{
                        return res
                      }
                    });
                    setCustomVariant([...update]);
                  }}
                />
          </Col>}
          <Col md={12}>
          {(!id && !imagesForAll) && <>
            <label className="text-label mb-0 mt-4" style={{ marginLeft: "8px" }}>
              {Translate[lang]?.images}
            </label>
          <Row>
            {!id && cVariant?.images?.map((data, i) => {
            return (
              <Col md={2} sm={3} className="mb-3" key={i}>
                <div className="image-placeholder">
                  <div className="avatar-edit">
                    <input
                      type="file"
                      disabled={view}
                      onChange={(e) => variantFileHandler(e, i, index)}
                      id={`imageUpload${index}${i}`}
                    />
                    <label htmlFor={`imageUpload${index}${i}`} name=""></label>
                  </div>
                  <button
                    className="delete-img"
                    type="button"
                    disabled={view}
                    onClick={() => {
                      let update = customVariant.map((item, ind) => {
                        if (ind === index) {
                          return {
                            ...item,
                            images: item?.images?.map((img, imgInd)=>{
                            if(imgInd === i){
                              return { src: "" }
                            } else {
                              return img
                            }
                          })}
                        } else {
                          return { ...item };
                        }
                      });
                      setCustomVariant(update);
                    }}
                  >
                    <i className="la la-trash"></i>
                  </button>
                  <div className="avatar-preview4" style={{height: '9rem'}}>
                    {!!data.src ? (
                      <div id={`image${index}${i}`}>
                        <img
                          id={`saveImage${index}${i}`}
                          src={data?.src}
                          alt="icon"
                          className="w-100 h-100"
                        />
                      </div>
                    ) : (
                      <div id={`image${index}${index}`}>
                        {files[index]?.name && (
                          <img
                            id={`saveImage${index}${index}`}
                            src={URL.createObjectURL(files[index])}
                            alt="icon"
                          />
                        )}
                        {!files[index]?.name && (
                          <img
                            id={`saveImage${index}${index}`}
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
          </Row></>}
          </Col>
          {index > 0 && <button type="button" style={{
              background: 'none', border: 'none', color: 'var(--danger)', fontSize: '24px',
              position: 'absolute', top: '4px',
              left: lang==='ar' ? '12px' : 'auto',
              right: lang==='en' ? '12px' : 'auto',
              
            }}
            onClick={()=>{
              let update = customVariant.filter((_, ind)=> ind !== index)
              setCustomVariant(update)
            }}
          >
            <i className="la la-times-circle"></i>
          </button>}
        </Row>
          })
        }

        {/* Add New Value Button */}
        {(!id && variant?.length > 0 )&& (
          <button
            className="btn btn-outline-danger mb-4 "
            type="button"
            onClick={() =>
              setCustomVariant([
                ...customVariant,
                {
                  ...staticVariantValue,
                  quantity: "",
                  images: [{}, {}, {}, {}, {}]
                },
              ])
            }
          >
            {Translate[lang].add_new_value}
          </button>
        )}

        {/* Dynamic Variant */}
        {dynamicVariant?.length > 0 && (
          <Row>
            <Col md={12}>
              <label className="text-label mb-2 mt-2 d-block">
                {Translate[lang]?.dynamic_variant}
              </label>
              <Select
                options={dynamicVariant?.filter(
                  (res) =>
                    !product.dynamic_variant?.some(
                      (res2) => res.label === res2.label
                    )
                )}
                name="dynamic_variant"
                isMulti={true}
                placeholder={Translate[lang]?.select}
                value={product.dynamic_variant}
                onChange={(e) => {
                  setProduct({ ...product, dynamic_variant: e });
                }}
              />
            </Col>
            {/* {dynamicVariant?.length > 0 && dynamicVariant?.map((item, index)=>{
                    // let findInd = product?.dynamicVariant?.findIndex(res=> res.name_en === item.name_en)
                    return <Col md={6} className="mb-3">
                        <label for={item?.name_en} className='m-0 mr-3 w-100'>
                                <input 
                                type="checkbox" 
                                name={item.name_en} 
                                value={item?.name_en}
                                id={item?.name_en}
                                checked={productDynamicVariant?.some(res=> res.id === item?.id)}
                                className='mr-3'
                                required
                                onChange={(e)=> {
                                    if(productDynamicVariant?.length === 0){
                                        setProductDynamicVariant([item])
                                        return
                                    }
                                    let isExist = productDynamicVariant?.some(res=> res.id === item.id)
                                    if(isExist){
                                        let update = productDynamicVariant?.filter(res=> res.id !== item.id)
                                        setProductDynamicVariant([...update])
                                    } else {
                                        setProductDynamicVariant([...productDynamicVariant, item])
                                    }
                                }}
                            />
                                {item?.name_en} {`(${item?.available_amount})`}
                            </label>
                     </Col>
                })} */}
          </Row>
        )}

       {(!id && hasVariant) ? <label className="d-block text-label mb-0 mt-4" style={{ marginLeft: "8px" }}>
          <input
            type='checkbox' 
            name='images' 
            className={`${lang === 'ar' ? 'ml-2' : 'mr-2'}`} 
            onClick={(e) => setImagesForAll(e.target.checked)} />
          {Translate[lang]?.images_for_all_products}

        </label> : <label className="text-label mb-0 mt-4" style={{ marginLeft: "8px" }}>
          {Translate[lang]?.images}
        </label>}
        <Row>
          {product?.images?.map((data, index) => {
            return (
              <Col md={3} sm={6} className="mb-3" key={index}>
                <div className="image-placeholder">
                  <div className="avatar-edit">
                    <input
                      type="file"
                      disabled={view}
                      onChange={(e) => fileHandler(e, index)}
                      id={`imageUpload${index}`}
                    />
                    <label htmlFor={`imageUpload${index}`} name=""></label>
                  </div>
                  <button
                    className="delete-img"
                    type="button"
                    disabled={view}
                    onClick={() => deleteImg(index)}
                  >
                    <i className="la la-trash"></i>
                  </button>
                  <div className="avatar-preview">
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
                        {files[index]?.name && (
                          <img
                            id={`saveImageFile${index}`}
                            src={URL.createObjectURL(files[index])}
                            alt="icon"
                          />
                        )}
                        {!files[index]?.name && (
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
            onClick={() => navigate("/masterHN/products")}
          >
            {Translate[lang]?.cancel}
          </Button>
          {!view && <Button variant="primary" loading={loading} type="submit">
            {Translate[lang]?.submit}
          </Button>}
        </div>
      </AvForm>
    </Card>
  );
};

export default MasterHNAddProducts;