import React, { Component } from "react";
import { Link } from "react-router-dom";
import { actions } from "../../store";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
// import axios from 'axios';

class CategoryData extends Component{
    render(){
        
        const {listProduct, isLoading} = this.props;
        const isiProduct = listProduct.map((item, key) => {
            return(
                <div className="col-md-4 py-3">
                    <div className="product-img">
                        <Link to={`/product/${item.id}`}>
                            <img src={item.gambar} alt=""/>
                        </Link>
                    </div>
                    <div className="product-caption">
                        <p className="my-0">{item.nama}</p>
                        <p className="my-0">Rp. {item.harga}</p>
                    </div>
                </div>
            );
        });
        return(
            <React.Fragment>
                {isLoading ? <div style={{ textAlign: "center" }}>Loading...</div> : isiProduct}
            </React.Fragment>
        );
    }
}
// export default CategoryData;
export default connect("category, isLogin, token, full_name, email, no_hp, id_category, isLoading, id_product, listProduct", actions)(withRouter(CategoryData));