MoreJSEvents.filterEnchantedBookTrade(event => {
    event.remove("minecraft:mending")
    event.remove("ensorcellation:soulbound")
    event.remove("ensorcellation:vorpal")
    event.remove("ensorcellation:vitality")
    event.remove("hmag:health_boost")

})

MoreJSEvents.filterAvailableEnchantments(event => {
    event.remove("minecraft:mending")
    event.remove("ensorcellation:soulbound")
    event.remove("ensorcellation:vorpal")
    event.remove("ensorcellation:vitality")
    event.remove("hmag:health_boost")
})

LootJS.modifiers(event => {
    event
        .addLootTypeModifier(LootType.CHEST)
        .removeLoot(ItemFilter.hasEnchantment('minecraft:mending'))
        .removeLoot(ItemFilter.hasEnchantment('ensorcellation:soulbound'))
        .removeLoot(ItemFilter.hasEnchantment('ensorcellation:vorpal'))
        .removeLoot(ItemFilter.hasEnchantment('ensorcellation:vitality'))
        .removeLoot(ItemFilter.hasEnchantment('hmag:health_boost'))
})