$(function(){

	loadData();

	$(".dropdown-menu li a").on("click",function(){
		var searchType = $(this).attr("search-type");
		$("#searchBox").attr("data-searchBy",searchType);
		$("#searchbyText").text(searchType.toUpperCase());
	});

	$(".js-search").on("click",function(){
		var q = $("#searchBox").val();
		var searchType = $("#searchBox").attr("data-searchBy");
		customSearch(q,searchType);
	});

	$(document).on("click",".info-icon",function(){
		var _this = $(this);
		var objCurrInfo = _this.attr("data-key");
		//showModal(JSON.parse(decodeURIComponent(objCurrInfo)));
		showModal(JSON.parse(objCurrInfo));
	});

});


function showModal(_obj){
	var _modal = $("#countryModal");
	_modal.find(".modal-title").text(_obj.name);
	_modal.find(".modal-header img").attr("src",_obj.flag);
	
	_modal.find(".modal-body").empty();
	$.each( _obj, function(key, value) {
		var _html = "<span class='modal-lbl'><b>"+key.toUpperCase()+"</b></span> : <span>"+value+"</span><br/>";
		_modal.find(".modal-body").append(_html);
	});
	
	$(_modal).modal('show');
}

function customSearch(q,searchType){
	var url="";
	if(searchType=="name"){
		url="https://restcountries.eu/rest/v2/name/"+q;
	}
	else if(searchType=="capital"){
		url="https://restcountries.eu/rest/v2/capital/"+q;
	}
	else if(searchType=="language"){
		url="https://restcountries.eu/rest/v2/lang/"+q;
	}	
	else{
		url="https://restcountries.eu/rest/v2/all";
	}

	func_Block("#contentArea");
	$.ajax({
		url:url,
		type:'GET',
		dataType:'json',
		success:function(response){
			console.log(response);
			$(".list-group").empty();
			$("#filteredCount").text(response.length);
			for(var i=0;i<response.length;i++){
				createUI(response[i]);
			}
		},
		error:function(error){
			if(error.status===404){
				showEmptyView(error.responseJSON.message);
			}
		},
		complete:function(){
			func_UnBlock("#contentArea");
		},
	});
}


var countryNameArray = [];

function loadData(){
	func_Block("#contentArea");
	$.ajax({
		url:'https://restcountries.eu/rest/v2/all',
		type:'GET',
		dataType:'json',
		success:function(response){
			console.log(response);
			$("#filteredCount").text(response.length);
			$("#totalCount").text(response.length);
			//var reducedArray = response.slice(0,10);
			//countryNameArray = reducedArray; 
			$(".list-group").empty();
			for(var i=0;i<response.length;i++){
				createUI(response[i]);
				console.log(response[i]);
			}
		},
		error:function(){},
		complete:function(){
			func_UnBlock("#contentArea");
		},
	});
}

function createUI(element){
	//var html = "<li class='list-group-item'>"+element.name+"<span class='glyphicon glyphicon-info-sign pull-right info-icon' data-key='"+encodeURIComponent(JSON.stringify(element))+"'></span></li>";
	var strObj = JSON.stringify(element);
	strObj = strObj.replace(/'/g, '');
	var html = "<li class='list-group-item'>"+element.name+"<span class='glyphicon glyphicon-info-sign pull-right info-icon' data-key='"+strObj+"'></span></li>";
	$(".list-group").append(html);
}

function showEmptyView(msg){
	var emptyViewHtml = "<li class='list-group-item'>"+
					"<div class='text-center'>"+
					"<span class='glyphicon glyphicon-remove' style='font-size:30px'></span>"+
					"<h3>"+msg+"</h3></div>"+
					"</li>";
	$("#filteredCount").text("0");
	$(".list-group").empty();
	$(".list-group").append(emptyViewHtml);
}

function func_Block(_element){
	$(_element).block({ 
        message: '<p>Processing...</p>', 
    }); 
}
function func_UnBlock(_element){
	$(_element).unblock();
}