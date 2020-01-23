import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../../store";
import axios from 'axios';
class CheckoutDetailData extends Component{
    deleteCartDetail = async(event) => {
        const self = this;
        const req = {
            method : "delete",
            url : `https://hijub.my.id/cartdetail/${event}`,
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
    render(){
        const {listCartDetail, isLoading} = this.props;
        const {listProductCheckout} = this.props
        const arrayCartDetail = listCartDetail.filter(item => {
            if(item.id_cart === this.props.id_cart){
                return item;
            }
            return false;
        });
        const isiCartDetail = arrayCartDetail.map((item, key) => {
            const arrayProductFilter = listProductCheckout.filter(itemProduct=>{
                if(item.id_product==itemProduct.id){
                    return itemProduct;
                }
                return false;
            })
            let a = ''
            for(const i in arrayProductFilter){
                a = arrayProductFilter[i].deskripsi
            }
            if(a.length > 1){
                return(
                    <React.Fragment>
                        <div className="col-md-5 cart-img my-3">
                            <img src={arrayProductFilter[0].gambar} alt=""/>
                        </div>
                        <div className="col-md-7">
                            <div className="row align-items-center">
                                <div className="col-md-2 px-0">
                                    <p>-</p>
                                </div>
                                <div className="col-md-10 px-0" style={{textAlign:"left"}}>
                                    <p>ID Checkout : {item.id_cart}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-md-2 px-0">
                                    <p>-</p>
                                </div>
                                <div className="col-md-10 px-0" style={{textAlign:"left"}}>
                                    <p>{arrayProductFilter[0].nama}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-md-2 px-0">
                                    <p>-</p>
                                </div>
                                <div className="col-md-10 px-0" style={{textAlign:"left"}}>
                                    <p>Harga : Rp. {arrayProductFilter[0].harga}</p>
                                </div>
                            </div>
                            <div className="row align-items-center pb-5">
                                <div className="col-md-2 px-0">
                                    <p>-</p>
                                </div>
                                <div className="col-md-10 px-0" style={{textAlign:"left"}}>
                                    <p>Jumlah : {item.jumlah_item} item</p>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>    
                );
            }
            
        });
        return(
            <React.Fragment>
                {isLoading ? <div style={{ textAlign: "center" }}>Loading...</div> : (
                    arrayCartDetail==false ? <div>Anda belum belanja pada keranjang ini</div> : isiCartDetail
                )}
            </React.Fragment>
        );
    }
}

export default connect("isLoading, listCartDetail, productCart, listProductCheckout", actions)(withRouter(CheckoutDetailData));