import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../../store";
import CheckoutDetailData from "./checkout-detail-data";
import axios from 'axios';
import { Link } from "react-router-dom";

class CheckoutData extends Component{
    state = {
        "0": "Pesanan belum dicheckout",
        "1": "Pesanan telah dicheckout. Mohon menunggu konfirmasi dari toko.",
        "2": "Pesanan telah dikonfirmasi. Silahkan lakukan pembayaran.",
        "3": "Pembayaran telah dilakukan",
        "4": "Pembayaran dikonfirmasi toko. Barang segera dipersiapkan.",
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
                self.props.history.push("/checkout");
                alert("Berhasil Hapus");
            })
            .catch(function(error){
                alert("Gagal Hapus");
                self.props.history.push("/checkout");
            });
            
    };
    pembayaran = async(event) => {
        const self = this;
        const data = {
            "status": "3",
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
                alert("Terimakasih. Toko Akan Konfirmasi Pembayaran Anda");
                self.props.history.push("/checkout");
            })
            .catch(function(error){
                alert("Maaf Terjadi Kesalahan");
                self.props.history.push("/checkout");
            });
            
    };
    render(){
        const {listCart, isLoading} = this.props;
        const arrayCart = listCart.filter(item => {
            if(item.status !== "0"){
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
                            <h3 style={{color:"#6405ad", fontWeight:"bold"}}>ID PESANAN : {item.id}</h3>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-2">
                            {this.props.adminIsLogin ? 
                                <div></div>
                            :
                                item.status<="2" ?
                                    <React.Fragment>
                                        <Link to={`/`}>
                                            <button className="btn-danger my-2" onClick={(event) => this.deleteCart(`${item.id}`)}>
                                                Hapus pesanan
                                            </button>
                                        </Link>
                                        {item.status=="2" ?
                                            <Link to={`/`}>
                                                <button className="btn-success my-2" onClick={(event) => this.pembayaran(`${item.id}`)}>
                                                    Saya sudah bayar
                                                </button>
                                            </Link>
                                        :
                                            <div></div>
                                        }                                            
                                    </React.Fragment>
                                :
                                <div>Terimakasih. Toko akan mengupdate pesananmu pada status</div>
                            }                            
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-6 cart-info">
                            <div className="row align-items-center">
                                <CheckoutDetailData id_cart={item.id}/>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-1"></div>
                                <div className="col-md-5 text-left">
                                    <p>Alamat Lengkap</p>
                                    <p>Ongkir</p>
                                    <p>Total Harga</p>
                                    <p>Status</p>
                                </div>
                                <div className="col-md-6 text-left">
                                    <p>: {item.alamat_lengkap}</p>
                                    <p>: {item.ongkir}</p>
                                    <p>: {item.total_harga}</p>
                                    <p>: {this.state[item.status]}</p>
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

export default connect("isLoading, listCart, adminIsLogin, listCartDetail", actions)(withRouter(CheckoutData));