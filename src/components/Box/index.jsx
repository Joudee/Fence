import React from 'react'
import styles from './index.less'

export function Box(props){
    return (
        <div className={styles.root} style={{display:props.step==0?'block':'none'}}>
        	<span>{props.data.stamp}</span>
        	<span>{props.data.stamp}</span>
        	<span>{props.data.stamp}</span>
            <i className={`iconfont icon-${props.data.icon}`}></i>
            <h1>{props.data.title}</h1>
            <p>{props.data.describe}</p>
            <button onClick={props[props.data.btEvent]}>{props.data.button}</button>
        </div>
    )
}