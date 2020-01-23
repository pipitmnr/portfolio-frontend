import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../../store";
import axios from 'axios';
import { Link } from "react-router-dom";
class CartDetailData extends Component{
    state = {
        listProduct: [],
        isLoading: true
    }
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
    axiosProduct = async() => {
        const self = this
        await axios
            .get(`https://hijub.my.id/product`)
            .then(function(response){
                store.setState({listProduct: response.data, isLoading: false});
                self.setState({listProduct: response.data, isLoading: false})
            })
            .catch(function(error){
                store.setState({isLoading: false});
                self.setState({ isLoading: false})
            });
    };
    componentDidMount = async () => {
        await this.axiosProduct();
    }
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
    render(){
        const {listCartDetail, isLoading, listProduct} = this.props;
        const arrayCartDetail = listCartDetail.filter(item => {
            if(item.id_cart === this.props.id_cart){
                return item;
            }
            return false;
        });
        const isiCartDetail = arrayCartDetail.map((item, key) => {
            const listProductFilter = this.state.listProduct.filter(itemProduct=>{
                if(item.id_product==itemProduct.id){
                    return itemProduct;
                }
                return false;
            })
            let a = ''
            for(const i in listProductFilter){
                a = listProductFilter[i].deskripsi
            }
            if(a.length > 1){
                return(
                    <React.Fragment key={key}>
                        <div className="col-md-5 cart-img my-3">
                            <img src={listProductFilter[0].gambar} alt=""/>
                        </div>
                        <div className="col-md-7">
                            <div className="row align-items-center">
                                <div className="col-md-2 px-0">
                                    <p>-</p>
                                </div>
                                <div className="col-md-10 px-0" style={{textAlign:"left"}}>
                                    <p>ID Cart : {item.id_cart}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-md-2 px-0">
                                    <p>-</p>
                                </div>
                                <div className="col-md-10 px-0" style={{textAlign:"left"}}>
                                    <p>{listProductFilter[0].nama}</p>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-md-2 px-0">
                                    <p>-</p>
                                </div>
                                <div className="col-md-10 px-0" style={{textAlign:"left"}}>
                                    <p>Harga : {listProductFilter[0].harga}</p>
                                </div>
                            </div>
                            <div className="row align-items-center pb-5">
                                <div className="col-md-2 px-0">
                                    <p>-</p>
                                </div>
                                <div className="col-md-10 px-0" style={{textAlign:"left"}}>
                                    <p>jumlah item : {item.jumlah_item}</p>
                                </div>
                            </div>
                            <div className="row align-items-center pl-5">
                                <Link to={`/`}>
                                    <button className="btn-danger" onClick={(event) => this.deleteCartDetail(`${item.id}`)}>
                                        Hapus
                                    </button>
                                </Link>
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

export default connect("isLoading, listCartDetail, productCart, listProduct, listProductCheckout", actions)(withRouter(CartDetailData));