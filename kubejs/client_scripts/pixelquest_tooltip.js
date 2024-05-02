ItemEvents.tooltip(tooltip => {
    tooltip.addAdvanced('kubejs:pixelquest_research_blueprint', (item, advanced, text) => {
        if (!item.hasNBT()) return
        let researchTag = item.getNbt()
        if (!researchTag.getString("Research")) return
        let researchKey = "pixelquest.research." + researchTag.getString("Research")

        text.add(1, Text.translate('desc.pixelquest.tooltip.contain_research', Text.translate(researchKey).darkPurple()).gray())
    })
})