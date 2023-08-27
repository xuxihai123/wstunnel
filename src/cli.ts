import commander from 'commander';
import fs from 'fs';
import path from 'path';
import { readFile } from './utils/readfile';
import { TunnelOpts } from './types';
import Tunnel from './Tunnel';

const pkgObj = readFile(path.resolve(__dirname, '../package.json'), true);

commander
    .description('Starts the wstunnel')
    .option('-l, --listen <listenAddr>', 'set client local addr')
    .option('-t, --target <targetAddr>', 'set web tunnel subdomain')
    .action((cmd: any) => {
        const tunnelOpts: TunnelOpts = {
            listenAddr: cmd.listen,
            targetAddr: cmd.target,
        };

        console.log(tunnelOpts);

        const tunnel = new Tunnel(tunnelOpts);
        tunnel.bootstrap();
    });

commander.version(pkgObj.version);
commander.parse(process.argv);
if (!process.argv.slice(2).length) {
    commander.outputHelp();
}
