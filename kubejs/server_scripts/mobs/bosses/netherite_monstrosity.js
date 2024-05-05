let $DamageSources = Java.loadClass('net.minecraft.world.damagesource.DamageSources')
let dSource = Utils.lazy(() => new $DamageSources(Utils.server.registryAccess()))

let entities = new Array();

EntityEvents.checkSpawn("cataclysm:netherite_monstrosity", event => {
    let entity = event.getEntity();
    if (!entity.isLiving()) return;
    /** @type {Internal.LivingEntity} */
    let monstrosity = event.entity
    monstrosity.persistentData.rageStack = 0;
})

EntityEvents.spawned("cataclysm:netherite_monstrosity", event => {
    let entity = event.getEntity();
    if (!entity.isLiving()) return;
    /** @type {Internal.LivingEntity} */
    let monstrosity = event.entity
    entities.push(monstrosity)
    monstrosity.persistentData.index = entities.length - 1;
    console.log(monstrosity.health)
})

EntityEvents.hurt("cataclysm:netherite_monstrosity", event => {
    let monstrosity = event.getEntity();
    let player = event.source.getActual();
    if (monstrosity == null || player == null) return
    let phase = monstrosity.persistentData.getBoolean('p2')

    if (!phase) {
        if (monstrosity.persistentData.getBoolean(player.uuid)) event.cancel();
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
        monstrosity.persistentData.putBoolean(player.uuid, true)
    }
    event.server.scheduleInTicks(4, () => monstrosity.persistentData.putBoolean(player.uuid, false))
})

LevelEvents.tick(event => {

    if (entities.length > 0) {
        entities.forEach(monstrosity => {
            if (!monstrosity.persistentData.getBoolean('p2')) {
                if (monstrosity.nbt.getBoolean("is_Berserk")) {
                    for (let i = 1; i <= 5; i++) {
                        event.server.scheduleInTicks(i*10, () => monstrosity.health += 30)
                    }
                    monstrosity.persistentData.putBoolean('p2', true)
                }
            }
        })
    }
})

EntityEvents.death("cataclysm:netherite_monstrosity", event => {
    let monstrosity = event.getEntity();
    let mobAABB = monstrosity.boundingBox.inflate(10);
    monstrosity.getLevel().getEntitiesWithin(mobAABB).forEach(entity => {
        if (entity == null || !entity.player) return
        entity.tell(Text.translate("pixelquest.bosses.netherite_monstrosity.death").gray())
    })
    let i = monstrosity.persistentData.index
    entities.slice(i, i)
})