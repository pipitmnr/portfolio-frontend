import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import { Link } from "react-router-dom";
import axios from 'axios';

class Home extends React.Component{
    state = {
        listCategory:[],
        isLoading:true,
    };
    axiosCategory = async() => {
        const self = this;
        await axios
            .get(`https://hijub.my.id/category`)
            .then(function(response){
                self.setState({listCategory: response.data, isLoading: false});
            })
            .catch(function(error){
                self.setState({isLoading: false});
            });
    };
    componentDidMount = async() => {
        this.axiosCategory();
    }
    render(){
        const {listCategory, isLoading} = this.state;
        const arrayCategory = listCategory.map((item, key) => {
            return(
                <div className="col-md-4 py-3">
                    <div className="">
                        <Link to={`/category/${item.id}`}>
                            <img src="https://id-test-11.slatic.net/p/b5bc36c323de7153e37c501128624e55.jpg" alt=""/>
                        </Link>
                    </div>
                    <div className="product-caption">
                        <p className="my-0">
                            <Link to={`/category/${item.id}`}>
                                {item.nama}
                            </Link>
                        </p>
                    </div>
                </div>
            );
        });
        return(
            <div>
                <Header/>
                <div className="container-fluid home-content"> 
                    <div className="container py-5 mt-5">
                        <div className="row align-items-center py-5">
                            <div className="col-md-12 home-slide py-5">
                                <img src="https://storage.googleapis.com/hijup-production-sg-core/system/banners/primary/image/1469/MB-HIJUP-Scarf-Pilihan-di-awal-tahun-_Main-Banner___1_.jpg" alt=""/>
                                <img src="https://storage.googleapis.com/hijup-production-sg-core/system/banners/primary/image/1470/POTS-Statement_Top-MB-.jpg" alt=""/>
                                <img src="https://storage.googleapis.com/hijup-production-sg-core/system/banners/primary/image/1472/MB-Brand-New-You_-Brand-New-items-sale-up-to-70_.jpg" alt=""/>
                                <img src="https://storage.googleapis.com/hijup-production-sg-core/system/banners/primary/image/1471/MB-MP-Back-to-Work.jpg" alt=""/>
                            </div>
                        </div>
                        <div className="row align-items-center home-category">
                            {arrayCategory}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect("listCategory, category, isLogin, isLoading, id_category, adminIsLogin", actions)(withRouter(Home));