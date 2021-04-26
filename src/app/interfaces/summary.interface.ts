/* eslint-disable @typescript-eslint/naming-convention */
export interface ISummary {
  algo: string;
  algorithms: string[];
  connection: {
    accepted: number;
    algo: string;
    avg_time: number;
    av_time_ms: number;
    diff: number;
    error_log: any[];
    failures: number;
    hashes_total: number;
    ip: string;
    ping: number;
    pool: string;
    rejected: number;
    tls: string;
    'tls-fingerprint': string;
    uptime: number;
    uptime_ms: number;
  };
  cpu: {
    '64_bit': boolean;
    aes: boolean;
    arch: string;
    assembly: string;
    avx2: boolean;
    backend: string;
    brand: string;
    cores: number;
    family: number;
    flags: string[];
    l2: number;
    l3: number;
    model: number;
    msr: string;
    nodes: number;
    packages: number;
    proc_info: number;
    stepping: number;
    threads: number;
    x64: boolean;
  };
  donate_level: number;
  features: string;
  hashrate: {
    highest: number;
    threads: number[][];
    total: number[];
  };
  hugepages: boolean;
  id: string;
  kind: string;
  paused: boolean;
  resources: {
    hardware_concurrency: number;
    load_aberate: number[];
    memory: {
      free: number;
      resident_set_memory: number;
      total: number;
    };
  };
  restricted: boolean;
  results: {
    avg_time: number;
    avg_time_ms: number;
    best: number[];
    diff_current: number;
    error_log: any[];
    hashes_total: number;
    shares_good: number;
    shares_total: number;
  };
  ua: string;
  uptime: number;
  version: string;
  worker_id: string;
}
