import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Translate } from "../../Enums/Tranlate";
import "./style.scss";

const Pagination = ({
  setData,
  service,
  shouldUpdate,
  isDeleted,
  setHasData,
  setLoading,
  type,
  search,
  status
}) => {
  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);
  const [pageShow, setPageShow] = useState(1);
  const lang = useSelector((state) => state.auth.lang);

  useEffect(() => {
    setLoading(true);
    let params = {
      offset: (page - 1) * 15,
      limit: 15,
      isDeleted: isDeleted,
    };
    if (!!type) params["type"] = type;
    if (!!search) params["search"] = search;
    if (!!status) params["status"] = status;

    service?.getList({ ...params }).then((res) => {
      if (res?.status === 200) {
        setData([...res.data?.data?.data]);
        let total = Math.ceil(res.data?.data?.totalItems / 15);
        setTotalPages(total);
        if (res.data?.data?.totalItems > 0) {
          setHasData(1);
        } else {
          setHasData(0);
        }
      }
      setLoading(false);
    });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [page, isDeleted, shouldUpdate, search, status]);

  useEffect(() => {
    setPage(1);
  }, [isDeleted, shouldUpdate]);

  if (totalPages > 1) {
    return (
      <Row className="pagination mt-3 px-2">
        <Col md={12} className="text-center">
          <div className="filter-pagination d-flex justify-content-between mt-3">
            <button
              className="previous-button"
              onClick={() => {
                setPage((prev) => parseInt(prev) - 1);
                setPageShow(page - 1);
              }}
              disabled={parseInt(page) === 1}
            >
              {lang === "en" ? (
                <i className="la la-arrow-left"></i>
              ) : (
                <i className="la la-arrow-right"></i>
              )}{" "}
              {Translate[lang]?.previous}
            </button>
            {8 <= 6 ? (
              <div className="d-flex" style={{ gap: "5px" }}>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                )?.map((num) => {
                  return (
                    <p
                      onClick={() => {
                        setPage(num);
                        setPageShow(num);
                      }}
                      style={{
                        padding: "5px 10px",
                        margin: "0",
                        cursor: "pointer",
                        color:
                          parseInt(page) === parseInt(num)
                            ? "var(--primary)"
                            : "",
                      }}
                    >
                      {num}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="d-flex" style={{ gap: "5px" }}>
                {Array.from({ length: 8 }, (_, index) => index + 1)
                  ?.slice(page - 1, page + 6)
                  ?.map((num, index) => {
                    // if (index < 3 || index >= 8 - 3) {
                    return (
                      <p
                        onClick={() => {
                          setPage(num);
                          setPageShow(num);
                        }}
                        style={{
                          padding: "5px 10px",
                          margin: "0",
                          cursor: "pointer",
                          color:
                            parseInt(page) === parseInt(num)
                              ? "var(--primary)"
                              : "",
                        }}
                      >
                        {num}
                      </p>
                    );
                    // }
                    // return <span>...</span>;
                  })}
              </div>
            )}
            <button
              className="next-button"
              onClick={() => {
                setPage((prev) => parseInt(prev) + 1);
                setPageShow(page + 1);
              }}
              disabled={parseInt(page) === totalPages}
            >
              {Translate[lang]?.next}{" "}
              {lang === "en" ? (
                <i className="la la-arrow-right"></i>
              ) : (
                <i className="la la-arrow-left"></i>
              )}
            </button>
          </div>
        </Col>
      </Row>
    );
  }
};

export default Pagination;
