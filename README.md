# XMWorkers - XMRig Open Source Dashboard

Based on http://workers.xmrig.info, but Open Source and with some extras.

I recently started in the mining world. But because of the price of GPUs I looked for an alternative to mine with CPU. So I got to know XMRig and started using it together with the dashboard made available by its creators. But I missed some things on that dashboard. So I decided to implement some things on my own.

I chose to use Angular because it is a language that I feel more comfortable with.

## Features

### Features from original dashboard

- List of workers with hashrates, results and pools statistics.
- Per worker backend information
- Online config.json editor
- Live update configurable
- Import & Export workers

### New features

- List of workers sort by name
- Sum of hashrate and results
- Pause & Resume worker
- Latest XMRig version checker

### TO DO

- List of worker sort with all columns
- Implement PIN authentication
- (put your feature here)

## Hosted version

http://xmworkers.ludufre.com

Because of lack support of HTTPS on Miner API, we can only host the dashboard without HTTPS... ([more details](https://love2dev.com/blog/chrome-mixed-content/))

You can import you current list in `Add` button. Just paste the exported URL from original dashboard.

## Credits

[@xmrig](https://github.com/xmrig) - creator of this amazing Miner and Dashboard

## Development

Built with Angular, Bootstrap and FontAwesome.

Install dependencies with `yarn install`.

Run `npx ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `npx ng` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
