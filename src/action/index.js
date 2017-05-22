import config from '../config'
import axios from 'axios'

// let data = {
// 	retCode: "0",
// 	data: [{
// 		id: 1,
// 		price: 70,
// 		update_time: "2017-04-23 15:52:56",
// 		status: "A",
// 		commodity_type: "P",
// 		description: "6x8 fence",
// 		create_time: "2017-04-23 15:52:52",
// 		type: "P1"
// 	},
// 	{
// 		id: 2,
// 		price: 80,
// 		update_time: "2017-04-23 15:53:19",
// 		status: "A",
// 		commodity_type: "P",
// 		description: "6x10 fence",
// 		create_time: "2017-04-23 15:53:16",
// 		type: "P2"
// 	},
// 	{
// 		id: 3,
// 		price: 90,
// 		update_time: "2017-04-23 15:53:36",
// 		status: "A",
// 		commodity_type: "P",
// 		description: "6x12 fence",
// 		create_time: "2017-04-23 15:53:34",
// 		type: "P3"
// 	},
// 	{
// 		id: 4,
// 		price: 30,
// 		update_time: "2017-04-23 15:53:54",
// 		status: "A",
// 		commodity_type: "P",
// 		description: "Accessory",
// 		create_time: "2017-04-23 15:53:51",
// 		type: "A"
// 	},
// 	{
// 		id: 5,
// 		price: 0.5,
// 		update_time: "2017-04-24 18:33:15",
// 		status: "A",
// 		commodity_type: "R",
// 		description: "Rental price",
// 		create_time: "2017-04-24 18:33:14",
// 		type: "R"
// 	},
// 	{
// 		id: 6,
// 		price: 0.13,
// 		update_time: "2017-04-25 16:11:09",
// 		status: "A",
// 		commodity_type: "H",
// 		description: "HST",
// 		create_time: "2017-04-25 16:11:07",
// 		type: "HST"
// 	},
// 	{
// 		id: 7,
// 		price: 300,
// 		update_time: "2017-04-25 16:14:52",
// 		status: "A",
// 		commodity_type: "R",
// 		description: "Delivery and setup pickup",
// 		create_time: "2017-04-25 16:14:50",
// 		type: "DSP"
// 	},
// 	{
// 		id: 8,
// 		price: 60,
// 		update_time: "2017-05-18 23:34:21",
// 		status: "A",
// 		commodity_type: "P",
// 		description: "Delivery",
// 		create_time: "2017-05-18 23:34:18",
// 		type: "DLY"
// 	}]
// }

export function getPrice(){
	return (dispatch) => {
		axios({
			method: 'get',
			url: ctx+ '/queryPrice'
		})
		.then((res)=>{
			if(res.status==200){
				dispatch({
		            type: 'PRICE',
		            data:res.data
		        })
			}
		})
		// dispatch({
		//     type: 'PRICE',
		//     data
		// })
    }
}

export function sendOrder(purchaseCardPayInfo,type){
	return new Promise((res,rej)=>{
		axios({
			method: 'post',
			url: ctx + (type=='rent'?'/order/rental':'/order/purchase'),
			data: purchaseCardPayInfo
		})
		.then((response)=>{
			if(response.status==200){
				if(response.data.retCode==0||response.data.retCode=='0'){
					res(1);
				}else{
					alert(response.data.retMsg);
				}
			}
		})
		.catch(function (error) {
		    res(0);
		});
	})
}