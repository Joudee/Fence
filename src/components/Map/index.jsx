import React from 'react'
import styles from './index.less'

let geocoder,
	map,
	autocomplete,
	marker,
	uluru;

export default class MyComponent extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			location : ''
		}
	}
	mapInitialize(){
		geocoder = new google.maps.Geocoder();
		uluru = {lat: 43.7184038, lng: -79.518139};
		map = new google.maps.Map(this.refs.map, {
          	zoom: 10,
          	center: uluru
        });
    }
    handleSearch() {
    	let that = this;
	    var address = this.refs.input.value;
	    geocoder.geocode( { 'address': address}, function(results, status) {
	      	if (status == 'OK') {
	        	that.setLocation(results[0].geometry.location);
	      	} else {
	        	alert('Geocode was not successful for the following reason: ' + status);
	      	}
	    });
  	}
  	setLocation(location){
  		map.setCenter(location);
	    map.setZoom(16);
		marker = new google.maps.Marker({
		    map: map,
		    position: location
	    });
  	}
    handleChange(e){
    	this.props.handleSetDeliveryAddr(e.target.value)
    }
    handleKeyDown(e){
    	if(e.keyCode==13){
    		this.handleSearch();
    	}
    }
    fillInAddress(){
    	let place = autocomplete.getPlace();
    	this.setLocation(place.geometry.location);
    	this.props.handleSetDeliveryAddr(this.refs.input.value)
    }
    resetState(){
    	this.setState({
    		location : ''
    	})
    	map.setCenter(uluru);
	    map.setZoom(10);
	    this.refs.input.value = '';
	    this.props.resetMap();
    }
    componentWillReceiveProps(next){
    	if((next.step!=2&&map&&this.props.step==2&&next.delivery=='purchase'&&next.step<this.props.step)||(next.step==0&&this.props.step==4&&next.delivery=='purchase')){
            this.resetState();
        }
    }
	componentDidMount(){
		let input = this.refs.input;
		let options = {
			types: ['geocode']
		};
		autocomplete = new google.maps.places.Autocomplete(input, options);
		autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
        google.maps.event.addDomListener(window, 'load', this.mapInitialize.bind(this));
    }
	render(){
    	return(
			<div className={styles.root} style={this.props.step==2&&this.props.delivery=='purchase'?{opacity:1}:{opacity:0,position:'fixed',top:0,zIndex:-1}}>
				<div className='enter'>
					<input placeholder='Enter location' ref='input' onChange={this.handleChange.bind(this)}/>
					<i onClick={this.handleSearch.bind(this)} className="iconfont icon-icon-test"></i>
				</div>
				<div id='map' className='map' ref='map'></div>
			</div>
		)
	}
}