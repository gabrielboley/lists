var db = new PouchDB('fridge');
var remoteCouch = false;

db.changes({
  since: 'now',
  live: true
}).on('change', openFridge);

function putInFridge(obj) {
  var item = {
    _id: new Date().toISOString(),
    name: obj.name,
    image: obj.images[0],
    gtin: obj.gtin
  };
  db.put(item, function callback(err, result) {
    if (!err) {
      $('#checkinInput').val('').focus();
    }
  });
}

function removeFromFridge(id, rev){	
	db.remove(id, rev);
}

function redrawTodosUI(todos) {
    var ul = document.getElementById('results');
    ul.innerHTML = '';
    todos.forEach(function(todo) {
    	$('#results').append('<li><button class="btn btn-defult" data-id="'+todo.doc._rev+'" value="'+todo.doc._id+'">Remove</button>'+todo.doc.name+'</li>');
    });
  }

function openFridge() {
  db.allDocs({include_docs: true, descending: true}, function(err, doc) {
    redrawTodosUI(doc.rows);
  });
}

var getInput = _.debounce(function(upc){

	if(upc.length > 10){
		$.ajax({
			url: 'data.php',
			data: {upc:upc},
			type: 'post',
			dataType : 'json', 
			success: function(result){
	        	putInFridge(result);
	    	},
	    	error: function(e) {
		       console.log(e.message);
		    }
	    });
	}
},500);
$('input#checkinInput').keyup(function() {
	getInput($(this).val());
});
$('#results').on('click', '.btn', function(){
	//console.log($(this).val(), $(this).data('id'));
	removeFromFridge($(this).val(), $(this).data('id'));
})