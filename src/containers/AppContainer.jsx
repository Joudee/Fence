import React from 'react'
import {connect} from 'react-redux'
import DocumentTitle from 'react-document-title'
import {push} from 'redux-router'
import styles from './AppContainer.less'
import {Header} from '../components/Header'
import {Banner} from '../components/Banner'
import {Step} from '../components/Step'
import {Box} from '../components/Box'
import {Tab} from '../components/Tab'
import {Loading} from '../components/Loading'
import {TopBanner} from '../components/TopBanner'
import Choose from '../components/Choose'
import Import from '../components/Import'
import Pay from '../components/Pay'
import Rent from '../components/Rent'
import Map from '../components/Map'
import { getPrice,sendOrder } from '../action/index'
import { bindActionCreators } from 'redux'
import _ from 'underscore'
import axios from 'axios'
import moment from 'moment'

const operateArr = [{
		stamp:'+',
		icon:'zhalan',
		title:'Rent a Fence',
		describe:'If you wish to rent a fence, make this selection',
		button:'RENT',
		btEvent:'handleRent'
	},{
		stamp:'$',
		icon:'zhalan',
		title:'Purchase a Fence',
		describe:'If you wish to purchase a fence, make this selection',
		button:'PURCHASE',
		btEvent:'handlePurchase'
	},{
		stamp:'',
		icon:'icon-test',
		title:'Enter the Dimensions',
		describe:'If you know the fence dimensions, make this selection',
		button:'ENTER DIMENSIONS',
		btEvent:'handleChoose'
	},{
		stamp:'',
		icon:'pencil',
		title:'IMPORT the Dimensions',
		describe:"If you don't know the fence dimensions, make this selection",
		button:'IMPORT DIMENSIONS',
		btEvent:'handleDraw'
	}]
