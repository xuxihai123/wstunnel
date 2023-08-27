# wstunnel




# example


## ws=>tcp

```bash
npx tsx src/cli.ts -l ws://127.0.0.1:4800 -t tcp://127.0.0.1:4900
```


## tcp=>ts

```bash
npx tsx src/cli.ts -l tcp://127.0.0.1:4000 -t ws://127.0.0.1:4800
```
