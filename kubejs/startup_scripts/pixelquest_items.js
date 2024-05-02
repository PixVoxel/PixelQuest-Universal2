StartupEvents.registry('item', event => {
    event.create('pixelquest_blueprint')
        .rarity('Rare')
        .texture("pixelquest:item/blueprint")
    event.create('pixelquest_research_blueprint')
        .unstackable()
        .rarity('Epic')
        .texture("pixelquest:item/research_blueprint")
})