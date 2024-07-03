import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { AvField, AvForm } from "availity-reactstrap-validation";
// import CountryiesService from "../../../../services/CountriesService";
import { useNavigate } from "react-router-dom";
// import CategoriesService from "../../../../services/CategoriesService";
// import ProductsService from "../../../../services/ProductsService";
// import SubCategoriesService from "../../../../services/SubCategoriesService";
// import PromoCodeService from "../../../../services/PromoCodeService";
// import UserService from "../../../../services/UserService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Translate } from "../../../../Enums/Tranlate";
// import AreasService from "../../../../services/AreasServices";
// import OrdersService from "../../../../services/OrdersService";
import { types } from "../../../../Enums/Orders";

const initial = {
  email: "",
  f_name: "",
  l_name: "",
  country_code: "",
  phone: "",
  address: {
    addressName: "",
    block: "",
    street: "",
    country_id: 0,
    area_id: 0,
    type: "",
    avenue: "",
    buildingNumber: "",
    floorNumber: "",
    officeNumber: "",
    houseNumber: "",
    aptNumber: "",
    otherInstructions: "",
  },
};
const AddOrders = () => {
  const lang = useSelector((state) => state.auth.lang);
  const [steps, setSteps] = useState(1);
  const [type, setType] = useState("exist");
  const [locationTypesOptions, setLocationTypesOptions] = useState();
  const [search, setSearch] = useState("");
  const [calc, setCalc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [areasOptions, setAreasOptions] = useState([]);
  const [formData, setFormData] = useState([
    {
      category: "",
      sub_category: "",
      subCategoryOptions: [],
      product: "",
      productsOptions: [],
      quantity: "",
      dynamicVariantOptions: [],
      variant: [],
      dynamicVariant: [],
      amount: "",
      totalPrice: 0,
    },
  ]);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeData, setPromoCodeData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [user, setUser] = useState(initial);
  const navigate = useNavigate();
  const [countriesOptions, setCountriesOptions] = useState([]);
  // const countryiesService = new CountryiesService();
  // const areasService = new AreasService();
  // const categoriesService = new CategoriesService();
  // const promoCodeService = new PromoCodeService();
  // const userService = new UserService();

  useEffect(() => {
    if (type === "new") {
      // countryiesService.getList().then((res) => {
      //   if (res?.status === 200) {
      //     let data = res.data.data?.map((item) => {
      //       return {
      //         label:
      //           lang === "en"
      //             ? `${item.name_en} (${item?.country_code || ""})`
      //             : `${item.name_ar} (${item?.country_code || ""})`,
      //         name_en: item.name_en,
      //         country_code: item?.country_code,
      //         type: item.type,
      //         value: item.id,
      //         id: item.id,
      //       };
      //     });
      //     setCountriesOptions(data);
      //   }
      // });
    }

    if (steps === 1) {
      let data = types.map((res) => {
        return {
          ...res,
          label: lang === "en" ? res.label : res.ar,
        };
      });
      setLocationTypesOptions([...data]);
    }
    if (steps === 2) {
      // categoriesService.getList().then((res) => {
      //   if (res.data?.status === 200) {
      //     let categories = res.data?.meta?.data?.map((item) => {
      //       return {
      //         id: item?.id,
      //         value: item?.id,
      //         label: lang === "en" ? item.name_en : item.name_ar,
      //       };
      //     });
      //     setCategoriesOptions(categories);
      //   }
      // });
    }
  }, [lang, type, steps]);

  useEffect(() => {
    if (steps === 1) setUser(initial);
  }, [lang]);

  useEffect(() => {
    if (!!user.country_code) {
      // areasService.getList(user.country_code.id).then((res) => {
      //   let data = res?.data?.data?.map((are) => {
      //     return {
      //       ...are,
      //       label: lang === "en" ? are.name_en : are.name_ar,
      //       value: are.id,
      //       id: are.id,
      //     };
      //   });
      //   setAreasOptions([...data]);
      // });
    }
  }, [user.country_code]);

  useEffect(() => {
    let calcTotal = formData.map((res, ind) => {
      if (!!res.product && res.amount > 0) {
        let total =
          (res.product.offer
            ? Number(res.product.offerPrice)
            : Number(res.product.price)) *
            res.amount +
          res.dynamicVariant
            ?.map((vari) => vari.amount * vari.price)
            ?.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            );
        return {
          ...res,
          totalPrice: total,
        };
      } else {
        return res;
      }
    });
    setFormData(calcTotal);
  }, [calc]);

  // const getAllProductOptions = (index, category) => {
  //   let params = category.value;

  //   const subCategoriesReq = new SubCategoriesService().getListForCategory(
  //     params
  //   );
  //   const dynamicVariantsReq = new ProductsService().getDynamicVariant(params);
  //   const productsReq = new ProductsService().getAllProducts({
  //     category_id: params,
  //   });

  //   Promise.all([subCategoriesReq, dynamicVariantsReq, productsReq]).then(
  //     (response) => {
  //       let sub_categories = [];
  //       let dynamicVar = [];
  //       let products = [];
  //       if (response[0]?.status === 200) {
  //         let subCategories = response[0].data?.meta?.data?.map((item) => {
  //           return {
  //             id: item?.id,
  //             value: item?.id,
  //             label: lang === "en" ? item.name_en : item.name_ar,
  //           };
  //         });
  //         sub_categories.push(...subCategories);
  //       }
  //       if (response[1]?.status === 200) {
  //         let data = response[1].data?.data
  //           ?.filter((item) => item.available_amount > 0)
  //           ?.map((item) => {
  //             return {
  //               ...item,
  //               label: lang === "en" ? item.name_en : item.name_ar,
  //               value: item.id,
  //             };
  //           });
  //         dynamicVar.push(...data);
  //       }
  //       if (response[2]?.status === 200) {
  //         let data = response[2].data?.meta?.data
  //           ?.filter((res) => !res.isDeleted)
  //           ?.map((res) => {
  //             return {
  //               ...res,
  //               label: lang === "en" ? res.name_en : res.name_ar,
  //               value: res.id,
  //             };
  //           });
  //         products.push(...data);
  //       }

  //       let update = formData?.map((res, ind) => {
  //         if (index === ind) {
  //           return {
  //             ...res,
  //             category: category,
  //             subCategoryOptions: sub_categories,
  //             productsOptions: products,
  //             sub_category: "",
  //             product: "",
  //             dynamicVariantOptions: dynamicVar,
  //             dynamicVariant:
  //               dynamicVar?.length > 0
  //                 ? dynamicVar.map((dy) => {
  //                     return {
  //                       amount: 0,
  //                       dynamic_variant_id: dy.id,
  //                       has_amount: dy.has_amount,
  //                       price: dy.price,
  //                     };
  //                   })
  //                 : [],
  //           };
  //         } else {
  //           return res;
  //         }
  //       });
  //       setFormData(update);
  //     }
  //   );
  // };

  // const getAllProductOptionsBySub = (index, category, sub_category) => {
  //   new ProductsService()
  //     .getAllProducts({
  //       category_id: category.value,
  //       sub_category_id: sub_category.value,
  //     })
  //     .then((res) => {
  //       if (res?.status === 200) {
  //         let update = formData.map((item, ind) => {
  //           if (ind === index) {
  //             return {
  //               ...item,
  //               sub_category: sub_category,
  //               productsOptions: [
  //                 ...res.data.meta?.data
  //                   ?.filter((res2) => !res2.isDeleted)
  //                   ?.map((res3) => {
  //                     return {
  //                       ...res3,
  //                       label: lang === "en" ? res3.name_en : res3.name_ar,
  //                       value: res3.id,
  //                     };
  //                   }),
  //               ],
  //             };
  //           } else {
  //             return item;
  //           }
  //         });
  //         setFormData(update);
  //       }
  //     });
  // };

  const firstNext = () => {
    if (type === "exist") {
      setSteps(2);
      return;
    }
    if (!user.address.type) {
      toast.error("Select Type First");
      return;
    }
    if (!user.country_code) {
      toast.error("Select Country First");
      return;
    }
    let data = {
      ...user,
      country_code: user.country_code.country_code,
      address: {
        addressName: user.address.addressName,
        block: user.address.block,
        street: user.address.street,
        avenue: user.address.avenue,
        area_id: user.address.area_id.id,
        type: user.address.type.value,
        country_id: user.country_code.id,
      },
    };
    if (user.address.type.value === "house")
      data.address["houseNumber"] = user.address.houseNumber;
    if (user.address.type.value === "office")
      data.address["officeNumber"] = user.address.officeNumber;
    if (user.address.type.value === "building") {
      data.address["buildingNumber"] = user.address.buildingNumber;
      data.address["floorNumber"] = user.address.floorNumber;
      data.address["aptNumber"] = user.address.aptNumber;
    }
    if (!!user.address.otherInstructions)
      data.address["otherInstructions"] = user.address.otherInstructions;

    setLoading(true);
    // userService.create(data).then((res) => {
    //   if (res && res?.status === 201) {
    //     let search = !!data.email ? data.email : data.phone;
    //     searchHandler(search);
    //   }
    //   setLoading(false);
    // });
  };

  const secondNext = () => {
    if (!paymentMethod) return toast.error("Select Payment First");
    setLoading(true);
    let data = {
      payment_method: paymentMethod?.value,
      user_id: selectedUser.id,
      products: formData.map((data) => {
        return {
          dynamic_variant: data.dynamicVariant
            ?.filter((fi) => !!fi.amount)
            .map((dy) => {
              return {
                amount: dy.amount,
                dynamic_variant_id: dy.dynamic_variant_id,
              };
            }),
          amount: data.amount,
          product_id: data.product.id,
        };
      }),
    };
    if (!!promoCodeData) data["promoCode"] = promoCodeData;

    // if (paymentMethod?.value === "cash") {
    //   new OrdersService().create(data).then((res) => {
    //     if (res && res?.status === 201) {
    //       toast.success("Order Added Successfully.");
    //       navigate("/orders");
    //     } else {
    //       setLoading(false);
    //     }
    //   });
    // } else {
    //   new OrdersService().create(data).then((res) => {
    //     if (res && res?.status === 201) {
    //       window.location.href = res.data.data;
    //     } else {
    //       setLoading(false);
    //     }
    //   });
    // }
  };

  const searchHandler = (searchText) => {
    let params = {};
    if (searchText.includes(".com")) {
      params["email"] = searchText;
    } else {
      params["phone"] = searchText;
    }

    // userService.searchUser(params).then((res) => {
    //   if (res.data.data?.length > 0) {
    //     let data = res.data.data[0];
    //     setSelectedUser({
    //       ...data,
    //       phone: data.user_phones?.filter((phone) => phone.is_default)[0].phone,
    //       type: search,
    //     });

    //     if (type === "new") setSteps(2);
    //   } else {
    //     toast.error("User Not Found");
    //     setSelectedUser({});
    //   }
    // });
  };

  const getPromoCode = () => {
    let data = {
      promoCode: promoCode,
    };
    if (!promoCode) {
      setPromoCodeData(null);
      return;
    }
    // promoCodeService.getPromoCode(data).then((res) => {
    //   if (res?.data?.data) {
    //     setPromoCodeData({
    //       type: res.data.data.coupon_type,
    //       value: res.data.data.coupon_value,
    //     });
    //   } else {
    //     setPromoCodeData(null);
    //   }
    // });
  };

  return (
    <>
      {steps === 1 && (
        <Card>
          <Card.Body>
            <div className="d-flex" style={{ justifyContent: "space-evenly" }}>
              <Card
                className="m-0"
                onClick={() => setType("exist")}
                style={{
                  backgroundColor:
                    type === "exist" ? "var(--primary)" : "var(--light)",
                  cursor: "pointer",
                }}
              >
                <Card.Body className="text-center">
                  <h3
                    className="m-0"
                    style={{ color: type === "exist" ? "#fff" : "#3d4465" }}
                  >
                    {Translate[lang].exist_user}
                  </h3>
                  <i
                    className="la la-user"
                    style={{
                      fontSize: "3rem",
                      color: type === "exist" ? "#fff" : "#3d4465",
                    }}
                  ></i>
                </Card.Body>
              </Card>
              <Card
                className="m-0"
                onClick={() => setType("new")}
                style={{
                  backgroundColor:
                    type === "new" ? "var(--primary)" : "var(--light)",
                  cursor: "pointer",
                }}
              >
                <Card.Body className="text-center">
                  <h3
                    className="m-0"
                    style={{ color: type === "new" ? "#fff" : "#3d4465" }}
                  >
                    {Translate[lang].new_user}
                  </h3>
                  <i
                    className="la la-user-plus"
                    style={{
                      fontSize: "3rem",
                      color: type === "new" ? "#fff" : "#3d4465",
                    }}
                  ></i>
                </Card.Body>
              </Card>
            </div>

            {type === "exist" && (
              <div style={{ marginTop: "5rem" }}>
                <AvForm onValidSubmit={firstNext}>
                  <Row>
                    <Col md={10}>
                      <AvField
                        label={Translate[lang].search}
                        placeholder={`${Translate[lang].search_by} ${Translate[lang].email}, ${Translate[lang].phone}`}
                        type="text"
                        value={search}
                        name="search"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </Col>
                    <Col
                      md={2}
                      style={{ marginTop: "auto", marginBottom: "16px" }}
                    >
                      <Button
                        variant="primary"
                        type="button"
                        onClick={() => searchHandler(search)}
                        disabled={!search}
                      >
                        {Translate[lang].search}
                      </Button>
                    </Col>
                    {!!Object.keys(selectedUser).length && (
                      <Col md={6}>
                        <Card
                          style={{
                            backgroundColor:
                              type === "new"
                                ? "var(--primary)"
                                : "var(--light)",
                            cursor: "pointer",
                          }}
                        >
                          <label
                            className="m-0 d-flex p-4"
                            style={{ gap: "16px" }}
                          >
                            <input type="radio" checked={true} />
                            <div>
                              <i
                                className="la la-user mx-2"
                                style={{ fontSize: "1.3rem" }}
                              ></i>
                              <span>{selectedUser.type}</span>
                            </div>
                          </label>
                        </Card>
                      </Col>
                    )}
                  </Row>
                  <Row className="mt-3 justify-content-between p-3">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => navigate("/orders")}
                    >
                      {Translate[lang].cancel}
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!Object.keys(selectedUser).length}
                    >
                      {Translate[lang].next}
                    </Button>
                  </Row>
                </AvForm>
              </div>
            )}
            {type === "new" && (
              <div style={{ marginTop: "5rem" }}>
                <AvForm onValidSubmit={firstNext}>
                  <Row>
                    <Col md={6}>
                      <AvField
                        label={Translate[lang].first_name}
                        placeholder={Translate[lang].first_name}
                        type="text"
                        value={user.f_name}
                        name="f_name"
                        errorMessage="Please enter a valid Name"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: Translate[lang].field_required,
                          },
                        }}
                        onChange={(e) => {
                          setUser({ ...user, f_name: e.target.value });
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <AvField
                        type="text"
                        label={Translate[lang].last_name}
                        placeholder={Translate[lang].last_name}
                        value={user.l_name}
                        name="l_name"
                        errorMessage="Please enter a valid Name"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: Translate[lang].field_required,
                          },
                        }}
                        onChange={(e) => {
                          setUser({ ...user, l_name: e.target.value });
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <AvField
                        type="email"
                        label={Translate[lang].email}
                        placeholder={Translate[lang].email}
                        value={user.email}
                        name="email"
                        errorMessage="Please enter a valid Email"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: Translate[lang].field_required,
                          },
                        }}
                        onChange={(e) => {
                          setUser({ ...user, email: e.target.value });
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <label className="text-label">
                        {Translate[lang].country_code}
                      </label>
                      <Select
                        value={user?.country_code}
                        name="country_code"
                        placeholder={Translate[lang].select}
                        options={countriesOptions}
                        onChange={(e) => setUser({ ...user, country_code: e })}
                      />
                    </Col>
                    <Col md={3}>
                      <AvField
                        type="number"
                        label={Translate[lang].phone}
                        placeholder={Translate[lang].phone}
                        value={user.phone}
                        name="phone"
                        errorMessage="Please enter a valid Phone"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: Translate[lang].field_required,
                          },
                        }}
                        onChange={(e) => {
                          setUser({ ...user, phone: e.target.value });
                        }}
                      />
                    </Col>
                    <Col md={12}>
                      <AvField
                        type="text"
                        label={Translate[lang].address_name}
                        placeholder={Translate[lang].address_name}
                        value={user.address.addressName}
                        name="address"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: Translate[lang].field_required,
                          },
                        }}
                        onChange={(e) => {
                          setUser({
                            ...user,
                            address: {
                              ...user.address,
                              addressName: e.target.value,
                            },
                          });
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <AvField
                        type="text"
                        label={Translate[lang].block}
                        placeholder={Translate[lang].block}
                        value={user.address.block}
                        name="block"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: Translate[lang].field_required,
                          },
                        }}
                        onChange={(e) => {
                          setUser({
                            ...user,
                            address: { ...user.address, block: e.target.value },
                          });
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <AvField
                        type="text"
                        label={Translate[lang].street}
                        placeholder={Translate[lang].street}
                        value={user.address.street}
                        name="street"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: Translate[lang].field_required,
                          },
                        }}
                        onChange={(e) => {
                          setUser({
                            ...user,
                            address: {
                              ...user.address,
                              street: e.target.value,
                            },
                          });
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <label className="text-label">
                        {Translate[lang].area}
                      </label>
                      <Select
                        value={user.address?.area_id}
                        name="area"
                        placeholder={Translate[lang].select}
                        options={areasOptions}
                        noOptionsMessage={() =>
                          `${Translate[lang].select} ${Translate[lang].area} ${Translate[lang].first}`
                        }
                        onChange={(e) =>
                          setUser({
                            ...user,
                            address: { ...user.address, area_id: e },
                          })
                        }
                      />
                    </Col>
                    <Col md={3}>
                      <AvField
                        type="text"
                        label={Translate[lang].avenue}
                        placeholder={Translate[lang].avenue}
                        value={user.address.avenue}
                        name="avenue"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: Translate[lang].field_required,
                          },
                        }}
                        onChange={(e) => {
                          setUser({
                            ...user,
                            address: {
                              ...user.address,
                              avenue: e.target.value,
                            },
                          });
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <label className="text-label">
                        {Translate[lang].type}
                      </label>
                      <Select
                        value={user.address?.type}
                        name="type"
                        placeholder={Translate[lang].select}
                        options={locationTypesOptions}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            address: { ...user.address, type: e },
                          })
                        }
                      />
                    </Col>
                    {user.address.type?.value === "building" && (
                      <Col md={3}>
                        <AvField
                          type="text"
                          label={Translate[lang].building_number}
                          placeholder={Translate[lang].building_number}
                          value={user.address.buildingNumber}
                          name="buildingNumber"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: Translate[lang].field_required,
                            },
                          }}
                          onChange={(e) => {
                            setUser({
                              ...user,
                              address: {
                                ...user.address,
                                buildingNumber: e.target.value,
                              },
                            });
                          }}
                        />
                      </Col>
                    )}
                    {user.address.type?.value === "building" && (
                      <Col md={3}>
                        <AvField
                          type="text"
                          label={Translate[lang].floor_number}
                          placeholder={Translate[lang].floor_number}
                          value={user.address.floorNumber}
                          name="floorNumber"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: Translate[lang].field_required,
                            },
                          }}
                          onChange={(e) => {
                            setUser({
                              ...user,
                              address: {
                                ...user.address,
                                floorNumber: e.target.value,
                              },
                            });
                          }}
                        />
                      </Col>
                    )}
                    {user.address.type?.value === "building" && (
                      <Col md={3}>
                        <AvField
                          type="text"
                          label={Translate[lang].apt_number}
                          placeholder={Translate[lang].apt_number}
                          value={user.address.aptNumber}
                          name="aptNumber"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: Translate[lang].field_required,
                            },
                          }}
                          onChange={(e) => {
                            setUser({
                              ...user,
                              address: {
                                ...user.address,
                                aptNumber: e.target.value,
                              },
                            });
                          }}
                        />
                      </Col>
                    )}
                    {user.address.type?.value === "office" && (
                      <Col md={3}>
                        <AvField
                          type="text"
                          label={Translate[lang].office_number}
                          placeholder={Translate[lang].office_number}
                          value={user.address.officeNumber}
                          name="officeNumber"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: Translate[lang].field_required,
                            },
                          }}
                          onChange={(e) => {
                            setUser({
                              ...user,
                              address: {
                                ...user.address,
                                officeNumber: e.target.value,
                              },
                            });
                          }}
                        />
                      </Col>
                    )}
                    {user.address.type?.value === "house" && (
                      <Col md={3}>
                        <AvField
                          type="text"
                          label={Translate[lang].house_number}
                          placeholder={Translate[lang].house_number}
                          value={user.address.houseNumber}
                          name="houseNumber"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: Translate[lang].field_required,
                            },
                          }}
                          onChange={(e) => {
                            setUser({
                              ...user,
                              address: {
                                ...user.address,
                                houseNumber: e.target.value,
                              },
                            });
                          }}
                        />
                      </Col>
                    )}
                    <Col md={12}>
                      <AvField
                        type="text"
                        label={Translate[lang].other_instructions}
                        placeholder={Translate[lang].other_instructions}
                        value={user.address.otherInstructions}
                        name="otherInstructions"
                        onChange={(e) => {
                          setUser({
                            ...user,
                            address: {
                              ...user.address,
                              otherInstructions: e.target.value,
                            },
                          });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3 justify-content-between p-3">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => navigate("/orders")}
                    >
                      {Translate[lang].cancel}
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                      {Translate[lang].next}
                    </Button>
                  </Row>
                </AvForm>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {steps === 2 && (
        <Card>
          <Card.Body>
            <AvForm onValidSubmit={secondNext}>
              {formData?.map((data, index) => {
                return (
                  <Row
                    key={index}
                    style={{
                      border: "1px solid var(--light)",
                      padding: "18px 5px",
                    }}
                    className={`${
                      index > 0 ? "mt-4 py-4 position-relative" : ""
                    }`}
                  >
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          let update = formData?.filter(
                            (_, ind) => ind !== index
                          );
                          setFormData(update);
                        }}
                        style={{
                          position: "absolute",
                          right: lang === "en" ? "21px" : "auto",
                          left: lang === "ar" ? "21px" : "auto",
                          zIndex: "2",
                          top: "12px",
                          background: "var(--danger)",
                          border: "0",
                          borderRadius: "50%",
                          padding: " 2px 6px",
                        }}
                      >
                        <i
                          className="la la-times"
                          style={{ color: "#fff" }}
                        ></i>
                      </button>
                    )}
                    <Col md={6} className="mb-3">
                      <label className="text-label">
                        {Translate[lang].category}
                      </label>
                      <Select
                        value={data.category}
                        name="category"
                        placeholder={Translate[lang].select}
                        options={categoriesOptions}
                        onChange={(e) => {
                          // getAllProductOptions(index, e);
                        }}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <label className="text-label">
                        {Translate[lang].sub_category}
                      </label>
                      <Select
                        value={data.sub_category}
                        name="sub_category"
                        placeholder={Translate[lang].select}
                        options={[...data.subCategoryOptions]}
                        noOptionsMessage={() =>
                          !!data.category
                            ? "No Select"
                            : "Select Category First"
                        }
                        onChange={(e) => {
                          // getAllProductOptionsBySub(index, data.category, e);
                        }}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <label className="text-label">
                        {Translate[lang].product}
                      </label>
                      <Select
                        value={data.product}
                        name="product"
                        options={data.productsOptions}
                        placeholder={Translate[lang].select}
                        noOptionsMessage={() =>
                          !!data.category
                            ? "No Select"
                            : "Select Category First"
                        }
                        onChange={(e) => {
                          let update = formData.map((res, ind) => {
                            if (ind === index) {
                              return {
                                ...res,
                                product: e,
                                amount: 1,
                              };
                            } else {
                              return res;
                            }
                          });
                          setFormData(update);
                          setCalc((prev) => !prev);
                        }}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <AvField
                        label={Translate[lang].quantity}
                        type="number"
                        name="amount"
                        placeholder={Translate[lang].quantity}
                        value={data.amount}
                        min={0}
                        max={data.product?.amount}
                        onChange={(e) => {
                          if (!e.target.value) {
                            return;
                          }
                          if (+e.target.value === 0) {
                            return toast.error("Enter Valid Value");
                          }
                          let update = formData.map((res, ind) => {
                            if (ind === index) {
                              return {
                                ...res,
                                amount: +e.target.value,
                              };
                            } else {
                              return res;
                            }
                          });
                          setFormData(update);
                          setCalc((prev) => !prev);
                        }}
                      />
                    </Col>

                    {data?.product?.variant?.map((variant) => {
                      return (
                        <Col md={3}>
                          <label className="text-label mb-1 text-capitalize">
                            {lang === "en"
                              ? variant.variant.name_en
                              : variant.variant.name_ar}{" "}
                            :
                          </label>
                          <p style={{ color: "#222" }}>
                            {lang === "en"
                              ? variant.variant_value?.value_en
                              : variant.variant_value?.value_ar}
                          </p>
                        </Col>
                      );
                    })}
                    {!!data.product.weight && (
                      <Col md={2}>
                        <label className="text-label mb-1 text-capitalize">
                          {" "}
                          {Translate[lang].weight}:
                        </label>
                        <p style={{ color: "#222" }}>{data.product.weight}</p>
                      </Col>
                    )}

                    {data.dynamicVariantOptions?.length > 0 && (
                      <Col md={12}>
                        <label className="text-label mb-2 d-block">
                          {Translate[lang].dynamic_variant}
                        </label>
                      </Col>
                    )}

                    {data.dynamicVariantOptions?.length > 0 &&
                      data.dynamicVariantOptions.map((vari, ind) => {
                        return (
                          <Col
                            md={6}
                            key={ind}
                            className="d-flex justify-content-between"
                          >
                            <label className="text-label m-0">
                              {lang === "en" ? vari.name_en : vari.name_ar}
                            </label>

                            <div
                              style={{
                                fontSize: "19px",
                                width: "5rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <i
                                onClick={() => {
                                  if (
                                    data.dynamicVariant[ind]?.amount ===
                                      vari.available_amount ||
                                    (!data.dynamicVariant[ind]?.has_amount &&
                                      data.dynamicVariant[ind]?.amount === 1)
                                  ) {
                                    return;
                                  }
                                  let updateDynamic = data.dynamicVariant?.map(
                                    (v, inde) => {
                                      if (inde === ind) {
                                        return {
                                          ...v,
                                          amount: v.amount + 1,
                                        };
                                      } else {
                                        return v;
                                      }
                                    }
                                  );
                                  let update = formData.map((res, i) => {
                                    if (i === index) {
                                      return {
                                        ...res,
                                        dynamicVariant: updateDynamic,
                                      };
                                    } else {
                                      return res;
                                    }
                                  });
                                  setFormData([...update]);
                                  setCalc((prev) => !prev);
                                }}
                                className="la la-plus-circle"
                                style={{
                                  cursor:
                                    data.dynamicVariant[ind]?.amount ===
                                      vari.available_amount ||
                                    (!data.dynamicVariant[ind]?.has_amount &&
                                      data.dynamicVariant[ind]?.amount === 1)
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              ></i>
                              <span className="mx-3">
                                {data.dynamicVariant[ind]?.amount}
                              </span>
                              <i
                                onClick={() => {
                                  if (data.dynamicVariant[ind]?.amount === 0) {
                                    return;
                                  }
                                  let updateDynamic = data.dynamicVariant?.map(
                                    (v, inde) => {
                                      if (inde === ind) {
                                        return {
                                          ...v,
                                          amount: v.amount - 1,
                                        };
                                      } else {
                                        return v;
                                      }
                                    }
                                  );
                                  let update = formData.map((res, i) => {
                                    if (i === index) {
                                      return {
                                        ...res,
                                        dynamicVariant: updateDynamic,
                                      };
                                    } else {
                                      return res;
                                    }
                                  });
                                  setFormData([...update]);
                                  setCalc((prev) => !prev);
                                }}
                                style={{
                                  cursor:
                                    data.dynamicVariant[ind]?.amount === 0
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                                className="la la-minus-circle"
                              ></i>
                            </div>
                          </Col>
                        );
                      })}

                    {!!data.product && (
                      <Col md={12} className="mt-4">
                        <div
                          className="p-3 d-flex justify-content-between"
                          style={{
                            backgroundColor: "var(--light)",
                            borderRadius: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                              fontWeight: "500",
                              direction: "ltr",
                            }}
                          >
                            {data.product?.offer
                              ? data.product?.offerPrice
                              : data.product?.price}{" "}
                            x{data?.amount}{" "}
                            {data.dynamicVariant?.filter(
                              (vari) => !!(vari.amount * vari.price)
                            )?.length > 0 && (
                              <span className="text">
                                {" "}
                                +{" "}
                                {data.dynamicVariant
                                  ?.map((vari) => vari.amount * vari.price)
                                  ?.reduce(
                                    (accumulator, currentValue) =>
                                      accumulator + currentValue,
                                    0
                                  )}
                              </span>
                            )}
                          </span>
                          <span style={{ fontSize: "20px" }}>
                            {Translate[lang].total}:{" "}
                            <span
                              className="text-primary"
                              style={{ fontWeight: "600" }}
                            >
                              {data.totalPrice}
                            </span>
                          </span>
                        </div>
                      </Col>
                    )}
                  </Row>
                );
              })}
              {/* {!!formData.filter(res=> !!res.product)?.length && 
                <Row className="px-2 py-4 mt-3" style={{backgroundColor: 'var(--light)'}}>
                    <Col md={6}>
                        <div className="form-group mb-3">
                            <label className="text-label">{Translate[lang].order_day}</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                name="date"
                                min={new Date().toJSON().split("T")[0]}
                                value={day}
                                onChange={(e)=> setDay(e.target.value)}
                            />
                        </div>
                    </Col>
                    <Row className='mx-1'>
                        {intervalHours?.map((hour, ind)=>{
                            return <Col md={2} key={ind} className='mb-3'>
                                <div 
                                    onClick={()=> setSelectedIntervalHours(hour)}
                                    style={{
                                        backgroundColor: hour.id === selectedIntervalHours?.id ? 'var(--primary)' : 'rgb(222 222 222 / 54%)', 
                                        color: hour.id === selectedIntervalHours?.id ? '#fff' : '#444',
                                        padding: '1rem 0',
                                        textAlign: 'center',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}>
                                    <span className="d-block">{Translate[lang].from}: <b>{hour.from}</b></span>
                                    <span>{Translate[lang].to}: <b>{hour.to}</b></span>
                                </div>
                            </Col>
                        })}
                    </Row>
                </Row>} */}

              {!!formData.filter((res) => !!res.product)?.length && (
                <Row
                  className="px-2 py-4 mt-3"
                  style={{ backgroundColor: "var(--light)" }}
                >
                  <Col
                    md={6}
                    style={{
                      borderRight: lang === "en" ? "1px solid #dedede" : "",
                      borderLeft: lang === "ar" ? "1px solid #dedede" : "",
                    }}
                  >
                    <Row>
                      <Col md={9} className="pr-0">
                        <AvField
                          label={Translate[lang].coupon}
                          type="text"
                          name="promoCode"
                          placeholder={`${Translate[lang].enter} ${Translate[lang].coupon}`}
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                      </Col>
                      <Col md={3}>
                        <Button
                          variant="outline-secondary"
                          className="w-100 p-0"
                          style={{ marginTop: "29px", height: "42px" }}
                          // disabled={!promoCode}
                          type="button"
                          onClick={getPromoCode}
                        >
                          {Translate[lang].apply}
                        </Button>
                      </Col>
                      <Col md={12}>
                        <label className="text-label">
                          {Translate[lang].payment_method}
                        </label>
                        <Select
                          value={paymentMethod}
                          name="paymentMethod"
                          placeholder={Translate[lang].select}
                          options={[
                            {
                              label: lang === "en" ? "Cash" : "كاش",
                              value: "cash",
                              en: "Cash",
                              ar: "كاش",
                            },
                            {
                              label: lang === "en" ? "Visa" : "فيزا",
                              value: "visa",
                              en: "Visa",
                              ar: "فيزا",
                            },
                            {
                              label: lang === "en" ? "K net" : "كي نت",
                              value: "k_net",
                              en: "k_net",
                              ar: "كي نت",
                            },
                          ]}
                          onChange={(e) => {
                            setPaymentMethod(e);
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <div className="mt-1 d-flex justify-content-between">
                      <label className="text-label">
                        {Translate[lang].payment_method}
                      </label>
                      <p className="mb-0">
                        {!!paymentMethod ? paymentMethod[lang] : "-"}
                      </p>
                    </div>
                    <div className="mt-1 d-flex justify-content-between">
                      <label className="text-label">
                        {Translate[lang].sub_price} (
                        {formData.filter((res) => !!res.product)?.length})
                      </label>
                      <p className="mb-0">
                        {formData
                          .filter((res) => !!res.product)
                          .reduce((total, data) => total + data.totalPrice, 0)}
                      </p>
                    </div>
                    {/* <div className="mt-1 d-flex justify-content-between">
                                <label className="text-label">{Translate[lang].shipping_fee}</label>
                                <p className="mb-0">30</p>
                            </div> */}
                    {!!promoCodeData && (
                      <div className="mt-1 d-flex justify-content-between">
                        <label className="text-label">
                          {Translate[lang].coupon}
                        </label>
                        <p className="text-danger mb-0">
                          {promoCodeData.type === "percentage"
                            ? `${promoCodeData.value}%`
                            : `-${promoCodeData.value}`}
                        </p>
                      </div>
                    )}
                    <div
                      className="my-2"
                      style={{ height: "1px", background: "#dedede" }}
                    ></div>

                    <div className="mt-1 d-flex justify-content-between">
                      <label
                        className="text-label"
                        style={{ fontWeight: "600" }}
                      >
                        {Translate[lang].total_price}
                      </label>
                      {!promoCodeData && (
                        <p
                          className="text-success mb-0"
                          style={{ fontWeight: "600", fontSize: "18px" }}
                        >
                          {formData
                            .filter((res) => !!res.product)
                            .reduce(
                              (total, data) => total + data.totalPrice,
                              0
                            )}
                        </p>
                      )}
                      {!!promoCodeData &&
                        promoCodeData?.type === "percentage" && (
                          <p
                            className="text-success mb-0"
                            style={{ fontWeight: "600", fontSize: "18px" }}
                          >
                            {formData
                              .filter((res) => !!res.product)
                              .reduce(
                                (total, data) => total + data.totalPrice,
                                0
                              ) -
                              formData
                                .filter((res) => !!res.product)
                                .reduce(
                                  (total, data) => total + data.totalPrice,
                                  0
                                ) *
                                (promoCodeData.value / 100)}
                          </p>
                        )}
                      {!!promoCodeData &&
                        promoCodeData?.type !== "percentage" && (
                          <p
                            className="text-success mb-0"
                            style={{ fontWeight: "600", fontSize: "18px" }}
                          >
                            {formData
                              .filter((res) => !!res.product)
                              .reduce(
                                (total, data) => total + data.totalPrice,
                                0
                              ) - promoCodeData.value}
                          </p>
                        )}
                    </div>
                  </Col>
                </Row>
              )}
              <Button
                onClick={() => {
                  setFormData([
                    ...formData,
                    {
                      category: "",
                      sub_category: "",
                      subCategoryOptions: [],
                      product: "",
                      productsOptions: "",
                      quantity: "",
                      dynamicVariantOptions: [],
                      variant: [],
                      dynamicVariant: [],
                      amount: "",
                    },
                  ]);
                }}
                type="button"
                variant="outline-primary"
                className="mt-3"
              >
                {Translate[lang].add_new_product}
              </Button>

              <div className="mt-4 d-flex justify-content-between">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/orders")}
                >
                  {Translate[lang].cancel}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    !formData.filter((res) => !!res.product).length || loading
                  }
                >
                  {paymentMethod?.value === "cash"
                    ? Translate[lang].submit
                    : Translate[lang].next}
                </Button>
              </div>
            </AvForm>
          </Card.Body>
        </Card>
      )}
    </>
  );
};
export default AddOrders;
