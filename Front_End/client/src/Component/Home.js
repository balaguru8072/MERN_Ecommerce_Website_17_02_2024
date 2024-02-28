import { Fragment, useEffect, useState } from "react";
import MetaData from "./Layout/MetaData";
import { getProducts } from "../actions/prdoctsActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Layout/Loader";
import Product from "./Product/Product";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "react-js-pagination";

export default function Home() {

    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(1)
    console.log(currentPage, "currentpage")
    const setCurrentPageNa = (pageNo) => {
        setCurrentPage(pageNo)
    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: 'bottom-center',
            })
        }
        dispatch(getProducts(null,null,null,null,currentPage))

    }, [error, dispatch, currentPage])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product col={3} key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                    {productsCount > 0 && productsCount >  resPerPage?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNa}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={"next"}
                                firstPageText={"first"}
                                lastPageText={"last"}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div> : null
                    }
                </Fragment>
            }
        </Fragment>
    )
}
