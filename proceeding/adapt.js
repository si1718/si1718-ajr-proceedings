const request = require('request');
 
request.get('https://si1718-ajr-proceedings.herokuapp.com/api/v1/proceedings', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    var editor_name = "";
    
    for(var i=0; i<body.length; i++) {
        //editor_name = body[i].editor.split(',');
        //search(body[i],editor_name);
        adapt_keyword(body[i]);
        
        //if(typeof body[i].editor === 'string') {
        //    console.log(body[i]);
        //    remove(body[i].idProceeding);
        //}
    }
  
});

function search(proceeding, editor_name) {
    request.get('http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers?search='+editor_name[0], { json: true }, (err, req, body) => {
        if (err) { return console.log(err); }
        var researcher = body[0];
        if(researcher) {
            proceeding.editor = {
                uri: 'http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/' + researcher.idResearcher,
                name: researcher.name,
                viewURL: researcher.viewURL
            };
            //console.log(body);
        } else {
            proceeding.editor = {
                uri: 'http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/0',
                name: proceeding.editor,
                viewURL: 'https://si1718-dfr-researchers.herokuapp.com/#!/researchers/0/edit'
            };
        }
        
        edit(proceeding);
    });
}

function edit(proceeding) {
    request({
        method: 'PUT', 
        url: 'https://si1718-ajr-proceedings-andjimrio.c9users.io/api/v1/proceedings/'+proceeding.idProceeding,
        json: proceeding,
    }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body);
    });
}

function remove(idProceeding) {
    request({method: 'DELETE', url: 'https://si1718-ajr-proceedings-andjimrio.c9users.io/api/v1/proceedings/'+idProceeding},(err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body);
    });
}

function adapt_keyword(proceeding) {
    var stop_words = ['el','la','los','las','de','del','of','the','a','an','-', 'and','on','en'
        ,'in','y','for','nº','e','i','o','u',':','un','uno','una','unas','unos','v','vol.','vol'];
    var keywords = proceeding.title.split(' ');
    var result = [];
    for(var i=0; i<keywords.length; i++) {
        var keyword = keywords[i].toLowerCase();
        if(!stop_words.includes(keyword)) {
            result.push(keyword);
        }
    }
    proceeding.keywords = result;
    //console.log(proceeding);
    edit(proceeding);
}