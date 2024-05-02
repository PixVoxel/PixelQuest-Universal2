ItemEvents.tooltip(tooltip => {


    function indentSpace(time) {
        let step
        let result = ""
        for (step = 0; step < time; step++) {
            result = result + " "
        }
        return result
    }

    //바닐라 도구 내구도 -50%
    function toolModified(modifiedTool) {
        tooltip.addAdvanced(modifiedTool, (item, advanced, text) => {
            text.remove(item)
            text.add(1, Text.translate("desc.pixelquest.tooltip.modified").gray())
            text.add(2, Text.of(indentSpace(1)).append(Text.translate("desc.pixelquest.tooltip.modified.properties", "-50%", Text.translate("pixelquest.properties.durability")).red()))
        })
    }

    toolModified(/minecraft:(wooden|stone|iron|golden|diamond|netherite)_(shovel|pickaxe|axe|hoe|sword)/)
    toolModified('minecraft:shield')

    //엔더 진주 최대 중첩 수 -8
    tooltip.addAdvanced('minecraft:ender_pearl', (item, advanced, text) => {
        text.add(1, Text.translate("desc.pixelquest.tooltip.modified").gray())
        text.add(2, Text.translate("desc.pixelquest.tooltip.modified.properties", "-8", Text.translate("pixelquest.properties.maxStackSize")).red())
    })


    function enchantModified(modifiedEnchantments) {
        tooltip.addAdvanced('minecraft:enchanted_book', (item, advanced, text) => {
            var modifiedBook = false
            modifiedEnchantments.forEach(enchantment => {
                if (item.getEnchantments().containsKey(enchantment)) {
                    modifiedBook = true;
                    return false;
                }
            })

            if (modifiedBook) text.add(1, Text.translate("desc.pixelquest.tooltip.modified").gray())
        })
    }

    function enchantModifiedAll(enchantment, enchantable, tradable, lootable) {
        tooltip.addAdvanced('minecraft:enchanted_book', (item, advanced, text) => {
            let line = 1;
            let enchantmentKey = enchantment.substring(0, enchantment.indexOf(':')) + '.' + enchantment.substring(enchantment.indexOf(':')+1)
            if (!item.getEnchantments().containsKey(enchantment)) return;
            text.add(line++, Text.of(indentSpace(1)).append(Text.translate("enchantment." + enchantmentKey).append(":").red()))
            if (!enchantable) text.add(line++, Text.of(indentSpace(2)).append(Text.translate("desc.pixelquest.tooltip.modified.not_enchant").red()))
            if (!lootable) text.add(line++, Text.of(indentSpace(2)).append(Text.translate("desc.pixelquest.tooltip.modified.not_lootable").red()))
            if (!tradable) text.add(line++, Text.of(indentSpace(2)).append(Text.translate("desc.pixelquest.tooltip.modified.not_tradable").red()))
            text.add(line, Text.of(""))
        })
    }
    function enchantModifiedLevel(enchantment, enchantable, tradable, lootable, level){
        tooltip.addAdvanced('minecraft:enchanted_book', (item, advanced, text) => {
            let line = 1;
            let enchantmentKey = enchantment.substring(0, enchantment.indexOf(':')) + '.' + enchantment.substring(enchantment.indexOf(':')+1)
            if (!item.getEnchantments().containsKey(enchantment)) return;
            if (item.getEnchantments().get(enchantment) != level) return;
            text.add(line++, Text.of(indentSpace(1)).append(Text.translate("enchantment." + enchantmentKey).append(" ").append(Text.translate("enchantment.level." + item.getEnchantments().get(enchantment))).append(":").red()))
            if (!enchantable) text.add(line++, Text.of(indentSpace(2)).append(Text.translate("desc.pixelquest.tooltip.modified.not_enchant").red()))
            if (!lootable) text.add(line++, Text.of(indentSpace(2)).append(Text.translate("desc.pixelquest.tooltip.modified.not_lootable").red()))
            if (!tradable) text.add(line++, Text.of(indentSpace(2)).append(Text.translate("desc.pixelquest.tooltip.modified.not_tradable").red()))
            text.add(line, Text.of(""))
        })
    }

    enchantModifiedAll('minecraft:mending', false, false, false)
    enchantModifiedAll('ensorcellation:soulbound', false, false, false)
    enchantModifiedAll('ensorcellation:vorpal', false, false, false)
    enchantModifiedAll('ensorcellation:vitality', false, false, false)
    enchantModifiedAll('hmag:health_boost', false, false, false)
    enchantModified(['minecraft:mending', 'ensorcellation:soulbound', 'ensorcellation:vorpal', 'ensorcellation:vitality', 'hmag:health_boost'])
})