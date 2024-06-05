import React, { Component } from 'react';
import { useLocation, useParams } from "react-router-dom";
import {GlobalStyles, Form, FormGroup, Input, Box, Button, ButtonGroup, H1, Panel} from '@bigcommerce/big-design';
import { ArrowBackIcon } from '@bigcommerce/big-design-icons';
import SimpleReactValidator from 'simple-react-validator';
import {Navigate} from "react-router-dom";
import {ApiService} from "../services/ApiService";
import { Oval, ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AddEditCustomer extends Component<any, any> {
    
    private validator: SimpleReactValidator;
    private _isMounted: boolean;
    private dayNumMinMax: string;

    constructor(props: any) {
        super(props);
        this.state = {
            redirect: null,
            modelLoaded: false,
            serverError: '',
            submitLoader:false,
            name:'',
            nameTxt:'',
            bcCustomerId:null,
            bcStoreId:null,
            creditValue:'',
            dayNumber:'',
            bck:false,
            error:false,
            active:null,
            nonActiveStyle:"",
            activeStyle:"",
            searchCustomers:[],
            startSearch:false,
            isSubmitted:"",
            errorMsg:null,
            customerSearchNotFocus:false,
            id:null,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validator = new SimpleReactValidator();
        this._isMounted = false;
        this.dayNumMinMax = "";
    }

    componentDidMount() {
        this._isMounted = true;
        this.clearSearch();

        if(Object.keys(this.props.params).length !== 0) {

            let credVal = this.props.location.state.creditVal.replace(/^\D+/g, '');

            this.setState({
                id: this.props.params.allowanceId,
                bcStoreId: this.props.location.state.bcStoreId,
                name:this.props.location.state.name,
                creditValue:credVal,
                dayNumber:this.props.location.state.dayNum,
                bcCustomerId:this.props.location.state.bcId,
                active:this.props.location.state.active,
            });

            if(this.props.location.state.active === "yes"){
                this.setState({
                    activeStyle:" active-allowance",
                });
            }else{
                this.setState({
                    nonActiveStyle:" active-allowance",
                });
            }
        }else{
            this.setState({
                activeStyle:" active-allowance",
                active:"yes"
            });
        }
    }

    handleSubmit(event: any) {
        event.preventDefault();

        this.setState({ submitLoader: true, serverError: '', customerSearchNotFocus:false});

        if (this.validator.allValid()) {

            if(this.state.dayNumber < 1 || this.state.dayNumber > 25){
                this.dayNumMinMax = "The numeric value must be between 1 and 25";
                this.setState({ submitLoader: false});
                return false;
            }else {

                let customerAllowance = {
                    'id': this.state.id || null,
                    'bc_customer_id': this.state.bcCustomerId,
                    'bc_shop_id': this.state.bcStoreId,
                    'credit_value': this.state.creditValue,
                    'day_number': this.state.dayNumber,
                    'active': this.state.active
                };

                if (this.state.id !== null) {
                    ApiService.updateCustomerAllowance.bind(this)(customerAllowance, this.state.id)
                        .then((response) => {
                            if (response.data.success) {
                                this.setState({bck: true, isSubmitted: "updated", submitLoader: false});
                            }else{
                                toast(response.data.message);
                            }
                        }).catch((error) => {
                        console.log(error.response.data);
                        toast("Whoops!! customer ambassador allowance not updated. Try later");
                    });
                } else {
                    ApiService.createCustomerAllowance.bind(this)(customerAllowance)
                        .then((response) => {
                            if (response.data.success) {
                                this.setState({bck: true, isSubmitted: "created", submitLoader: false});
                            }else{
                                toast(response.data.message);
                            }
                        }).catch((error) => {
                        console.log(error.response.data);
                        this.setState({ submitLoader: false});
                        toast("Whoops!! customer ambassador allowance not created. Try later");
                    });
                }
            }
        } else {
            this.validator.showMessages();
            this.setState({ submitLoader: false, error:true });
            this.forceUpdate();
        }
    }

    autoSearch(txt: string){
        if(txt !== "") {
            this.setState({
                startSearch: true,
                errorMsg: null,
                searchCustomers: []
            });

            ApiService.searchCustomers(txt).then(response => {
                if (response.status === 200) {
                    this.setState({
                        searchCustomers: response.data.data,
                        bcStoreId: response.data.bc_store_id,
                        startSearch: false
                    });
                }
            }).catch((error) => {
                this.setState({
                    errorMsg: "No customers found",
                    startSearch: false
                });
            });
        }else{
            this.setState({
                errorMsg:"Please enter name or email"
            });
        }
    }

    allowanceAction (e: any) {

        this.setState({customerSearchNotFocus:false});

        if(e === "yes"){

            this.setState({ active: "yes", activeStyle:" active-allowance", nonActiveStyle:""});
        }

        if(e === "no"){

            this.setState({ active: "no",  nonActiveStyle:" active-allowance", activeStyle:""});
        }
    }

    clearSearch = () => {

        let isThis = this;
        const customerSearch = (document.getElementById('name') as HTMLInputElement);
        if(!customerSearch) return;
        customerSearch.addEventListener('keyup', function (evt) {
            if(customerSearch.value.length === 0) {
                isThis.setState({
                    searchCustomers: [],
                    startSearch:false,
                    errorMsg:null,
                    customerSearchNotFocus:false
                });
            }
        })
    }

    onChangeHandler (txt: string) {

        this.setState({
            customerSearchNotFocus:false,
            searchCustomers: [],
        });

        if(txt !== "" && txt.length > 0) {

            this.setState({
                nameTxt:txt
            });

        }else{
            this.setState({
                searchCustomers: [],
                startSearch:false,
                errorMsg:null,
                customerSearchNotFocus:false
            });
        }

        this.setState({
            name: txt,
        });
    }

    onSearchHandler(txt: string, id: string){
        this.setState({
            name: txt,
            bcCustomerId:id,
            searchCustomers: [],
            startSearch:false,
            customerSearchNotFocus:true
        });
    }

    handleChange = (e: any) =>{
        this.setState({
            [e.target.name]: e.target.value,
            searchCustomers: [],
            startSearch:false,
            errorMsg:null,
            customerSearchNotFocus:true
        })
    }

    goBack =() => {
        this.setState({ bck: true})
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let nme = this.validator.message('Name', this.state.name, 'required');
        let creditVal = this.validator.message('Credit Value', this.state.creditValue, 'required');
        let dayNum = this.validator.message('Day Number', this.state.dayNumber, 'required|integer');
        sessionStorage.setItem('isSubmitted', this.state.isSubmitted)
        let btnCss = "styled__StyledButton-sc-3yq204-0 eAtuhm styled__StyledButton-sc-1xjvulo-0 ilSwtV";

        return (
            <div>
                {this.state.bck && <Navigate to='/' state={{isSubmitted:this.state.isSubmitted}}/>}

                <ToastContainer />

                <GlobalStyles />

                <Box backgroundColor="secondary20" padding="xxLarge" className="box-top">
                    <Box marginBottom="xLarge">
                        <div className="arrow-link crs arrow-link-width" onClick={() => this.goBack()}><div className="arrow-icon-sz"><ArrowBackIcon className="arrow-icon-sz"/></div> <div className="arrow-txt ps-2">back</div></div>
                    </Box>
                    <H1>Add Allowance</H1>

                    <Panel header="Basic Information">
                        <Form noValidate onSubmit = {this.handleSubmit}>
                            <div className={(this.state.id !== null)?"read-only mb-4":"mb-4"}>
                                <FormGroup>
                                    <Input id="name" name="name" placeholder="Search customer by email or name"
                                           type="text" iconRight={(this.state.id === null)?<div className="input-group-text crs" onClick={() => this.autoSearch(this.state.nameTxt)}>
                                            <i className="fas fa-search"></i></div>:null}
                                           value={this.state.name} error={(nme !== undefined)?nme.props.children:null} required label="Name / Email"
                                           onChange={e => this.onChangeHandler(e.target.value)} readOnly={(this.state.id !== null)}/>
                                </FormGroup>

                                {(this.state.searchCustomers.length > 0)?<div className="search-usr-wrapper">
                                    {this.state.searchCustomers.map((result: any, i: number) =>
                                        <div key={i}>
                                            <div className="search-usr crs" onClick={() => this.onSearchHandler(result.first_name+" "+result.last_name, result.id)}>{result.first_name+" "+result.last_name}</div>
                                            <div className="search-usr crs" onClick={() => this.onSearchHandler(result.email, result.id)}>{result.email}</div>
                                        </div>
                                    )}
                                </div>:(this.state.startSearch)?<div className="search-usr crs text-center search-usr-wrapper"><Oval
                                        height={40}
                                        width={360}
                                        color="#3C64F4"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                        ariaLabel='oval-loading'
                                        secondaryColor="#8e919c"
                                        strokeWidth={2}
                                        strokeWidthSecondary={2}

                                    /></div>
                                    :(this.state.errorMsg !== null && !this.state.customerSearchNotFocus)?<div className="search-usr crs text-center search-usr-wrapper">{this.state.errorMsg}</div>:null}
                            </div>
                            <div className="mb-4">
                                <FormGroup>
                                    <Input id="creditValue" name="creditValue" placeholder="Credit value" type="number" value={this.state.creditValue} step="any" error={(creditVal !== undefined)?creditVal.props.children:null} required label="Credit Value" onChange={(e)=>this.handleChange(e)}/>
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <Input id="dayNumber" name="dayNumber" placeholder="Day number" type="number" value={this.state.dayNumber} error={(dayNum !== undefined)?dayNum.props.children:(this.dayNumMinMax !== null)?this.dayNumMinMax:null} required label="Day Number" onChange={(e)=>this.handleChange(e)}/>
                            </FormGroup>
                            <Box marginTop="xxLarge">
                                <ButtonGroup
                                    actions={[
                                        { text: 'Active', id: "active", type:"button", className:btnCss +this.state.activeStyle, onClick: () => this.allowanceAction("yes")},
                                        { text: 'Disabled', id: "non-active", type:"button", className:btnCss +this.state.nonActiveStyle, onClick: () => this.allowanceAction("no")},
                                    ]}
                                />
                            </Box>
                            <Box marginTop="xxLarge">
                                <Button type="submit" disabled={this.state.submitLoader}>{(this.state.submitLoader)?<ThreeDots
                                    height={42}
                                    width={60}
                                    color="#ffffff"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='three-dots-loading'
                                />:"Save rule"}</Button>
                            </Box>
                        </Form>
                    </Panel>
                </Box>
            </div>
        )
    }
}

export default () => (
    <AddEditCustomer params={useParams()} location={useLocation()} />
);
