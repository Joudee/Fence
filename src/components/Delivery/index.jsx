import React from 'react'
import styles from './index.less'

export function Delivery(props){
	return(
		<div className={styles.root}>
			<label onClick={props.handleChangeDelvery.bind(null,'purchase')}><span className={props.delivery=='purchase'?'on':''}></span><input name="purchase" type="radio" value="" defaultChecked={props.delivery=='purchase'?true:false}/>Delivery to the property</label> 
			<label onClick={props.handleChangeDelvery.bind(null,'pick')}><span className={props.delivery!='purchase'?'on':''}></span><input name="pick" type="radio" value="" defaultChecked={props.delivery!='purchase'?true:false}/>Pick up on you own</label> 
		</div>
	)
}