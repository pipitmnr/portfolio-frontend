import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../../store";
import CartDetailData from "./cart-detail-data";
import axios from 'axios';
import { Link } from "react-router-dom";

class CartData extends Component{
    state = {
        "0": "Pesanan belum dicheckout",
        "1": "Pesanan telah dicheckout. Mohon menunggu konfirmasi dari toko.",
        "2": "Pesanan telah dikonfirmasi. Silahkan lakukan pembayaran.",
        "3": "Pembayaran telah dilakukan",
        "4": "Pembayaran dikonfirmasi toko. Barang sedang dipacking",
        "5": "Barang telah dikirim",

    };
    deleteCart = async(event) => {
        const self = this;
        const req = {
            method : "delete",
            url : `https://hijub.my.id/cart/${event}`,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        };
        await axios(req)
            .then(function(response){
                self.props.history.push("/cart");
                alert("Berhasil Hapus");
            })
            .catch(function(error){
                alert("Gagal Hapus");
                self.props.history.push("/cart");
            });
            
    };
    checkout = async(event) => {
        const self = this;
        const data = {
            "status": "1",
        };
        const req = {
            method : "put",
            url : `https://hijub.my.id/cart/${event}`,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data : data
        };
        await axios(req)
            .then(function(response){
                self.props.history.push("/checkout");
                alert("Berhasil Checkout");
            })
            .catch(function(error){
                alert("Gagal Checkout");
                self.props.history.push("/cart");
            });
            
    };
    render(){
        const {listCart, isLoading} = this.props;
        const arrayCart = listCart.filter(item => {
            if(item.status === "0"){
                return item;
            }
            return false;
        });
        const isiCart = arrayCart.map((item, key) => {
            return(
                <div className="container pt-5 mt-5">
                    <div className="row py-5 align-items-center">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <h3 style={{color:"#6405ad", fontWeight:"bold"}}>Keranjang ID :{item.id}</h3>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-2">
                            {this.props.adminIsLogin ? 
                                <div>Menunggu checkout dari pembeli</div>
                            :
                                <React.Fragment>
                                    {item.total_harga>0 ? 
                                        <button className="btn-success my-2" onClick={(event) => this.checkout(`${item.id}`)}>
                                            Checkout
                                        </button>
                                    :
                                        <div></div>
                                    }
                                    <Link to={`/`}>
                                        <button className="btn-danger my-2" onClick={(event) => this.deleteCart(`${item.id}`)}>
                                            Hapus Keranjang
                                        </button>
                                    </Link>
                                </React.Fragment>
                            }                            
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-6 cart-info">
                            <div className="row align-items-center">
                                <CartDetailData id_cart={item.id}/>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-3"></div>
                                <div className="col-md-4 text-left">
                                    <p>Ongkir</p>
                                    <p>Total Harga</p>
                                    <p>Status</p>
                                    <p>Alamat Lengkap</p>
                                </div>
                                <div className="col-md-1 text-left">
                                    <p>:</p>
                                    <p>:</p>
                                    <p>:</p>
                                    <p>:</p>
                                </div>
                                <div className="col-md-4 text-left">
                                    <p>{item.ongkir}</p>
                                    <p>{item.total_harga}</p>
                                    <p>{item.status}</p>
                                    <p>{item.alamat_lengkap}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-product-border mt-5">
                        <div className="row">
                            <div className="col-md-12">
                            
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        return(
            <React.Fragment>
                {isLoading ? <div style={{ textAlign: "center" }}>Loading...</div> : isiCart}
            </React.Fragment>
        );
    }
}

export default connect("isLoading, listCart, adminIsLogin", actions)(withRouter(CartData));