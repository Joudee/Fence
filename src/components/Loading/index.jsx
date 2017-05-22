import React from 'react'
import styles from './index.less'

export function Loading(props){
    return (
        <div className={styles.root} style={props.loadingStatus?{display:'block'}:{display:'none'}}>
            <div></div>
            <div></div>
        </div>
    )
}