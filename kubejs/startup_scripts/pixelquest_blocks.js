StartupEvents.registry('block', event => {
    event.create('pixelquest_research_table', 'cardinal')
        .soundType('wood')
        .model("pixelquest:block/research_table")
        .defaultTranslucent()
        .transparent(true)
        .blockEntity(entityInfo => {})
})