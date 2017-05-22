import React from 'react'
import styles from './index.less'

export function TopBanner(props){
    return (
        <div className={styles.root} style={{display:props.step!=0?'block':'none',top:props.scrollStatus?0:'-58px'}}>
        	<div className='home-container'>
        		<div className='home' onClick={props.handleReset}>
	        		<i className="iconfont icon-homepage"></i>
	        		<span className='home'>Home</span>
	        	</div>
	        	<i className="iconfont icon-touxiang"></i>
	        	{/**<span className='logout'>LOG OUT</span>
	        		        	<span className='name'>Jack</span>**/}
        	</div>
        </div>
    )
}