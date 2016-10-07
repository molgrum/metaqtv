var fs = require('fs');
var http = require('http');
var timers = require('timers');
var express = require('express');
var DOMParser = require('xmldom').DOMParser;

var qtvservers = [
    { host: 'bfg10k.traxo.net', port: 28000 },
    { host: 'de.refragged.com', port: 28000 },
    { host: 'dm2.se', port: 28000 },
    { host: 'escaflowne.hro.nl', port: 28000 },
    //{ host: 'fanatiks.de', port: 28000 },
    { host: 'feffsson.se', port: 28000 },
    { host: 'fnu.nu', port: 28000 },
    { host: 'goodolddays.traxo.net', port: 28000 },
    { host: 'lon.qw.traxo.net', port: 28000 },
    { host: 'duelmania.net', port: 28000 },
    { host: 'spo.duelmania.net', port: 28000 },
    { host: 'nl.badplace.eu', port: 28000 },
    { host: 'osund.com', port: 28000 },
    { host: 'pacific.besmella.com', port: 28000 },
    { host: 'sfo.besmella.com', port: 28000 },
    { host: 'qtv.froschroom.com', port: 28000 },
    { host: 'quakeworld.fi', port: 28000 },
    { host: 'qw.baseq.fr', port: 28000 },
    { host: 'qw.dybbuk.de', port: 28000 },
    { host: 'qw.e-bash.ru', port: 28000 },
    { host: 'qw.net.pl', port: 28000 },
    { host: 'qw.org.pl', port: 28000 },
    { host: 'qw1.irc.ax', port: 27510 },
    { host: 'qwfr.sobol.org', port: 28000 },
    { host: 'woohooyeah.nl', port: 28000 },
    { host: 'za.refragged.com', port: 28000 },
    { host: 'zntz.se', port: 28000 }
];

function Update()
{
    function GetFeed(qtvserver)
    {
        var options = {
            host: qtvserver['host'],
            port: qtvserver['port'],
            path: '/rss',
            method: 'GET'
        };
        callback = function(response)
        {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
        
            response.on('end', function () {
                var mvdservers = [];

                var parser = new DOMParser();
                var doc = parser.parseFromString(str, 'text/xml');

                var itemnodes = doc.getElementsByTagName('item');
                for (var i = 0; i < itemnodes.length; i++)
                {
                    var mvdserver = {};
                    var itemnode = itemnodes[i];
                    mvdserver['address'] = itemnode.getElementsByTagName('title')[0].textContent;
                    mvdserver['map'] = itemnode.getElementsByTagName('map')[0].textContent;
                    mvdserver['status'] = itemnode.getElementsByTagName('status')[0].textContent;
                    mvdserver['observercount'] = itemnode.getElementsByTagName('observercount')[0].textContent;

                    var link = itemnode.getElementsByTagName('link')[0].textContent;
                    var qtvaddress = link.match(/^http:\/\/(.*)\/watch.qtv\?sid=\d+$/)[1];
                    var sid = link.match(/^.*sid=(\d+)$/)[1];
                    mvdserver['watchlink'] = 'qw://' + sid + '@' + qtvaddress + '/qtvplay';

                    mvdserver['playlink'] = 'qw://' + mvdserver['address'];

                    var players = [];
                    var playernodes = itemnode.getElementsByTagName('player');
                    for (var j = 0; j < playernodes.length; j++)
                    {
                        var player = {};
                        var playernode = playernodes[j];
                        player['name'] = playernode.getElementsByTagName('name')[0].textContent;
                        player['team'] = playernode.getElementsByTagName('team')[0].textContent;
                        player['frags'] = playernode.getElementsByTagName('frags')[0].textContent;
                        player['ping'] = playernode.getElementsByTagName('ping')[0].textContent;
                        player['pl'] = playernode.getElementsByTagName('pl')[0].textContent;
                        player['topcolor'] = playernode.getElementsByTagName('topcolor')[0].textContent;
                        player['bottomcolor'] = playernode.getElementsByTagName('bottomcolor')[0].textContent;
                        players.push(player);
                    }
                    mvdserver['players'] = players;

                    mvdservers.push(mvdserver);
                }
                qtvserver['mvdservers'] = mvdservers;
            });
        }
        var req = http.request(options, callback);
            req.on('error', function (error)
            {
                console.log(error);
            })
            .end();
    }

    for (var i in qtvservers)
    {
        GetFeed(qtvservers[i]);
    }
}

timers.setImmediate(Update);
timers.setInterval(Update, 30000);

var app = express();
app.use(express.static('public'));

app.get('^/qtvservers$', function (req, res)
{
    res.status(200);
    res.type('json');
    res.send(qtvservers);          
});

var server = http.createServer(app);
server.listen(3000);
console.log('Server started...');

