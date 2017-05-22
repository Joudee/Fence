import React from 'react'
import styles from './index.less'

export function Step(props){
    let stepText = props.delivery=='purchase'?props.purchaseText:props.stepText;
    let purdescribe = stepText[props.step].describe;
    console.log(purdescribe)
    return (
        <div className={styles.root}>
            <h1>{stepText[props.step].name}</h1>
            {
                props.delivery=='purchase'?(
                    props.step==4?(
                        <div>
                            <p className='big'>{purdescribe.split(',')[0]},</p>
                            <p className='big'>{purdescribe.split(',')[1]}</p>
                        </div>
                            
                    ):(
                        <p>{props.step==1&&props.fenceType=='rent'?'':purdescribe}</p>
                    )
                ):(
                    props.step==3?(
                        <div>
                            <p className='big'>{purdescribe.split(',')[0]},</p>
                            <p className='big'>{purdescribe.split(',')[1]}</p>
                        </div>
                            
                    ):(
                        <p>{props.step==1&&props.fenceType=='rent'?'':purdescribe}</p>
                    )
                )
            }
        </div>
    )
}