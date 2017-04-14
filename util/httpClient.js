'use strict';

const request = require('request');

exports.get = function (url, params){

	return new Promise(function(resolve, reject){
		let options = {
			url: url,
			method: 'GET',
			qs: params,
			headers: { 
				'Content-Type': 'application/json; charset=utf-8',
			},
			json: true,
			timeout: 10000
		}
		request(options, function(err, res, body){
			if(err){
				reject(err);	
			}else{
				resolve(body);
			}
		});	
	});
}