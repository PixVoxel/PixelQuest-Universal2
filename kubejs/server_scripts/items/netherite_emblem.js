let $DamageSources = Java.loadClass('net.minecraft.world.damagesource.DamageSources')
let dSource = Utils.lazy(() => new $DamageSources(Utils.server.registryAccess()))

EntityEvents.hurt("player", event => {
    let player = event.getEntity();
    let attacker = event.source.getActual();
    if (player == null || attacker == null) return;
    let curios = player.nbt.ForgeCaps['curios:inventory']
    if (event.source.getType() != 'magic') {
        if (curios.toString().contains('kubejs:pixelquest_netherite_emblem')) {
            if (player.persistentData.rageStack == null) player.persistentData.rageStack = 0;
            if (player.persistentData.rageStack % 5 == 4) {
                attacker.attack(dSource.get().magic(), event.damage)
                player.persistentData.rageStack = 0;
                player.health += event.damage
                if (attacker.player) {
                    attacker.statusMessage = Text.translate("pixelquest.bosses.netherite_monstrosity.counter").lightPurple().bold().italic()
                    attacker.tell(Text.translate("pixelquest.bosses.netherite_monstrosity.roaring_" + randomNumber).gray())
                }
            }
            else {
                let reflectCount = parseInt(3 - (player.persistentData.rageStack % 5))
                if (attacker.player) {
                    if (reflectCount == 0) attacker.statusMessage = Text.translate("pixelquest.bosses.netherite_monstrosity.warning_0")
                    else attacker.statusMessage = Text.translate("pixelquest.bosses.netherite_monstrosity.warning", reflectCount.toFixed(0))
                }
                player.persistentData.rageStack += 1;
            }
        }
    }
})