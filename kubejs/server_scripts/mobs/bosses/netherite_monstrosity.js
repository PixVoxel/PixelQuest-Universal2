let $DamageSources = Java.loadClass('net.minecraft.world.damagesource.DamageSources')
let dSource = Utils.lazy(() => new $DamageSources(Utils.server.registryAccess()))

let monstrosity_list = new Array()

EntityEvents.checkSpawn("cataclysm:netherite_monstrosity", event => {
    let monstrosity = event.getEntity();
    monstrosity.persistentData.rageStack = 0;
    monstrosity.persistentData.invTime = 0;
})

EntityEvents.spawned("cataclysm:netherite_monstrosity", event => {
    let monstrosity = event.getEntity();
    monstrosity_list.push(monstrosity.uuid)
})

LevelEvents.tick(event => {
    monstrosity_list.forEach(mon_uuid => {
        let entity = event.level.getEntity(mon_uuid);
        if (entity == null) return
        if (entity.persistentData.invTime > 0) {
            entity.persistentData.invTime -= 1
        }
    })
})

EntityEvents.hurt("cataclysm:netherite_monstrosity", event => {
    let monstrosity = event.getEntity();
    if (monstrosity.persistentData.invTime > 0) event.cancel();
    let player = event.source.getActual();
    if (monstrosity == null || player == null) return
    if (monstrosity.persistentData.rageStack % 5 == 4) {
        let randomNumber = parseInt(Math.floor((Math.random() * 99) + 1) % 2)
        player.attack(dSource.get().magic(), event.damage)
        monstrosity.persistentData.rageStack = 0;
        player.statusMessage = Text.translate("pixelquest.bosses.netherite_monstrosity.counter").lightPurple().bold().italic()
        player.tell(Text.translate("pixelquest.bosses.netherite_monstrosity.roaring_" + randomNumber).gray())
    }
    else {
        let reflectCount = parseInt(3 - monstrosity.persistentData.rageStack)
        if (reflectCount == 0) player.statusMessage = Text.translate("pixelquest.bosses.netherite_monstrosity.warning_0")
        else player.statusMessage = Text.translate("pixelquest.bosses.netherite_monstrosity.warning", reflectCount.toFixed(0))
        monstrosity.persistentData.rageStack += 1;
    }
    monstrosity.persistentData.invTime = 4;
})

EntityEvents.death("cataclysm:netherite_monstrosity", event => {
    let monstrosity = event.getEntity();
    let mobAABB = monstrosity.boundingBox.inflate(10);
    monstrosity.getLevel().getEntitiesWithin(mobAABB).forEach(entity => {
        if (entity == null || !entity.player) return
        entity.tell(Text.translate("pixelquest.bosses.netherite_monstrosity.death").gray())
    })
    for (let i = 0; i < monstrosity_list.length; i++) {
        if (monstrosity_list[i] == monstrosity.uuid) {
            monstrosity_list.splice(i, i);
            break;
        }
    }
})

