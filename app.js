var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
const axios = require('axios');

app.use(express.static(path.join(__dirname, '/client')));


var wss = new WebSocketServer({ server: server });

// sample data test only
//const BLOCKCHAIN_URL = 'https://api.blockcypher.com/v1/btc/main/txs?limit=10';
//const BLOCKCHAIN_URL = 'https://api.blockchair.com/ethereum/blocks?limit=10';

// production 
//const BLOCKCHAIN_URL = 'http://api.localhost:8000/chain/blocks?limit=10';

//development
const BLOCKCHAIN_URL = 'http://172.18.1.0:22000';

wss.on('connection', function(ws) {

  var id = setInterval(function() {
    var data = {}
    data.dateTime = new Date() 
    data.blockchain = null;

    getNumberBlocks()
    .then(response => {
      data.blockchain = response.data.result;
      ws.send(JSON.stringify(data), function() {
        /* ignore errors */
      });
    })
    .catch(error => {
      console.log(error);
    });

  }, 10000);

  console.log('started client interval');

  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);
  });

});

server.on('request', app);
server.listen(8080, function() {
  console.log('Listening on http://localhost:8080');
});


function getNumberBlocks(){
  return axios({
    method: 'post',
    url: BLOCKCHAIN_URL,
    data: {
      'jsonrpc': '2.0',
      'method': 'eth_blockNumber',
      'params': [],
      'id':1
    }
  });
  
}


function getBlocksInfo(){
  return axios({
    method: 'post',
    url: BLOCKCHAIN_URL,
    data: {
      'jsonrpc': '2.0',
      'method': 'eth_getBlockByNumber',
      'params': ["0x1c",true],
      'id':1
    }
  });
}
