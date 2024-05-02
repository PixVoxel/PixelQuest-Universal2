ItemEvents.modification(event => {
    //도구 내구도 조정
    event.modify(/minecraft:wooden_(shovel|pickaxe|axe|hoe|sword)/, item => {
        item.maxDamage = 29
    }),
    event.modify(/minecraft:stone_(shovel|pickaxe|axe|hoe|sword)/, item => {
        item.maxDamage = 65
    }),
    event.modify(/minecraft:iron_(shovel|pickaxe|axe|hoe|sword)/, item => {
        item.maxDamage = 125
    }),
    event.modify(/minecraft:golden_(shovel|pickaxe|axe|hoe|sword)/, item => {
        item.maxDamage = 16
    }),
    event.modify(/minecraft:diamond_(shovel|pickaxe|axe|hoe|sword)/, item => {
        item.maxDamage = 780
    }),
    event.modify(/minecraft:netherite_(shovel|pickaxe|axe|hoe|sword)/, item => {
        item.maxDamage = 1015
    }),
    event.modify('minecraft:shield', item => {
        item.maxDamage = 118
    })

    //엔더 진주 최대 중첩 조정
    event.modify('minecraft:ender_pearl', item => {
        item.maxStackSize = 8
    })
})