import React from 'react'
import styles from './index.less'

export function Banner(props){
    return (
        <ul className={styles.root} style={{display:props.step==0?'block':'none'}}>
            <li>
                <i className="iconfont icon-wxbdingwei"></i>
                <span>Location</span>
            </li>
            <li>
                <i className="iconfont icon-pencil"></i>
                <span>Fence length and time length</span>
            </li>
            <li>
                <i className="iconfont icon-zhalan"></i>
                <span>Rapid Installment</span>
            </li>
        </ul>
    )
}