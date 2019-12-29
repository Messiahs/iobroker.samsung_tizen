"use strict";
const utils =    require('./lib/utils.js');
const adapter = utils.adapter('samsungTizen');
const wsfunction =    require('./lib/wsfunction.js');
const polling =    require('./lib/polling.js');
const objects =    require('./lib/objects.js');


adapter.on('stateChange', async function (id, state) {
    const key = id.split('.');
    if (id === adapter.name + '.' + adapter.instance + '.apps.getInstalledApps'){
        let response = await wsfunction.getApps();
        adapter.log.info(response);
    } 
    if (key[2] === 'apps' && id !== adapter.name + '.' + adapter.instance + '.apps.getInstalledApps'){
        const app = key[3].split('-'); 
        let response = await wsfunction.startApp(app[1]);
        adapter.log.info(response);
        } 
    if (key[3].toUpperCase() === 'SENDKEY'){
        let response = await wsfunction.sendKey(state.val);
        adapter.log.info(response);
    } else if (key[2] === 'control') {
        let response = await wsfunction.sendKey('KEY_' + key[3].toUpperCase());
        adapter.log.info(response);
    }
});

adapter.on('ready', function () {
main()
});
function main() {
    adapter.log.info(adapter.name + '.' + adapter.instance + ' NIGHTLY started with config : ' + JSON.stringify(adapter.config));
    objects.set();
    if (parseFloat(adapter.config.pollingInterval) > 0){polling.powerState();}
    adapter.subscribeStates('control.*');
    adapter.subscribeStates('apps.*');
    adapter.log.info(adapter.name + '.' + adapter.instance + ' NIGHTLY started with config : ' + JSON.stringify(adapter.config));
}