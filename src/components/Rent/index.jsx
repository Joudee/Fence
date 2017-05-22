import React from 'react'
import styles from './index.less'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import _ from 'underscore'
import {Delivery} from '../Delivery'

function getCursortPosition(element) {//获取光标位置
    var CaretPos = 0;
    if (document.selection) {//支持IE
        element.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -element.value.length);
        CaretPos = Sel.text.length;
    }
    else if (element.selectionStart || element.selectionStart == '0'){
        CaretPos = element.selectionStart;
    }   
    return CaretPos
}

export default class MyComponent extends React.Component{
  	constructor(props) {
    	super(props)
        this.state = {
            total : 0,
            startDate : moment(),
            hst : 0,
            DSP : 0,
            rental : 0,//租金
            tenancy : 0,//租期
            length : 0//尺寸
        }
  	}
    handleChange(date){
        console.log(moment(date).format('YYYY-MM-DD'))
        this.setState({
            startDate : date
        })
        this.props.handleSetRentInfo('startFrom',date)
    }
    handleLength(e){
        let total = e.target.value * this.state.rental * (this.state.tenancy>3?3:this.state.tenancy);
        //total = parseFloat(total*(1 + this.state.hst)).toFixed(2);
        let length = e.target.value.length>0?e.target.value:0;
        this.setState({
            total,
            length
        })
        this.props.handleSetRentInfo('length',length)
    }
    handleMonth(e){
        let total = (e.target.value>3?3:e.target.value) * this.state.rental * this.state.length;
        //total = parseFloat(total*(1 + this.state.hst)).toFixed(2);
        let tenancy = e.target.value.length>0?e.target.value:0;
        this.setState({
            total,
            tenancy
        })
        this.props.handleSetRentInfo('months',tenancy)
    }
    handleKeyDown(e){
        let keyCode = e.keyCode;
        if((keyCode<48||(keyCode>57&&keyCode<96)||keyCode>105)&&keyCode!=8&&(keyCode<37||keyCode>40)&&keyCode!=9){//只能按数字键、删除键、方向键、tab键
            e.preventDefault();
        }
        if(e.target.value==''&&keyCode==48){
            e.preventDefault();
        }
        if(keyCode==48&&getCursortPosition(e.target)==0){
            e.preventDefault();
        }
    }
    resetState(){
        this.setState({
            total : 0,
            startDate : moment(),
            hst : 0,
            DSP : 0,
            rental : 0,
            tenancy : 0,
            length : 0
        })
        this.refs.length.value = '';
        this.refs.month.value = '';
    }
    componentWillReceiveProps(next){
        if(next.price.data.length>0){
            this.setState({
                hst : next.price.data[_.findIndex(next.price.data,(v)=>{return v.type == 'HST'})].price,
                DSP : next.price.data[_.findIndex(next.price.data,(v)=>{return v.type == 'DSP'})].price,
                rental : next.price.data[_.findIndex(next.price.data,(v)=>{return v.type == 'R'})].price
            })
        }
        if(next.step==0){
            this.resetState();
        }
    }
  	render(){
    	return (
      		<div className={styles.root} style={{display:this.props.step==1&&this.props.fenceType!='purchase'?'block':'none'}}>
                <h1>Rent Details</h1>
                <ul className='input'>
                    <li>
                        <span className='name'>Rental Fee:</span>
                        <a className='rental-a'>${this.state.rental}</a>
                        <b>per feet per month</b>
                    </li>
                    <li>
                        <span className='name'>Fence length:</span>
                        <input ref='length' onKeyDown={this.handleKeyDown.bind(this)} onChange={this.handleLength.bind(this)}/>
                        <b>Feet</b>
                        <span className='star'>*</span>
                    </li>
                    <li>
                        <span className='name'>Rental period:</span>
                        <input ref='month' onKeyDown={this.handleKeyDown.bind(this)} onChange={this.handleMonth.bind(this)}/>
                        <b>Month</b>
                        <span className='star'>*</span>
                        <p>(If more than 3 months, the first three months rental fee is due at the first payment.)</p>
                    </li>
                    <li>
                        <span className='name'>Start from:</span>
                        <DatePicker
                            minDate={moment()}
                            dateFormat="YYYY-MM-DD"
                            selected={this.state.startDate}
                            onChange={this.handleChange.bind(this)}
                        />
                    </li>
                </ul>
                {/**<h1>Order Summary</h1>
                                <ul className='summary'>
                                    <li>
                                        <span></span>
                                        <span>LENGTH</span>
                                        <span>PRICE</span>
                                        <span>TENANCY</span>
                                        <span>TOTAL</span>
                                    </li>
                                    <li>
                                        <span>Fence Panels Rentals</span>
                                        <span>{this.state.length}</span>
                                        <span>{this.state.rental}</span>
                                        <span>{this.state.tenancy}</span>
                                        <span>{this.state.tenancy*this.state.rental*this.state.length}</span>
                                    </li>
                                    <li>
                                        <span>DELIVERY AND SETUP PICKUP</span>
                                        <span></span>
                                        <span></span>
                                        <span>{this.state.DSP}</span>
                                    </li>
                                </ul>
                <div className='delivery'>
                    <span>Delivery and install</span>
                    <span>${this.state.DSP}</span>
                </div>
                <div className='hsl'>
                    <span>HST on Sales</span>
                    <span>{this.state.hst*100}%</span>
                </div>**/}
                <div className='total'>
                    <span>TOTAL</span>
                    <span>${this.state.total}</span>
                </div>
      		</div>
    	)
  	}
}