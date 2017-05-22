import React from 'react'
import styles from './index.less'
import fence from '../../public/images/fence.jpeg'
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
            moulds : [],
            total : 0,//总价
            number : [0,0,0,0],//每个尺寸对应的价格
            values : [0,0,0,0],//每个输入框对应的数值
            hst : 0
        }
  	}
    handleChange(key,type,e){
        let number = this.state.number.concat([]),
            values = this.state.number.concat([]),
            total = 0;
        if(isNaN(e.target.value)){
            e.target.value = values[key];
        }else{
            number[key] = Number(this.props.price.data[key].price)*e.target.value;
            number.map((v)=>{
                total += v;
            })
            values[key] = e.target.value;
            this.setState({
                number,
                total,
                values
            })
            this.props.handleSetPurchaseList(type,e.target.value);
        }
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
            moulds : [],
            total : 0,//总价
            number : [0,0,0,0],//每个尺寸对应的价格
            values : [0,0,0,0]//每个输入框对应的数值
        })
        Array.prototype.map.call(this.refs.ul.getElementsByTagName('input'),(v,k)=>{
            v.value = '';
        })
    }
    componentWillReceiveProps(next){
        if(next.price.data.length>0&&this.state.moulds.length==0){
            let moulds = [];
            next.price.data.map((v,k)=>{
                if(v.description.indexOf('fence')>-1){
                    moulds.push({
                        description : v.description,
                        price : v.price,
                        type : v.type
                    })
                }
                if(v.type=='A'){
                    moulds.push({
                        description : v.description,
                        price : v.price,
                        type : v.type
                    })
                }
            })
            this.setState({
                hst : _.find(next.price.data,(v)=>{return v.type == 'HST'}).price,
                moulds
            })
        }
        if(next.step==0){
            this.resetState();
        }
    }
  	render(){
    	return (
      		<div className={styles.root} style={{display:this.props.step==1&&this.props.fenceType!='rent'?'block':'none'}}>
                <h1>Delivery method</h1>
                <Delivery 
                    handleChangeDelvery={this.props.handleChangeDelvery}
                    delivery={this.props.delivery}></Delivery>
                <div className='thead'>QUANTITY</div>
                <div className='thead'>PRICE/UNIT</div>
                <ul ref='ul'>
                    {
                        this.state.moulds.map((v,k)=>{
                            if(k<4){
                                return(
                                    <li key={k}>
                                        <div className='mould' style={{background:'url('+fence+') center'}}>{v.description}</div>
                                        <div className='price'>${v.price}</div>
                                        <div className='quantity'>
                                            <input 
                                                onKeyDown={this.handleKeyDown.bind(this)}
                                                onChange={this.handleChange.bind(this,k,v.type)}/>
                                        </div>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
                {/*<div className='hsl'>
                                    <span>HST on Sales</span>
                                    <span>{this.props.price.data.length>0?this.props.price.data[_.findIndex(this.props.price.data,(v)=>{return v.type == 'HST'})].price*100:0}%</span>
                                </div>*/}
                <div className='total'>
                    <span>TOTAL</span>
                    <span>${this.state.total}</span>
                </div>
      		</div>
    	)
  	}
}