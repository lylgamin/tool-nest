export type PortEntry = {
  port: number
  protocol: 'TCP' | 'UDP' | 'TCP/UDP'
  service: string
  description: string
  category: 'web' | 'email' | 'file' | 'database' | 'security' | 'remote' | 'dns' | 'other'
}

export const PORT_ENTRIES: PortEntry[] = [
  // FTP
  { port: 20, protocol: 'TCP', service: 'FTP Data', description: 'FTPデータ転送チャンネル', category: 'file' },
  { port: 21, protocol: 'TCP', service: 'FTP Control', description: 'FTP制御コマンドチャンネル', category: 'file' },
  // SSH / Telnet
  { port: 22, protocol: 'TCP', service: 'SSH', description: 'セキュアシェル（暗号化リモートアクセス）', category: 'remote' },
  { port: 23, protocol: 'TCP', service: 'Telnet', description: 'テルネット（平文リモートアクセス・非推奨）', category: 'remote' },
  // Email
  { port: 25, protocol: 'TCP', service: 'SMTP', description: 'メール送信プロトコル（サーバー間）', category: 'email' },
  // DNS
  { port: 53, protocol: 'TCP/UDP', service: 'DNS', description: 'ドメイン名解決サービス', category: 'dns' },
  // DHCP
  { port: 67, protocol: 'UDP', service: 'DHCP Server', description: 'DHCPサーバー（IPアドレス自動付与）', category: 'other' },
  { port: 68, protocol: 'UDP', service: 'DHCP Client', description: 'DHCPクライアント', category: 'other' },
  // Web
  { port: 80, protocol: 'TCP', service: 'HTTP', description: 'HyperText Transfer Protocol（平文Web通信）', category: 'web' },
  // Email
  { port: 110, protocol: 'TCP', service: 'POP3', description: 'メール受信プロトコル（旧来方式）', category: 'email' },
  // NTP
  { port: 123, protocol: 'UDP', service: 'NTP', description: 'ネットワーク時刻同期プロトコル', category: 'other' },
  // Email
  { port: 143, protocol: 'TCP', service: 'IMAP', description: 'メール受信プロトコル（サーバー保存方式）', category: 'email' },
  // SNMP
  { port: 161, protocol: 'UDP', service: 'SNMP', description: 'ネットワーク機器管理プロトコル', category: 'other' },
  { port: 162, protocol: 'UDP', service: 'SNMP Trap', description: 'SNMPトラップ受信', category: 'other' },
  // LDAP
  { port: 389, protocol: 'TCP/UDP', service: 'LDAP', description: 'ディレクトリサービスプロトコル（Active Directory等）', category: 'security' },
  // Web
  { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'HyperText Transfer Protocol Secure（TLS暗号化Web通信）', category: 'web' },
  // Email
  { port: 465, protocol: 'TCP', service: 'SMTPS', description: 'SMTP over TLS（メール送信・旧仕様）', category: 'email' },
  { port: 587, protocol: 'TCP', service: 'SMTP Submission', description: 'SMTPサブミッション（メールクライアントからの送信）', category: 'email' },
  // LDAPS
  { port: 636, protocol: 'TCP/UDP', service: 'LDAPS', description: 'LDAP over TLS（暗号化ディレクトリサービス）', category: 'security' },
  // Email
  { port: 993, protocol: 'TCP', service: 'IMAPS', description: 'IMAP over TLS（暗号化メール受信）', category: 'email' },
  { port: 995, protocol: 'TCP', service: 'POP3S', description: 'POP3 over TLS（暗号化メール受信）', category: 'email' },
  // Development servers
  { port: 3000, protocol: 'TCP', service: 'Dev Server', description: '開発サーバー（Node.js / React / Next.js 等でよく使われる）', category: 'web' },
  // Database
  { port: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQLデータベースサーバー', category: 'database' },
  // Remote
  { port: 3389, protocol: 'TCP', service: 'RDP', description: 'Windowsリモートデスクトッププロトコル', category: 'remote' },
  // Database
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQLデータベースサーバー', category: 'database' },
  // Development
  { port: 5000, protocol: 'TCP', service: 'Dev Server (5000)', description: '開発サーバー（Flask / Express 等でよく使われる）', category: 'web' },
  { port: 5001, protocol: 'TCP', service: 'Dev Server (5001)', description: '開発サーバー / ASP.NET Core HTTPS開発用', category: 'web' },
  // Remote
  { port: 5900, protocol: 'TCP', service: 'VNC', description: 'Virtual Network Computing（画面共有リモートアクセス）', category: 'remote' },
  // Database
  { port: 6379, protocol: 'TCP', service: 'Redis', description: 'Redisインメモリデータストア', category: 'database' },
  // Web alt
  { port: 8080, protocol: 'TCP', service: 'HTTP Alt', description: 'HTTP代替ポート（プロキシ・開発サーバー等）', category: 'web' },
  { port: 8443, protocol: 'TCP', service: 'HTTPS Alt', description: 'HTTPS代替ポート（開発・テスト環境等）', category: 'web' },
  // Jupyter
  { port: 8888, protocol: 'TCP', service: 'Jupyter Notebook', description: 'Jupyter Notebookデフォルトポート', category: 'web' },
  // Elasticsearch
  { port: 9200, protocol: 'TCP', service: 'Elasticsearch HTTP', description: 'ElasticsearchのHTTP API', category: 'database' },
  { port: 9300, protocol: 'TCP', service: 'Elasticsearch Cluster', description: 'Elasticsearchノード間クラスター通信', category: 'database' },
  // Database
  { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDBデータベースサーバー', category: 'database' },
  // Additional useful ports
  { port: 111, protocol: 'TCP/UDP', service: 'RPC', description: 'Sun RPCポートマッパー（NFSなどで使用）', category: 'other' },
  { port: 137, protocol: 'UDP', service: 'NetBIOS NS', description: 'NetBIOS名前解決サービス（Windows）', category: 'other' },
  { port: 139, protocol: 'TCP', service: 'NetBIOS Session', description: 'NetBIOSセッション（Windowsファイル共有）', category: 'file' },
  { port: 445, protocol: 'TCP', service: 'SMB', description: 'Server Message Block（Windowsファイル・プリンター共有）', category: 'file' },
  { port: 1433, protocol: 'TCP', service: 'MS SQL Server', description: 'Microsoft SQL Serverデータベース', category: 'database' },
  { port: 1521, protocol: 'TCP', service: 'Oracle DB', description: 'Oracle Databaseリスナーポート', category: 'database' },
  { port: 2181, protocol: 'TCP', service: 'ZooKeeper', description: 'Apache ZooKeeper分散コーディネーターサービス', category: 'other' },
  { port: 4200, protocol: 'TCP', service: 'Angular Dev', description: 'Angular開発サーバー（ng serve）', category: 'web' },
  { port: 5173, protocol: 'TCP', service: 'Vite Dev', description: 'Vite開発サーバーのデフォルトポート', category: 'web' },
  { port: 6443, protocol: 'TCP', service: 'Kubernetes API', description: 'Kubernetes APIサーバー（HTTPS）', category: 'other' },
  { port: 9090, protocol: 'TCP', service: 'Prometheus', description: 'Prometheusメトリクス監視サーバー', category: 'other' },
  { port: 9092, protocol: 'TCP', service: 'Kafka', description: 'Apache Kafkaブローカー', category: 'other' },
  { port: 11211, protocol: 'TCP/UDP', service: 'Memcached', description: 'Memcachedインメモリキャッシュ', category: 'database' },
  { port: 15672, protocol: 'TCP', service: 'RabbitMQ Management', description: 'RabbitMQ管理コンソール（HTTP）', category: 'other' },
  { port: 27018, protocol: 'TCP', service: 'MongoDB Shard', description: 'MongoDBシャードサーバー', category: 'database' },
]

export function searchPorts(query: string, category: string): PortEntry[] {
  let results = PORT_ENTRIES
  if (category) {
    results = results.filter(p => p.category === category)
  }
  if (!query) return results
  const q = query.toLowerCase()
  return results.filter(p =>
    p.port.toString().includes(q) ||
    p.service.toLowerCase().includes(q) ||
    p.description.includes(q) ||
    p.protocol.toLowerCase().includes(q)
  )
}
