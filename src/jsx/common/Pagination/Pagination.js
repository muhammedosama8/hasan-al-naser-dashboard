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
  status,
  param
}) => {
  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);
  const lang = useSelector((state) => state.auth.lang);

  useEffect(() => setPage(1),[search])
  
  const getPageNumbers = () => {
    let maxPagesToShow = 10
    let startPage, endPage;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
      if (page <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (page + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = page - maxPagesBeforeCurrentPage;
        endPage = page + maxPagesAfterCurrentPage;
      }
    }

    return Array.from(Array(endPage - startPage + 1).keys()).map(i => startPage + i);
  };

  useEffect(() => {
    setLoading(true);
    let params = {
      offset: (page - 1) * 20,
      limit: 20,
      isDeleted: isDeleted,
      ...param
    };
    if (!!type) params["type"] = type;
    if (!!search){ 
      params["search"] = search;
    }
    if (!!status) params["status"] = status;

    service?.getList({ ...params }).then((res) => {
      if (res?.status === 200) {
        setData([...res.data?.data?.data]);
        let total = Math.ceil(res.data?.data?.totalItems / 20);
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
  }, [page, isDeleted, shouldUpdate, search, type, status]);

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
            <div className="d-flex" style={{ gap: "5px" }}>
                {getPageNumbers().map((num) => {
                  return (
                    <p
                      onClick={() => {
                        setPage(num);
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
            <button
              className="next-button"
              onClick={() => {
                setPage((prev) => parseInt(prev) + 1);
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
