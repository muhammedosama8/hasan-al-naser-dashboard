import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { AvField, AvForm } from "availity-reactstrap-validation";
import uploadImg from "../../../../images/upload-img.png";
import "../style.scss";
import { toast } from "react-toastify";
import BaseService from "../../../../services/BaseService";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../common/Loader";
import { Translate } from "../../../Enums/Tranlate";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";

const AddProducts = () => {
  const [product, setProduct] = useState({
    name: "",
    type: '',
    description: EditorState.createEmpty(),
    images: [{ src: "" }],//, { src: "" }, { src: "" }, { src: "" }, { src: "" }
  });
  const [errors, setErrors] = useState({
    desc_ar: false,
    desc_en: false,
    images: 0,
  });
  const [id, setId] = useState(null);
  const [loading, setLoadning] = useState(false);
  const [imagesForAll, setImagesForAll] = useState(false);
  const [hasVariant, setHasVariant] = useState(false);
  const [customVariant, setCustomVariant] = useState([]);
  const [files, setFiles] = useState([{}]);//, {}, {}, {}, {}
  const navigate = useNavigate();
  const location = useLocation();
  const Auth = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.auth.lang);

  // useEffect(() => {
  //   categoriesService.getList().then((res) => {
  //     if (res?.data?.status === 200) {
  //       let categories = res.data?.meta?.data?.map((item) => {
  //         return {
  //           id: item?.id,
  //           value: item?.id,
  //           label: lang === "en" ? item.name_en : item.name_ar,
  //         };
  //       });
  //       setCategoriesOptions(categories);
  //     }
  //   });
  //   brandsService.getList().then((res) => {
  //     if (res?.data?.status === 200) {
  //       let categories = res.data?.meta?.data?.map((item) => {
  //         return {
  //           id: item?.id,
  //           value: item?.id,
  //           label: lang === "en" ? item.name_en : item.name_ar,
  //         };
  //       });
  //       setBrandOptions(categories);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if (!!product?.category) {
  //     adminService.getVariant(product?.category?.id)?.then((res) => {
  //       if (res?.data?.status === 200) {
  //         if(res?.data?.meta.data?.length > 0){
  //           setHasVariant(true)
  //           setImagesForAll(false)
  //         } else {
  //           setHasVariant(false)
  //           setImagesForAll(true)
  //         }
  //         let custom = res.data?.meta.data?.reduce((result, item) => {
  //           result[item.name_en] = '';
  //           return result;
  //         }, {})
  //         if(!id) setCustomVariant([{...custom, quantity: '', images: [{}, {}, {}, {}, {}]}])
  //         setStaticVariantValue(custom)
  //         setVariant(res.data?.meta.data);
  //       }
  //     });

  //     subCategoriesService
  //       .getListForCategory(product?.category?.id)
  //       .then((res) => {
  //         if (res?.data?.status === 200) {
  //           let subCategories = res.data?.meta?.data?.map((item) => {
  //             return {
  //               id: item?.id,
  //               value: item?.id,
  //               label: lang === "en" ? item.name_en : item.name_ar,
  //             };
  //           });
  //           setSubCategoriesOptions(subCategories);
  //         }
  //       });

  //     productsService
  //       ?.getDynamicVariant(product?.category?.value)
  //       .then((res) => {
  //         if (res?.status === 200) {
  //           let data = res.data?.data?.map((item) => {
  //             return {
  //               ...item,
  //               label: lang === "en" ? item.name_en : item.name_ar,
  //               value: item.id,
  //             };
  //           });
  //           setDynamicVariant(data);
  //         }
  //       });
  //   }
  // }, [product?.category]);

  // useEffect(() => {
  //   let prod_id = window.location.pathname.split("/products/add-products/")[1];
  //   setId(Number(prod_id));

  //   if (!!prod_id) {
  //     let obj = {}
  //     dispatch(loadingToggleAction(true));
  //     productsService.getProduct(prod_id)?.then((res) => {
  //       let response = res.data?.data;
  //       if (res?.data?.status === 200) {
  //         let data = {
  //           ...response?.product,
  //           weight: response?.product.weight || '',
  //           offerPrice: !!Number(response.product.offerPrice)
  //             ? response.product.offerPrice
  //             : "",
  //           category: {
  //             ...response?.product.category,
  //             id: response?.product.category_id,
  //             value: response.product?.category_id,
  //             label:
  //               lang === "en"
  //                 ? response.product?.category?.name_en
  //                 : response.product?.category?.name_ar,
  //           },
  //           brand: response.product.brand?.name_en
  //             ? {
  //                 ...response.product.brand,
  //                 label:
  //                   lang === "en"
  //                     ? response.product.brand?.name_en
  //                     : response.product.brand?.name_ar,
  //                 value: response.product.brand_id,
  //               }
  //             : "",
  //           images: product?.images?.map((_, index) => {
  //             if (!!response.product.images[index]?.url) {
  //               return {
  //                 src: response.product.images[index]?.url,
  //               };
  //             } else {
  //               return {
  //                 src: "",
  //               };
  //             }
  //           }),
  //           sub_category: response.product?.sub_category?.name_en
  //             ? {
  //                 ...response.product?.sub_category,
  //                 label:
  //                   lang === "en"
  //                     ? response.product?.sub_category?.name_en
  //                     : response.product?.sub_category?.name_ar,
  //                 value: response.product?.sub_category_id,
  //                 id: response.product?.sub_category_id,
  //               }
  //             : "",
  //           variant: response.product?.variant?.map((item) => {
  //             obj[`${item.variant?.name_en}`] = {
  //               // ...obj,
  //               id: item?.variant_value?.id,
  //               variant_id: item.variant?.id,
  //               label: item.variant_value?.value_en,
  //               value: item.variant_value?.value_en,
  //               value_ar: item.variant?.name_ar,
  //               value_en: item.variant?.name_en,
  //             }
  //             return {
  //               name_ar: item.variant?.name_ar,
  //               name_en: item.variant?.name_en,
  //               variant_id: item.variant?.id,
  //               variant_value_id: item?.variant_value?.id,
  //               variant_values: { ...item.variant_value },
  //             };
  //           }),
  //         };
  //         productsService.getDynamicVariantOfProducts(prod_id).then((res2) => {
  //           if (res2?.status === 200) {
  //             data["dynamic_variant"] = res2.data.data?.map((item) => {
  //               return {
  //                 ...item,
  //                 label: lang === "en" ? item.name_en : item.name_ar,
  //               };
  //             });
  //             setProduct({ ...data });
  //             dispatch(loadingToggleAction(false));
  //           }
  //         });
  //         setCustomVariant([{
  //           ...obj,
  //           quantity: response?.product?.amount,
  //         }])
  //       }
  //     });
  //   }
  // }, []);

  const fileHandler = (e, index, ) => {
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
      price: parseFloat(product.price),
      code: product.code,
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
      type: "normal",
      offerPrice: parseFloat(product.offerPrice),
      cost: product?.cost,
    };
    if (!!product.sub_category)
      data["sub_category_id"] = product?.sub_category?.value;
    if (!!product.brand) data["brand_id"] = product?.brand?.value;
    if (!!product.weight) data["weight"] = product?.weight;
    if(!id) data['all_image']= imagesForAll
    if(!id && hasVariant) data['variant_data'] = customVariant?.map(({ quantity, images }) => ({ quantity,images }))?.map((res) => {
      return {
        images: res?.images?.filter(img=> !!img.src)?.map(img=> img.src),
        amount: Number(res?.quantity),
      };
    })
    if(hasVariant){
      data['variant'] = !id ? customVariant.map(({ quantity, images, ...rest }) => ({ ...rest }))?.map(res=>{
        return Object.values(res).filter(item => !!item)?.map(data=>{
          return {
            variant_value_id: data?.id,
                variant_id: data?.variant_id,
          }
        })
      }) : customVariant.map(({ quantity, images, ...rest }) => ({ ...rest }))?.map(res=>{
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

    // if (!!id) {
    //   productsService.update(id, data)?.then((res) => {
    //     if (res.data?.status === 200) {
    //       toast.success("Product Updated Successfully");
    //       navigate(`/products/${product?.id}`, {state: product?.code})
    //       // setConfirm(true);
    //       // setProduct({
    //       //   ...product,
    //       //   images: [
    //       //     { src: "" },
    //       //     { src: "" },
    //       //     { src: "" },
    //       //     { src: "" },
    //       //     { src: "" },
    //       //   ],
    //       // });
    //     }
    //     setLoadning(false);
    //   });
    // } else {
    //   productsService.create(data)?.then((res) => {
    //     if (res.data?.status === 201) {
    //       setConfirm(true);
    //       toast.success("Product Added Successfully");
    //     }
    //     setLoadning(false);
    //   });
    // }
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
              label={`${Translate[lang]?.title}`}
              type="text"
              placeholder={Translate[lang]?.english}
              bsSize="lg"
              name="name"
              validate={{
                required: {
                  value: true,
                  errorMessage: Translate[lang].field_required,
                }
              }}
              value={product.name}
              onChange={(e) => handlerText(e)}
            />
          </Col>
          <Col md={6} className="mb-3">
            <label>{Translate[lang].type}</label>
            <Select
              options={[
                {label: 'Preumium Products', value: 'preumium_products'},
                {label: 'High Pressure', value: 'high_pressure'},
              ]}
              name="name"
              value={product.type}
              onChange={(e) => setProduct({...product, type: e})}
            />
          </Col>
          <Col md={12} className="mb-3">
            <label className="text-label">
              {Translate[lang]?.description}*
            </label>
            <Editor
              editorState ={product?.description}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={(e) => {
                setProduct({...product, description: e})
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
          {Translate[lang].image}
        </Col>
          {product?.images?.map((data, index) => {
            return (
              <Col md={3} sm={6} className="mb-3" key={index}>
                <div className="image-placeholder" style={{maxWidth: '100%'}}>
                  <div className="avatar-edit">
                    <input
                      type="file"
                      onChange={(e) => fileHandler(e, index)}
                      id={`imageUpload${index}`}
                    />
                    <label htmlFor={`imageUpload${index}`} name=""></label>
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
