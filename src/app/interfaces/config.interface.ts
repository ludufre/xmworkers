/* eslint-disable @typescript-eslint/naming-convention */
export interface IConfig {
  api: {
    id: string;
    'worker-id': string;
  };
  autosave: boolean;
  background: boolean;
  colors: boolean;
  cpu: {
    argon2: number[];
    'argons2-impl': number[];
    asm: boolean;
    astrobwt: number[];
    'astrobwt-avx2': boolean;
    'astrobwt-max-size': number;
    cn: number[][];
    'cn-heavy': number[][];
    'cn-lite': number[][];
    'cn-lite/0': boolean;
    'cn-pico': number[][];
    'cn/0': boolean;
    'cn/upx2': number[][];
    enabled: boolean;
    'huge-pages': boolean;
    'huge-pages-jit': boolean;
    'hw-aes': boolean;
    'memory-pool': boolean;
    priority: any;
    rx: number[];
    'rx/arq': string;
    'rx/keva': string;
    'rx/wow': number[];
    yield: boolean;
  };
  dmi: boolean;
  dns: {
    ipv6: boolean;
    ttl: number;
  };
  'donate-level': number;
  'donate-over-proxy': number;
  http: {
    'access-token': string;
    enabled: boolean;
    host: string;
    port: number;
    restricted: boolean;
  };
  'log-tile': any;
  'pause-on-active': boolean;
  'pause-on-battery': boolean;
  pools: IConfigPool[];
  'print-time': number;
  randomx: {
    '1gb-pages': boolean;
    cache_qos: boolean;
    init: number;
    'init-avx2': number;
    mode: string;
    numa: boolean;
    rdmsr: boolean;
    scratchpad_prefetch_mode: number;
    wrmsr: boolean;
  };
  retires: number;
  'retry-pause': number;
  syslog: boolean;
  title: boolean;
  tls: {
    cert: any;
    cert_key: any;
    ciphers: any;
    ciphersuites: any;
    dhparam: any;
    enabled: boolean;
    protocols: any;
  };
  'user-agent': any;
  verbose: number;
  watch: boolean;
}

export interface IConfigPool {
  algo: any;
  coin: any;
  daemon: boolean;
  enabled: boolean;
  keepalive: boolean;
  nicehash: boolean;
  pass: string;
  'rig-id': string;
  'self-select': any;
  socks5: any;
  'submit-to-origin': boolean;
  tls: boolean;
  'tls-fingerprint': string;
  url: string;
  user: string;
};
