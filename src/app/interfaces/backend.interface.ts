export interface IBackend {
  algo: string;
  'argon2-impl': string;
  asm: string;
  'astrobwt-max-size': number;
  enabled: boolean;
  hashrate: number[];
  hugepages: number[];
  'hw-aes': boolean;
  memory: number;
  msr: boolean;
  priority: number;
  profile: string;
  threads: IBackendThread[];
  type: string;
}

export interface IBackendThread {
  affinity: number;
  av: number;
  hashrate: number[];
  intensity: number;
}
