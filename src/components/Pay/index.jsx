import React from 'react'
import styles from './index.less'
import fence from '../../public/images/fence.jpeg'
import '../../utils/stripe.js'
import _ from 'underscore'
import config from '../../config'

let stripe = Stripe(config.key);
let elements = stripe.elements();

let card = elements.create('card', {
          style: {
            base: {
              iconColor: '#666EE8',
              color: '#31325F',
              lineHeight: '60px',
              fontWeight: 300,
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSize: '15px',
              paddingLeft:'12px',

              '::placeholder': {
                color: '#CFD7E0',
              },
            },
          }
        });

export default class MyComponent extends React.Component{
  	constructor(props) {
    	super(props)
        this.state = {
            checkOn : 0
        }
  	}
    handleTab(checkOn){
        this.setState({
            checkOn
        })
        let type = checkOn?'P':'C';
        this.props.handleSetPayWay(type);
    }
    handleResult(result){
        console.log(result)
    }
    handlePay(){
        return new Promise((res,rej)=>{
            stripe.createToken(card).then((result)=>{
                res(result)
            });
        })
        
    }
    handleKeyDown(e){
        let keyCode = e.keyCode;
        if((keyCode<48||(keyCode>57&&keyCode<96)||keyCode>105)&&keyCode!=8&&(keyCode<37||keyCode>40)&&keyCode!=9){//只能按数字键、删除键、方向键、tab键
            e.preventDefault();
        }
    }
    handleFirstName(key,e){
        this.props.handleSetCardPay(key,e.target.value);
    }
    resetState(){
        this.setState({
            checkOn : 0
        })
        Array.prototype.map.call(this.refs.payWay.getElementsByTagName('input'),(v,k)=>{
            v.value = '';
        })
        card.unmount();
        card.mount('#card-element');
    }
    getRentalTotal(length,month){
        return parseFloat((this.props.rental*length*month + this.props.DSP)*(1+this.props.hst)).toFixed(2);
    }
    getFenceFee(){
        let purchaseList = this.props.purchaseList.concat([]),
            price = this.props.price.data,
            totle = 0;
        console.log(purchaseList)
        if(price.length>0){
            purchaseList.map((v)=>{
                if(v.type!='A'&&v.type!='DLY'){
                    totle += parseInt(v.quantity)*price[_.findIndex(price,(v1)=>{return v1.type == v.type})].price
                }
            })
        }
        return totle
    }
    getPurchaseTotal(accessory){
        let totle = this.getFenceFee(),
            delivery = this.props.delivery=='purchase'?this.props.DLY:0;

        totle = (delivery + totle + accessory)*(1 + this.props.hst);
        return parseFloat(totle).toFixed(2);
    }
    componentDidMount(){
        card.mount('#card-element');
    }
    componentWillReceiveProps(next){
        if((next.step!=2&&this.props.step==2&&next.delivery != 'purchase')||(next.step!=3&&this.props.step==3&&next.delivery == 'purchase')){
            this.resetState();
            this.props.resetPay();
        }
    }
  	render(){
        let length = this.props.rentList[_.findIndex(this.props.rentList,(v)=>{return v.type == 'length'})].quantity,
            month = this.props.rentList[_.findIndex(this.props.rentList,(v)=>{return v.type == 'months'})].quantity;
        let isFirstThreeM = month>3;
        month = month>3?3:month;
        let accessory = _.findIndex(this.props.purchaseList,(v)=>{return v.type == 'A'})>-1&&this.props.purchaseList[_.findIndex(this.props.purchaseList,(v)=>{return v.type == 'A'})].quantity>0?this.props.purchaseList[_.findIndex(this.props.purchaseList,(v)=>{return v.type == 'A'})].quantity:false;
    	return (
      		<div className={styles.root} style={{display:(this.props.step==2&&this.props.delivery!='purchase')||(this.props.step==3&&this.props.delivery=='purchase')?'block':'none'}}>
                <div className='order-summary'>
                    <h1>Order Summary</h1>
                    {
                        this.props.fenceType=='rent'?(
                            <ul>
                                <li>
                                    <span>Rental fee{isFirstThreeM?' for the first three months':''}:</span>
                                    <p>${this.props.rental*length*month}</p>
                                    <div>(If more than 3 months, the first three months rental fee is due at the first payment.)</div>            
                                </li>
                                <li>
                                    <span>Delivery, setup and pickup:</span>
                                    <p>${this.props.DSP}</p>
                                    <div>(Additional charge may apply if outside GTA)</div>
                                </li>
                                <li>
                                    <span>Hst on sales:</span>
                                    <p>{this.props.hst*100}%</p>
                                </li>
                                <li>
                                    <span>Total{isFirstThreeM?' due now':''}:</span>
                                    <p>${this.getRentalTotal(length,month)}</p>
                                </li>
                            </ul>
                        ):(
                            <ul>
                                <li>
                                    <span>Fence fee:</span>
                                    <p>${this.getFenceFee()}</p>
                                </li>
                                <li style={{display:accessory?'block':'none'}}>
                                    <span>Accessory fee:</span>
                                    <p>${this.props.accessory*accessory}</p>
                                </li>
                                <li style={{display:this.props.delivery=='purchase'?'block':'none'}}>
                                    <span>Delivery fee:</span>
                                    <p>${this.props.DLY}</p>
                                </li>
                                <li>
                                    <span>HST on sales:</span>
                                    <p>{this.props.hst*100}%</p>
                                </li>
                                <li>
                                    <span>Total:</span>
                                    <p>${this.getPurchaseTotal(accessory?this.props.accessory*accessory:0)}</p>
                                </li>
                            </ul>
                        )
                    }
                </div>
                <div className='pay-way' ref='payWay'>
                    <div className='pay-tab'>
                        <div onClick={this.handleTab.bind(this,0)} className={this.state.checkOn?'':'on'}>Credit Card</div>
                        <div onClick={this.handleTab.bind(this,1)} className={!this.state.checkOn?'':'on'}>In Person</div>
                    </div>
                    <div className='card-content' style={this.state.checkOn?{display:'none'}:{display:'block'}}>
                        {/**<input className='card-number' placeholder='Card Number'/>
                                                <div className='complex-input'>
                                                    <span>EXP MONTH</span>
                                                    <input/>
                                                </div>
                                                <div className='complex-input'>
                                                    <span>EXP YEAR</span>
                                                    <input/>
                                                </div>
                                                <input className='cvc' placeholder='CVC'/>
                                                <div className='clear'></div>**/}
                        <div id="card-element" ref='field' className="field"></div>
                        <h1>Billing Information</h1>
                        <input className='name first-name' placeholder='First Name' onChange={this.handleFirstName.bind(this,'firstName')}/>
                        <input className='name' placeholder='Last Name' onChange={this.handleFirstName.bind(this,'lastName')}/>
                        <input className='card-number' onKeyDown={this.handleKeyDown.bind(this)} placeholder='Phone' onChange={this.handleFirstName.bind(this,'phone')}/>
                        <span className='star phone-star'>*</span>
                        <input className='card-number' placeholder='Email Address' onChange={this.handleFirstName.bind(this,'email')}/>
                        <span className='star email-star'>*</span>
                        <input className='card-number' placeholder='Street Address' onChange={this.handleFirstName.bind(this,'streetAddr')}/>
                        <input className='location' placeholder='Postal Code' onChange={this.handleFirstName.bind(this,'postal')}/>
                        <input className='location clty' placeholder='City' onChange={this.handleFirstName.bind(this,'city')}/>
                        <input className='location' placeholder='Province' onChange={this.handleFirstName.bind(this,'province')}/>
                    </div>
                    <div className='card-content' style={!this.state.checkOn?{display:'none'}:{display:'block'}}>
                        {/*<h2>Pick Up</h2><p>88 Hunt Avenue Richmond Hill, ON L4C 4G9</p>*/}
                        <input className='name first-name' placeholder='First Name' onChange={this.handleFirstName.bind(this,'firstName')}/>
                        <input className='name' placeholder='Last Name' onChange={this.handleFirstName.bind(this,'lastName')}/>
                        <input className='card-number' onKeyDown={this.handleKeyDown.bind(this)} placeholder='Phone' onChange={this.handleFirstName.bind(this,'phone')}/>
                        <span className='star email-star'>*</span>
                        <input className='card-number' placeholder='Email Address' onChange={this.handleFirstName.bind(this,'email')}/>
                        <span className='star email-star'>*</span>
                        <div className='clear'></div>
                        {/*<input className='check' type='checkbox'/>
                                                <span className='describe'>I wish to pick up this item</span>*/}
                    </div>
                </div>
                <div className='preview' style={{background:'url('+fence+') center'}}></div>
      		</div>
    	)
  	}
}