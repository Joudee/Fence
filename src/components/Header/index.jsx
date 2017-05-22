import React from 'react'
import styles from './index.less'
import map from '../../public/images/map.jpeg'
import logo from '../../public/images/logo.png'

export function Header(props){
    return (
        <div className={styles.root} style={{background:'url('+map+') center',display:props.step==0?'block':'none'}}>
            <div className='bg'></div>
            <div className='content'>
                <div className='logo'>
                    <img src={logo}/>
                    <span>FENCE OUTLET</span>
                </div>
                <div className='login'>
                    <span>LOG IN</span>
                </div>
                <h1>The simplest way to install a fence</h1>
                <p>Rent or buy fences anytime, anywhere with GPS location precision</p>
                <button>SIGN UP</button>
            </div>
        </div>
    )
}