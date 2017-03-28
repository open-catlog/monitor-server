'use strict';

exports.database = 'mongodb://localhost/monitor';
exports.cleanTime = 120;
exports.port = 6789;
exports.servers = ['192.168.0.101', '192.168.0.102', '192.168.0.103',
  '192.168.0.127', '192.168.0.128', '192.168.0.131', '192.168.0.132',
  '192.168.0.133', '192.168.0.204', '192.168.0.205'];
exports.tomcatServers = ['192.168.0.101', '127.0.0.1'];