import React from "react";
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import axios from "axios";
import CheckoutData from "./data/checkout-data";
// import { Link } from "react-router-dom";

class Checkout extends React.Component {
    axiosCart = async () => {
        const self = this;
        let urlfix = "";
        if (this.props.adminIsLogin === true) {
            urlfix = "https://hijub.my.id/cart/admin";
        }
        else {
            urlfix = "https://hijub.my.id/cart";
        }
        const req = {
            method: "get",
            url: urlfix,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        };
        await axios(req)
        .then(function(response) {
            store.setState({ listCart: response.data, isLoading: false });
        })
        .catch(function(error) {
            store.setState({ isLoading: false });
        });
    };
    axiosCartDetailAdmin = async () => {
        let urlfix = "";
        if (this.props.adminIsLogin === true) {
            urlfix = "https://hijub.my.id/cartdetail/admin";
        }
        else {
            urlfix = "https://hijub.my.id/cartdetail";
        }
        const req = {
            method: "get",
            url: urlfix,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        };
        await axios(req)
        .then(function(response) {
            store.setState({ listCartDetail: response.data, isLoading: false });
        })
        .catch(function(error) {
            store.setState({ isLoading: false });
        });
    };
    axiosProduct = async () => {
        const self = this;
        await axios
        .get(`https://hijub.my.id/product`)
        .then(function(response) {
            store.setState({ listProductCheckout: response.data, isLoading: false });
            console.warn("isi listproductcheckout", this.props.listProductCheckout);
        })
        .catch(function(error) {
            store.setState({ isLoading: false });
        });
    };
    componentDidMount = async () => {
        const self = this;
        this.axiosCart();
        await this.axiosCartDetailAdmin();
        this.axiosProduct();
    };
    render() {
        return (
        <div>
            <Header />
            <div className="container-fluid home-content">
            <CheckoutData listCartDetail={this.props.listCartDetail} />
            </div>
        </div>
        );
    }
}
export default connect(
    "listCart, isLoading, listCartDetail, listProductCart, adminIsLogin, listProduct, listProductCheckout",
    actions)(withRouter(Checkout));
