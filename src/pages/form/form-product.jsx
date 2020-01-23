import React from 'react';
import Header from "../../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../../store";
import { Link } from "react-router-dom";
import axios from 'axios';

class formProduct extends React.Component{
    state = {
        id_kategori: 0,
        nama: "",
        harga: 0,
        deskripsi: "",
        keterangan: "",
        gambar: "",
        isLoading: true,
    };
    changeInput = e => {
        const self = this;
        self.setState({ [e.target.name]: e.target.value });
    };
    postProduct = async() => {
        const self = this;
        
        const { id_kategori, nama, harga, deskripsi, keterangan, gambar } = this.state;
        const data = {
            "id_kategori": id_kategori,
            "nama": nama,
            "harga": harga,
            "deskripsi": deskripsi,
            "keterangan": keterangan,
            "gambar": gambar,
        };
        const req = {
            method : "post",
            url : "https://hijub.my.id/product",
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data : data
        };
        await axios(req)
            .then(function(response){
                self.props.history.push(`/admin-product`);
                alert("Berhasil Menambahkan Data");
            })
            .catch(function(error){
                alert("Gagal Menambahkan Data");
                self.props.history.push("/form-add-product");
            });
            
    };
    putProduct = async() => {
        const self = this;
        const { id_product } = self.props.location.state
        const { id_kategori, nama, harga, deskripsi, keterangan, gambar } = this.state;
        const data = {
            "id_kategori": id_kategori,
            "nama": nama,
            "harga": harga,
            "deskripsi": deskripsi,
            "keterangan": keterangan,
            "gambar": gambar,
        };
        const req = {
            method : "put",
            url : `https://hijub.my.id/product/${id_product}`,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data : data
        };
        await axios(req)
            .then(function(response){
                self.props.history.push(`/admin-product`);
                alert("Berhasil Edit Data");
            })
            .catch(function(error){
                alert("Gagal Edit Data");
                self.props.history.push("/form-add-product");
            });
            
    };
    getProductById = async(event) => {
        const self = this;
        await axios
            .get(`https://hijub.my.id/product/${event}`)
            .then(function(response){
                self.setState({id_kategori: response.data.id_kategori, nama: response.data.nama, 
                    harga: response.data.harga, deskripsi: response.data.deskripsi,
                    keterangan: response.data.keterangan, gambar: response.data.gambar, isLoading: false});
            })
            .catch(function(error){
                self.setState({isLoading: false});
            });
    };
    componentDidMount = async() => {
        if (this.props.location.state) {
            const { id_product } = this.props.location.state
            this.getProductById(id_product);
        }
    };
    render(){
        return(
            <div>
                <Header/>
                <div className="container-fluid home-content">
                    <div className="container py-5 mt-5">
                        <div className="row py-5 align-items-center">
                            <div className="col-md-1"></div>
                            <div className="col-md-4 pt-5 login-img">
                                {this.state.id_kategori>0 ?
                                    <img src={this.state.gambar} alt=""/>
                                :
                                    <img src={require('../../assets/image/login.jpg')} alt=""/>
                                }
                            </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-1 pt-5"></div>
                            <div className="col-md-4 pt-5">
                                <div>
                                    {this.state.id_kategori>0 ?
                                        <h3 style={{color:"#6405ad", fontWeight:"bold"}}>Edit Hijab</h3>
                                    :
                                        <h3 style={{color:"#6405ad", fontWeight:"bold"}}>Tambah Hijab</h3>
                                    }
                                </div>
                                <div className="login-card p-5">
                                    <form>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="id_kategori" className="my-0">
                                                ID Kategori<span style={{color:"red"}}>*</span>
                                            </label>
                                            {this.state.id_kategori>0 ?
                                                <input type="text" className="form-control" name="id_kategori" id="id_kategori" placeholder="1:Segi Empat, 2:Bergo, 3:Pashmina" onChange={e => this.changeInput(e)} value={this.state.id_kategori} required/>
                                            :
                                                <input type="text" className="form-control" name="id_kategori" id="id_kategori" placeholder="1:Segi Empat, 2:Bergo, 3:Pashmina" onChange={e => this.changeInput(e)} required/>
                                            }
                                        </div>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="nama" className="my-0">
                                                Nama Hijab<span style={{color:"red"}}>*</span>
                                            </label>
                                            {this.state.id_kategori>0 ?
                                                <input type="text" className="form-control" name="nama" id="nama" placeholder="Nama Hijab" onChange={e => this.changeInput(e)} value={this.state.nama} required/>
                                            :
                                                <input type="text" className="form-control" name="nama" id="nama" placeholder="Nama Hijab" onChange={e => this.changeInput(e)} required/>
                                            }
                                        </div>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="harga" className="my-0">
                                                Harga<span style={{color:"red"}}>*</span>
                                            </label>
                                            {this.state.id_kategori>0 ?
                                                <input type="text" className="form-control" name="harga" id="harga" placeholder="Contoh: 50000" onChange={e => this.changeInput(e)} value={this.state.harga} required/>
                                            :
                                                <input type="text" className="form-control" name="harga" id="harga" placeholder="Contoh: 50000" onChange={e => this.changeInput(e)} required/>
                                            }
                                        </div>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="deskripsi" className="my-0">
                                                Deskripsi<span style={{color:"red"}}>*</span>
                                            </label>
                                            {this.state.id_kategori>0 ?
                                                <input type="text" className="form-control" name="deskripsi" id="deskripsi" placeholder="Deskripsi" onChange={e => this.changeInput(e)} value={this.state.deskripsi} required/>
                                            :
                                                <input type="text" className="form-control" name="deskripsi" id="deskripsi" placeholder="Deskripsi" onChange={e => this.changeInput(e)} required/>
                                            }
                                        </div>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="keterangan" className="my-0">
                                                Keterangan<span style={{color:"red"}}>*</span>
                                            </label>
                                            {this.state.id_kategori>0 ?
                                                <input type="text" className="form-control" name="keterangan" id="keterangan" placeholder="Keterangan" onChange={e => this.changeInput(e)} value={this.state.keterangan} required/>
                                            :
                                                <input type="text" className="form-control" name="keterangan" id="keterangan" placeholder="Keterangan" onChange={e => this.changeInput(e)} required/>
                                            }
                                        </div>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="gambar" className="my-0">
                                                Link Gambar<span style={{color:"red"}}>*</span>
                                            </label>
                                            {this.state.id_kategori>0 ?
                                                <input type="text" className="form-control" name="gambar" id="gambar" placeholder="Link Gambar" onChange={e => this.changeInput(e)} value={this.state.gambar} required/>
                                            :
                                                <input type="text" className="form-control" name="gambar" id="gambar" placeholder="Link Gambar" onChange={e => this.changeInput(e)} required/>
                                            }
                                        </div>
                                        {this.state.id_kategori>0 ?
                                            <button type="submit" className="btn button-zooya-invers" onClick={() => this.putProduct()}><Link to="/form-add-product">Simpan</Link></button>
                                        :
                                            <button type="submit" className="btn button-zooya-invers" onClick={() => this.postProduct()}><Link to="/form-add-product">Tambah</Link></button>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect("", actions)(withRouter(formProduct));