export function AppContainer(Component){
	const ManageContainer = React.createClass({
		getInitialState:function(){
			return{
				step : 0,
				operate : [operateArr[0],operateArr[1]],
				stepText : [{//步骤文案
					name : 'Step One',
					describe : 'Rent a fence or purchase a fence'
				},{
					name : 'Step Two',
					describe : 'Shop for fence dimensions'
				},{
					name : 'Step Three',
					describe : 'Fence payments'
				},{
					name : 'Step Four',
					describe : 'Thank you, your fence is on the way'
				}],
				rentStepText:[{//租赁时的步骤文案
					name : 'Step One',
					describe : 'Rent a fence or purchase a fence'
				},{
					name : 'Step Two',
					describe : ""
				},{
					name : 'Step Three',
					describe : 'Fence payments'
				},{
					name : 'Step Four',
					describe : 'Thank you, your fence is on the way'
				}],
				purchaseText:[{//需要配送时的步骤文案
					name : 'Step One',
					describe : 'Rent a fence or purchase a fence'
				},{
					name : 'Step Two',
					describe : "Shop for fence dimensions"
				},{
					name : 'Step Three',
					describe : 'Enter the fence installation location'
				},{
					name : 'Step Four',
					describe : 'Fence payments'
				},{
					name : 'Step Five',
					describe : 'Thank you, your fence is on the way'
				}],
				fenceType : '',
				operateType : '',
				purchaseList : [{
					"type": "DLY",
					"quantity": "1"
				}],
				purchaseCardPayInfo : {
					"firstName": "",
				    "lastName": "",
				    "phone": "",
				    "email": "",
				    "streetAddr": "",
				    "postal": "",
				    "city": "",
				    "province": "",
				    "paymentMethod": "C",   
				    "cardNo": "",
				    "token": "",
				    "commodity":{}
				},
				rentList : [{
					"type": "startFrom",
					quantity : moment()
				},{
					"type": "length",
					quantity : 0
				},{
					"type": "months",
					quantity : 0
				},{
					"type": "DSP",
					quantity : 1
				}],
				loadingStatus:false,
				scrollStatus : true,
				delivery : 'purchase',
				rental:0,
				hst:0,
				DSP:0,
				accessory:0,
				DLY:0,
				deliveryAddr:''
			}
		},
		handlePurchase:function(){
			console.log('handlePurchase')
			this.handleStep(1);
			this.setState({
				fenceType : 'purchase'
			})
		},
		handleRent:function(){
			console.log('handleRent')
			this.handleStep(1);
			this.setState({
				fenceType : 'rent'
			})
		},
		handleChoose:function(){
			console.log('handleChoose')
			this.handleStep(2);
			this.setState({
				operateType : 'choose'
			})
		},
		handleDraw:function(){
			console.log('handleDraw')
			this.handleStep(2);
			this.setState({
				operateType : 'draw'
			})
		},
		handleBack:function(){
			this.scrollToTop();
			this.setState({
				step : this.state.step - 1
			})
			this.handleStep(this.state.step - 1);
			if(this.state.step==1){
				this.resetChoose();
				this.resetRant();
			}
		},
		handleNext:function(){
			this.scrollToTop();
			if((this.state.step==2&&this.state.delivery!='purchase')||(this.state.step==3&&this.state.delivery=='purchase')){
				let that = this;
				let {purchaseList,rentList,purchaseCardPayInfo} = this.state;
				purchaseCardPayInfo.commodity = {
					type : this.state.fenceType=='purchase'?'P':'R',
					list : this.state.fenceType=='purchase'?purchaseList:rentList
				}
				purchaseCardPayInfo.deliveryAddr = this.state.deliveryAddr;
				if(this.state.fenceType=='purchase'){
					purchaseCardPayInfo.deliveryMethod = this.state.delivery == 'purchase'?'D':'P';
					purchaseCardPayInfo.deliveryAddr = this.state.delivery == 'purchase'?this.state.deliveryAddr:'';
				}else{
					if(purchaseCardPayInfo.deliveryMethod){
						delete purchaseCardPayInfo.deliveryMethod
					}
				}
				if(purchaseCardPayInfo.paymentMethod=='P'){
					purchaseCardPayInfo.cardNo = '';
					purchaseCardPayInfo.token = '';
					this.setState({
						purchaseCardPayInfo
					})
					console.log(purchaseCardPayInfo)
					let canPush = this.handleCheckInPerson(purchaseCardPayInfo);
					console.log(canPush)
					if(canPush){
						that.setState({
							loadingStatus:true
						})
						sendOrder(purchaseCardPayInfo,this.state.fenceType).then((data)=>{
							if(data){
								that.setState({
									step : that.state.step + 1
								})
								that.handleStep(that.state.step + 1);
							}else{
								alert('There’s something wrong, please try again!')
							}
							that.setState({
								loadingStatus:false
							})
						})
					}
				}else{
					let canPush = this.handleCheckInPerson(purchaseCardPayInfo);
					console.log(canPush)
					if(canPush){
						that.setState({
							loadingStatus:true
						})
						this.refs.pay.handlePay().then((data)=>{
							if(data.error){
								alert(data.error.code)
								that.setState({
									loadingStatus:false
								})
							}else{
								purchaseCardPayInfo.token = data.token.id;
								purchaseCardPayInfo.cardNo = data.token.card.last4;
								console.log(purchaseCardPayInfo)
								that.setState({
									loadingStatus:true
								})
								sendOrder(purchaseCardPayInfo,this.state.fenceType).then((data)=>{
									if(data){
										that.setState({
											step : that.state.step + 1
										})
										that.handleStep(that.state.step + 1);
									}else{
										alert('There’s something wrong, please try again!')
									}
									that.setState({
										loadingStatus:false
									})
									console.log(data)
								})
							}
						})
					}
				}
				
				
				console.log(purchaseCardPayInfo)
			}else{
				if(this.state.step==2&&this.state.delivery=='purchase'){
					if(this.state.deliveryAddr==''){
						alert('Please specify your delivery address.');
					}else{
						this.setState({
							step : this.state.step + 1
						})
						this.handleStep(this.state.step + 1);
					}
				}else{
					if(this.state.step==1){
						let {purchaseList,rentList,fenceType} = this.state;
						if(fenceType=='purchase'){
							let canPush = 0;
							purchaseList.map((v)=>{
								canPush += parseInt(v.quantity)
							})
							console.log(canPush)
							if(canPush==0){
								alert('Please select some fence before next step!')
							}else{
								this.setState({
									step : this.state.step + 1
								})
								this.handleStep(this.state.step + 1);
							}
						}else{
							let canPush = true;
							rentList.map((v)=>{
								if(v.quantity<1&&v.type=='length'){
									alert('Length can not be empty!')
									canPush = false;
								}
								if(v.quantity<1&&v.type=='months'){
									alert('Rental period can not be empty!')
									canPush = false;
								}
							})
							if(rentList.length!=4){
								canPush = false;
							}
							if(canPush){
								this.setState({
									step : this.state.step + 1
								})
								this.handleStep(this.state.step + 1);
							}
						}
					}else{
						this.setState({
							step : this.state.step + 1
						})
						this.handleStep(this.state.step + 1);
					}
				}
			}
		},
		handleCheckInPerson:function(data){//检查是否填写号码和邮箱
			if(data.phone.length==0||data.phone==''){
				alert('Phone number can not be empty!')
				return 0
			}
			if(data.email.length==0||data.email==''){
				alert('Email can not be empty!')
				return 0
			}
			let myreg =  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if(!myreg.test(data.email)){
				alert('Email address is not correct, please check it!')
				return 0
			}
			return 1
		},
		handleStep:function(step){
			switch(step){
				case 0:
					this.setState({
						step : 0,
						operate : [operateArr[0],operateArr[1]]
					})
					break;
				case 1:
					this.setState({
						step : 1
					})
					break;
				case 2:
					this.setState({
						step : 2
					})
					break;
			}
		},
		handleReset:function(){
			this.setState({
				step : 0
			})
			this.handleStep(0);
			this.resetChoose();
			this.resetRant();
		},
		handleSetBuy:function(type){
			// if(type!=this.state.fenceType){
			// 	this.setState({
			// 		fenceType : type,
			// 		step : 1
			// 	})
			// 	this.handleStep(1);
			// }
		},
		handleChoose:function(data){
			console.log(data)
		},
		handleSetPurchaseList:function(type,num){
			let purchaseList = this.state.purchaseList.concat([]);
			let index = _.findIndex(purchaseList, (v)=>{return v.type == type});
			if(index>-1){
				purchaseList[index] = {
					type,
					quantity : num!=''?num:0
				}
			}else{
				purchaseList.push({
					type,
					quantity : num!=''?num:0
				})
			}
			if(_.findIndex(purchaseList,(v)=>{return v.quantity==0})>-1){
				purchaseList.splice(_.findIndex(purchaseList,(v)=>{return v.quantity==0}),1);
			}
			console.log(purchaseList)
			this.setState({
				purchaseList
			})
		},
		handleSetPayWay:function(type){
			let purchaseCardPayInfo = this.state.purchaseCardPayInfo;
			purchaseCardPayInfo.paymentMethod = type;
			this.setState({
				purchaseCardPayInfo
			})
			console.log(purchaseCardPayInfo)
		},
		handleSetCardPay:function(key,value){
			let purchaseCardPayInfo = this.state.purchaseCardPayInfo;
			purchaseCardPayInfo[key] = value;
			this.setState({
				purchaseCardPayInfo
			})
			console.log(purchaseCardPayInfo)
		},
		handleSetRentInfo:function(type,num){
			let rentList = this.state.rentList.concat([]);
			let index = _.findIndex(rentList, (v)=>{return v.type == type});
			if(index>-1){
				rentList[index] = {
					type,
					quantity : num!=''?num:0
				}
			}else{
				rentList.push({
					type,
					quantity : num!=''?num:0
				})
			}
			console.log(rentList)
			this.setState({
				rentList
			})
		},
		resetPay:function(){
			let {purchaseList,rentList,purchaseCardPayInfo} = this.state;
			let commodity = {
				type : this.state.fenceType=='purchase'?'P':'R',
				list : this.state.fenceType=='purchase'?purchaseList:rentList
			};
			purchaseCardPayInfo.cardNo = '';
			purchaseCardPayInfo.token = '';
			purchaseCardPayInfo = {
				"firstName": "",
				"lastName": "",
				"phone": "",
				"email": "",
				"streetAddr": "",
				"postal": "",
				"city": "",
				"province": "",
				"paymentMethod": "C",   
				"cardNo": "",
				"token": "",
				"commodity":commodity
			}
			this.setState({
				purchaseCardPayInfo
			})
		},
		resetChoose:function(){
			this.setState({
				purchaseList:[{
					"type": "DLY",
					"quantity": "1"
				}]
			})
		},
		resetRant:function(){
			this.setState({
				rentList : [{
					"type": "startFrom",
					quantity : moment()
				},{
					"type": "length",
					quantity : 0
				},{
					"type": "months",
					quantity : 0
				},{
					"type": "DSP",
					quantity : 1
				}],
				delivery : 'purchase'
			})
		},
		handleScroll:function(e){
			let scrollTop = e.target.scrollTop;
			if(scrollTop==0){
				this.setState({
					scrollStatus : true
				})
			}else{
				if(this.state.scrollStatus){
					this.setState({
						scrollStatus : false
					})
				}
			}
		},
		scrollToTop:function(){
			this.refs.content.scrollTop = 0;
		},
		handleChangeDelvery:function(data){
			this.setState({
				delivery : data
			})
			if(data=='purchase'){
				this.handleSetPurchaseList('DLY',1)
			}else{
				this.handleSetPurchaseList('DLY',0)
			}
		},
		handleSetDeliveryAddr:function(data){
			this.setState({
				deliveryAddr : data
			})
		},
		resetMap:function(){
			this.setState({
				deliveryAddr : ''
			})
		},
		componentWillReceiveProps:function(next){
			console.log(next.price)
			if(next.price.data.length>0){
				this.setState({
		            hst : next.price.data[_.findIndex(next.price.data,(v)=>{return v.type == 'HST'})].price,
		            DSP : next.price.data[_.findIndex(next.price.data,(v)=>{return v.type == 'DSP'})].price,
		            rental : next.price.data[_.findIndex(next.price.data,(v)=>{return v.type == 'R'})].price,
		            accessory : next.price.data[_.findIndex(next.price.data,(v)=>{return v.type == 'A'})].price,
		            DLY : next.price.data[_.findIndex(next.price.data,(v)=>{return v.type == 'DLY'})].price
		        })
			}
		},
		componentDidMount:function(){
			this.props.getPrice();
		},
		render: function() {
			return (
				<DocumentTitle title="Fence outlet|The best of fence outlet in Canada">
					<div className={styles.root} ref='content' onScroll={this.handleScroll}>
						<TopBanner step={this.state.step} scrollStatus={this.state.scrollStatus}  handleReset={this.handleReset}></TopBanner>
						<Header step={this.state.step}></Header>
						<Banner step={this.state.step}></Banner>
						<div className='step-bt'>
							<Tab fenceType={this.state.fenceType} step={this.state.step} handleSetBuy={this.handleSetBuy}></Tab>
							<Step 
								step={this.state.step} 
								stepText={this.state.stepText} 
								rentStepText={this.state.rentStepText} 
								fenceType={this.state.fenceType} 
								operateType={this.state.operateType}
								delivery={this.state.delivery}
								purchaseText={this.state.purchaseText}></Step>
							<button className='restart-bt' onClick={this.handleReset} style={{display:(this.state.step==3&&this.state.delivery!='purchase')||(this.state.step==4&&this.state.delivery=='purchase')?'block':'none'}}>START OVER</button>
						</div>
						<div className='operate-box'>
							{
								this.state.operate.map((v,k)=>{
									return <Box 
											key={k}
											data={v} 
											handlePurchase={this.handlePurchase}
											handleRent={this.handleRent}
											handleChoose={this.handleChoose}
											handleDraw={this.handleDraw}
											step={this.state.step}
											fenceType={this.state.fenceType}></Box>
								})
							}
							<Choose 
								handleChoose={this.handleChoose}
								{...this.props}
								step={this.state.step}
								operateType={this.state.operateType}
								fenceType={this.state.fenceType}
								purchaseList={this.state.purchaseList}
								handleSetPurchaseList={this.handleSetPurchaseList}
								handleChangeDelvery={this.handleChangeDelvery}
								delivery={this.state.delivery}></Choose>
							<Import 
								step={this.state.step}
								operateType={this.state.operateType}
								fenceType={this.state.fenceType}></Import>
							<Pay 
								ref='pay'
								step={this.state.step}
								operateType={this.state.operateType}
								fenceType={this.state.fenceType}
								handleSetCardPay={this.handleSetCardPay}
								handleSetPayWay={this.handleSetPayWay}
								resetPay={this.resetPay}
								delivery={this.state.delivery}
								{...this.props}
								rentList={this.state.rentList}
								purchaseList={this.state.purchaseList}
								hst={this.state.hst}
								DSP={this.state.DSP}
								rental={this.state.rental}
								accessory={this.state.accessory}
								DLY={this.state.DLY}></Pay>
							<Rent
								ref='rent'
								{...this.props}
								step={this.state.step}
								fenceType={this.state.fenceType}
								handleSetRentInfo={this.handleSetRentInfo}
								handleChangeDelvery={this.handleChangeDelvery}
								delivery={this.state.delivery}></Rent>
							<Map
								step={this.state.step}
								delivery={this.state.delivery}
								handleSetDeliveryAddr={this.handleSetDeliveryAddr}
								resetMap={this.resetMap}></Map>
						</div>
						<div className='step-bt' style={{display:this.state.step==1||this.state.step==2||(this.state.step==3&&this.state.delivery=='purchase')?'block':'none'}}>
							<button className='progress' onClick={this.handleNext}><i className="iconfont icon-zhixiangyou"></i><span>Next</span></button>
							<button className='progress' onClick={this.handleBack}><i className="iconfont icon-zhixiangzuo"></i><span>Back</span></button>
						</div>
						<Loading loadingStatus={this.state.loadingStatus}></Loading>
					</div>
				</DocumentTitle>
			)
		}
	})

	ManageContainer.defaultProps = {
		
	}

	function mapStateToProps(state) {
		return {
			route:state.getIn(['route']),
			price : state.getIn(['price'])
		}
	}

	function mapDispatchToProps(dispatch) {
		return {
			getPrice:bindActionCreators(getPrice,dispatch),
		}
	}
	return connect(mapStateToProps, mapDispatchToProps)(ManageContainer)
}
