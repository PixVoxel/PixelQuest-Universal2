function getRandSculkMonster() {
    const spawnChance = Math.floor((Math.random() * 99) + 1)
    const mobList = [
        'sculkhorde:sculk_phantom_corpse',
        'sculkhorde:sculk_spore_spewer',
        'sculkhorde:sculk_bee_infector',
        'sculkhorde:sculk_bee_harvester',
        'sculkhorde:sculk_ravager',
        'sculkhorde:sculk_creeper',
        'sculkhorde:sculk_phantom',
        'sculkhorde:sculk_vindicator',
        'sculkhorde:sculk_spitter',
        'sculkhorde:sculk_hatcher',
        'sculkhorde:sculk_mite_aggressor',
        'sculkhorde:sculk_mite',
        'sculkhorde:sculk_zombie'
    ]
    const mobChance = [1, 1, 5, 5, 5, 5, 7, 7, 7, 7, 15, 15, 20]
    let cumulative = 0
    for (let i = 0; i < mobList.length; i++) {
        cumulative += mobChance[i]
        if (spawnChance <= cumulative) {
            return mobList[i]
        }
    }
    return null
}

function isSculkWorld(block) {
    if (block.getDimension() == 'pixelquest:sculk_world') {
        return true
    }
    return false
}

function spawnRandomSculkHorde(block) {
    let sculkMob = getRandSculkMonster()
    if (!sculkMob) return;
    const spawnSculk = block.createEntity(sculkMob)
    spawnSculk.setX(block.x)
    spawnSculk.setY(block.y)
    spawnSculk.setZ(block.z)
    spawnSculk.spawn()
}

BlockEvents.broken('minecraft:sculk_catalyst', event => {
    if (isSculkWorld(event.block)) {
        spawnRandomSculkHorde(event.block)
    }
})