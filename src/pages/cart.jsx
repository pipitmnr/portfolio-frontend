import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import axios from 'axios';
import CartData from "./data/cart-data"
// import { Link } from "react-router-dom";

class Cart extends React.Component{
    axiosCart = async() => {
        const self = this;
        let urlfix = "";
        if (this.props.adminIsLogin===true) {
            urlfix = "https://hijub.my.id/cart/admin"
        }
        else{
            urlfix = "https://hijub.my.id/cart"
        }
        const req = {
            method : "get",
            url : urlfix,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }
        await axios(req)
            .then(function(response){
                store.setState({listCart: response.data, isLoading: false});
            })
            .catch(function(error){
                store.setState({isLoading: false});
            });
    };
    axiosCartDetail = async() => {
        const req = {
            method : "get",
            url : "https://hijub.my.id/cartdetail",
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }
        await axios(req)
            .then(function(response){
                store.setState({listCartDetail: response.data, isLoading: false});
            })
            .catch(function(error){
                store.setState({isLoading: false});
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
    componentDidMount = () => {
        this.axiosCart();
        this.axiosCartDetail();
        this.axiosProduct();
    };
    render(){
        return(
            <div>
                <Header categoryHijab={event => this.props.categoryHijab(event)} category={this.props.category}/>
                <div className="container-fluid home-content">
                    <CartData/>
                </div>
            </div>
        )
    }
}
export default connect("listCart, isLoading, listCartDetail, listProductCart, adminIsLogin, listProductCheckout", actions)(withRouter(Cart));