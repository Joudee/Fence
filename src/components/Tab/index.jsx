import React from 'react'
import styles from './index.less'

export function Tab(props){
    return (
        <div className={styles.root} style={{display:props.step==0?'none':'block'}}>
        	<ul>
                <li className={props.fenceType=='purchase'?'on':''} onClick={props.handleSetBuy.bind(null,'purchase')}>BUY A FENCE</li>
                <li className={props.fenceType=='rent'?'on':''} onClick={props.handleSetBuy.bind(null,'rent')}>RENT A FENCE</li>
            </ul>
        </div>
    )
}