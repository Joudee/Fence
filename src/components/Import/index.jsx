import React from 'react'
import styles from './index.less'

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
            price : 10,//单价
            total : 0,//总价
            number : 0,//每个尺寸对应的价格
            values : 0,//每个输入框对应的数值
            hsl : 13
        }
  	}
    handleChange(e){
        let  total = e.target.value * this.state.price;
        this.setState({
            total
        })
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
  	render(){
    	return (
      		<div className={styles.root} style={{display:this.props.step==2&&this.props.operateType=='draw'&&this.props.fenceType!='rent'?'block':'none'}}>
                <div className='thead'>SIZE</div>
                <div className='thead'>PRICE</div>
                <div className='thead'>QUANTITY</div>
                <ul>
                    <li>
                        <div className='mould'>
                            <input 
                                onKeyDown={this.handleKeyDown.bind(this)}
                                onChange={this.handleChange.bind(this)}/>
                        </div>
                        <div className='price'>$</div>
                        <div className='quantity'>
                            <input 
                                onKeyDown={this.handleKeyDown.bind(this)}
                                onChange={this.handleChange.bind(this)}/>
                        </div>
                    </li>
                </ul>
                <div className='hsl'>
                    <span>HSL on Sales</span>
                    <span>{this.state.hsl}%</span>
                </div>
                <div className='total'>
                    <span>TOTAL</span>
                    <span>${this.state.total}</span>
                </div>
      		</div>
    	)
  	}
}