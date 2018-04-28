var data = JSON.parse($('#data-forums').text());
var forums = data.forums;
var fid = data.forum.fid;
var selected = [];
var exchange = [];
var level1 = [
	{
		displayName: '作为主板',
		fid: null
	}
];
var forumsDiv = $('#forumsDiv');
var childrenForumsDiv = $('#childrenForumsDiv');
var childrenFid = [];
$(function() {

	for(var i = 0; i < forums.length; i++) {
		var forum = forums[i];
		if(!forum.parentId) {
			level1.push(forum);
		}
	}

	childrenFid = getChildrenForums(fid, 'fid');
	createChildForums(childrenFid);


	forumsDiv.append(createSelect(level1));
});

function createChildForums(arr) {
	if(arr.length === 0) {
		childrenForumsDiv.html('暂无分类');
	} else {
		childrenForumsDiv.html('');
	}

	for(var i = 0; i < arr.length; i++) {
		var forum = arr[i];
		if(typeof(forum) === 'string') {
			forum = getForumByFid(forum);
		}
		var span = newElement('span', {
			'onclick': 'exchangeChildForum("'+forum.fid+'")',
			'data-fid': forum.fid
		}, {
			'display': 'inline-block',
			'padding': '0.5rem',
			'background-color': forum.color,
			'border-radius': '5px',
			'color': '#ffffff',
			'margin-right': '0.5rem',
			'cursor': 'pointer',
			'border': '2px solid #ffffff'
		}).text(forum.displayName);
		childrenForumsDiv.append(span);
	}
}

function exchangeChildForum(fid) {
	if(exchange.length === 0) {
		exchange.push(fid);
		$('span[data-fid="'+fid+'"]').css('border', '2px solid #555555');
	} else {
		exchange.push(fid);
		var index = childrenFid.indexOf(exchange[0]);
		var index2 = childrenFid.indexOf(exchange[1]);
		childrenFid.splice(index, 1, exchange[1]);
		childrenFid.splice(index2, 1, exchange[0]);
		$('span[data-fid="'+exchange[0]+'"]').css('border', '2px solid #ffffff');
		exchange = [];
		createChildForums(childrenFid);
	}
}

function createSelect(arr, fid) {
	var select = newElement('select', {
		class: 'form-control',
		onchange: 'selectForum(this.value)'
	}, {});
	for(var i = 0; i < arr.length; i++) {
		var forum = arr[i];
		if(forum.fid !== window.fid){
			select.append(createOption(forum, (forum.fid === fid)));
		}
	}
	return select;
}

function createOption(forum, type) {
	var option = newElement('option', {}, {}).text(forum.displayName);
	if(type) {
		option.attr('selected', true)
	}
	return option;
}

function getFid(name) {
	var fid = null;
	for(var i = 0; i < forums.length; i++) {
		var forum = forums[i];
		if(forum.displayName === name) {
			fid = forum.fid;
			break;
		}
	}
	return fid;
}

function selectForum(name){
	selected = [];
	var fid = getFid(name);
	if(fid) {
		selected.push(fid);
		while (1) {
			var parentForum = getParentForum(fid);
			if(parentForum) {
				selected.unshift(parentForum.fid);
				fid = parentForum.fid;
			} else {
				break;
			}
		}
	}
	showSelect();
}

function getChildrenForums(fid, type) {
	var childrenForums = [];
	for(var i = 0; i < forums.length; i++) {
		var forum = forums[i];
		if(forum.parentId === fid) {
			if(type === 'fid') {
				childrenForums.push(forum.fid);
			} else {
				childrenForums.push(forum);
			}
		}
	}
	return childrenForums;
}

function getParentForum(fid) {
	var parentForum = null;
	var forum = getForumByFid(fid);
	for(var i = 0; i < forums.length; i++) {
		if(forum.parentId === forums[i].fid) {
			parentForum = forums[i];
		}
	}
	return parentForum;
}

function getForumByFid(fid) {
	var forum;
	for(var i = 0; i < forums.length; i++) {
		if(forums[i].fid === fid) {
			forum = forums[i];
			break;
		}
	}
	return forum;
}


function showSelect() {
	forumsDiv.html('');

	for(var i = 0; i < selected.length; i++) {
		var fid = selected[i];
		if(i === 0) {
			forumsDiv.append(createSelect(level1, fid));
		} else {
			var parentFid = selected[i-1];
			var nowForums = getChildrenForums(parentFid);
			if(nowForums.length > 0) {
				forumsDiv.append(createSelect(nowForums, fid));
			}
		}
		if(i === (selected.length - 1)) {
			var childrenForums = getChildrenForums(fid);
			if(childrenForums.length > 0) {
				childrenForums.unshift({
					fid: null,
					displayName: '当前'
				});
				forumsDiv.append(createSelect(childrenForums, null));
			}
		}
	}

	if(selected.length === 0) {
		forumsDiv.append(createSelect(level1, null));
	}
}

function moveForum(fid) {
	var obj = {
		parentId: null,
		operation: 'savePosition'
	};
	if(selected.length > 0) {
		obj.parentId = selected[(selected.length - 1)];
	}
	nkcAPI('/f/'+fid+'/settings/category', 'PATCH', obj)
		.then(function() {
			window.location.reload();
		})
		.catch(function(data) {
			screenTopWarning(data.error || data);
		})
}


function submit(fid) {
	var obj = {
		operation: 'saveOrder',
		childrenFid: childrenFid
	};
	nkcAPI('/f/'+fid+'/settings/category', 'PATCH', obj)
		.then(function() {
			screenTopAlert('保存成功');
		})
		.catch(function(data) {
			screenTopWarning(data.error || data);
		})

}